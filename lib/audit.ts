import {
  AuditResult,
  DimensionScore,
  MandatoryCheck,
  MissingTheme,
} from "./types";
import { getTrackByName, TrackDefinition } from "./tracks";

type AuditInput = {
  roleTrack: string;
  targetTitle?: string;
  company?: string;
  cvText: string;
  jobText: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

/**
 * Generic themes for Project Manager / Senior Project Manager tracks,
 * used to group missing JD keywords into recruiter-style "areas to strengthen".
 */
const PM_THEMES: Record<string, string[]> = {
  "Delivery & control": ["scope", "schedule", "budget", "raid", "change request"],
  "Methodology": ["waterfall", "pmbok", "ceremony", "stand-up", "retro"],
  "Stakeholders & governance": [
    "stakeholder",
    "steering committee",
    "status report",
    "executive",
  ],
  "Customers & clients": ["customer", "client"],
  "Commercials": ["budget", "p&l", "margin", "pricing", "change order", "proposal"],
};

function groupMissingByTheme(
  missing: string[],
  themes: Record<string, string[]>
): MissingTheme[] {
  const result: MissingTheme[] = [];

  Object.entries(themes).forEach(([themeName, themeKeywords]) => {
    const hits = missing.filter((kw) =>
      themeKeywords.includes(kw.toLowerCase())
    );
    if (hits.length > 0) {
      result.push({ name: themeName, keywords: hits });
    }
  });

  return result;
}

/**
 * JD-aware dimension scoring:
 * - Uses the subset of generic dimension keywords that the JD actually mentions.
 * - Fallback: if JD is vague but CV clearly shows this competency, give a modest baseline score.
 */
function scoreDimension(
  dimension: TrackDefinition["dimensions"][number],
  cvTokens: Set<string>,
  jdTokens: Set<string>
): DimensionScore {
  const dimKeywords = dimension.keywords.map((kw) => kw.toLowerCase());

  // JD-relevant subset: generic dimension keywords that appear in the JD
  const jdRelevant = dimKeywords.filter((kw) => jdTokens.has(kw));

  // CV coverage of JD-relevant keywords
  const matchedFromJD = jdRelevant.filter((kw) => cvTokens.has(kw));
  const missingFromJD = jdRelevant.filter((kw) => !cvTokens.has(kw));

  // Fallback: CV-only generic hits, used when JD doesn't name this dimension explicitly
  const cvGenericHits = dimKeywords.filter((kw) => cvTokens.has(kw));

  let coverageRatio: number;

  if (jdRelevant.length > 0) {
    // Normal case: JD is explicit about this dimension
    coverageRatio = matchedFromJD.length / jdRelevant.length;
  } else if (cvGenericHits.length > 0) {
    // JD is vague, but CV clearly demonstrates this competency
    coverageRatio = 0.4; // tune as needed
  } else {
    coverageRatio = 0;
  }

  const score = Math.round(coverageRatio * 100);

  // Missing keywords: primarily JD-specific gaps; if JD is vague, show generic gaps
  const missingKeywords =
    jdRelevant.length > 0
      ? missingFromJD
      : dimKeywords.filter((kw) => !cvTokens.has(kw));

  // Matched keywords: JD-specific matches if present; otherwise generic CV hits
  const matchedKeywords =
    matchedFromJD.length > 0 ? matchedFromJD : cvGenericHits;

  return {
    name: dimension.name,
    score,
    matchedKeywords,
    missingKeywords,
  };
}

/**
 * JD-aware mandatory checks:
 * - "met" if JD explicitly mentions the signal AND CV shows it.
 * - "missing" if JD explicitly mentions the signal but CV doesn't.
 * - "partial" if CV shows the signal but JD doesn't explicitly ask for it.
 * - "missing" if neither JD nor CV mention it (treated as not requested and not shown).
 */
function evaluateMandatory(
  track: TrackDefinition,
  cvTokens: Set<string>,
  jdTokens: Set<string>
): MandatoryCheck[] {
  return track.mandatoryRules.map((rule) => {
    const ruleKeywords = rule.keywords.map((kw) => kw.toLowerCase());

    const cvHits = ruleKeywords.filter((kw) => cvTokens.has(kw));
    const jdHits = ruleKeywords.filter((kw) => jdTokens.has(kw));

    let status: "met" | "partial" | "missing";

    if (jdHits.length > 0 && cvHits.length > 0) {
      status = "met";
    } else if (jdHits.length > 0 && cvHits.length === 0) {
      status = "missing";
    } else if (jdHits.length === 0 && cvHits.length > 0) {
      status = "partial";
    } else {
      status = "missing";
    }

    return {
      name: rule.name,
      status,
    };
  });
}

export function runAudit(input: AuditInput): AuditResult {
  const track = getTrackByName(input.roleTrack) ?? getTrackByName("ITSM / Ops")!;

  const cvTokens = new Set(tokenize(input.cvText));
  const jdTokens = new Set(tokenize(input.jobText));

  // JD-aware dimension scoring
  const dimensions: DimensionScore[] = track.dimensions.map((dim) =>
    scoreDimension(dim, cvTokens, jdTokens)
  );

  // JD-aware mandatory checks
  const mandatoryChecks = evaluateMandatory(track, cvTokens, jdTokens);

  // Weighted overall score based on track-specific weights
  const weightedScore = dimensions.reduce((sum, dim, idx) => {
    const weight = track.dimensions[idx].weight;
    return sum + (dim.score * weight) / 100;
  }, 0);

  const overallScore = Math.round(weightedScore);

  // Consolidated missing keywords across dimensions
  const missingKeywords = Array.from(
    new Set(dimensions.flatMap((d) => d.missingKeywords))
  );

  // Group missing keywords into themes for PM / Senior PM
  let missingThemes: MissingTheme[] | undefined;

  if (track.name === "Project Manager" || track.name === "Senior Project Manager") {
    missingThemes = groupMissingByTheme(missingKeywords, PM_THEMES);
  }

  // Red flags: clearer wording
  const redFlags: string[] = [];

  mandatoryChecks.forEach((check) => {
    if (check.status === "missing") {
      redFlags.push(
        `Missing core signal for this JD: ${check.name}.`
      );
    } else if (check.status === "partial") {
      redFlags.push(
        `Signal is only partially visible: ${check.name}. Consider adding one or two concrete examples.`
      );
    }
  });

  // Recommendations: use themes instead of repeating every keyword
  const recommendations: string[] = [];

  if (missingThemes && missingThemes.length > 0) {
    missingThemes.forEach((theme) => {
      if (theme.name === "Delivery & control") {
        recommendations.push(
          "Add explicit evidence of schedule and project control artefacts (RAID, change requests) where relevant."
        );
      } else if (theme.name === "Methodology") {
        recommendations.push(
          "Show your familiarity with waterfall/PMBOK and Agile ceremonies (stand-ups, retros) for this role."
        );
      } else if (theme.name === "Stakeholders & governance") {
        recommendations.push(
          "Make stakeholder governance clearer (steering committees, status reports, executive communication)."
        );
      } else if (theme.name === "Commercials") {
        recommendations.push(
          "Clarify your budget/commercial ownership (margin, pricing, change orders, proposals)."
        );
      }
    });
  }

  // Limit to top 3–4 recommendations
  const finalRecommendations = recommendations.slice(0, 4);

  return {
    roleTrack: track.name,
    overallScore,
    dimensions,
    mandatoryChecks,
    missingKeywords,
    redFlags,
    recommendations: finalRecommendations,
    missingThemes,
  };
}