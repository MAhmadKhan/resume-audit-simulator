export type DimensionScore = {
  name: string;
  score: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
};

export type MandatoryCheckStatus = "met" | "partial" | "missing";

export type MissingTheme = {
  name: string;
  keywords: string[];
};

export type MandatoryCheck = {
  name: string;
  status: MandatoryCheckStatus;
};

export type AuditResult = {
  roleTrack: string;
  overallScore: number;
  dimensions: DimensionScore[];
  mandatoryChecks: MandatoryCheck[];
  missingKeywords: string[];
  redFlags: string[];
  recommendations: string[];
  missingThemes?: MissingTheme[];
};
