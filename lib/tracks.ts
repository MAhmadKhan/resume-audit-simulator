export type TrackDefinition = {
  name: string;
  dimensions: {
    name: string;
    weight: number; // contribution to overall score
    keywords: string[];
  }[];
  mandatoryRules: {
    name: string;
    keywords: string[];
  }[];
};

const ITSM_OPS_TRACK: TrackDefinition = {
  name: "ITSM / Ops",
  dimensions: [
    {
      name: "ITSM processes",
      weight: 30,
      keywords: [
        "incident",
        "incident management",
        "problem",
        "problem management",
        "change",
        "change management",
        "major incident",
        "service request",
        "service desk",
        "ticketing",
        "escalation",
        "on-call",
      ],
    },
    {
      name: "2nd-line / operations support",
      weight: 20,
      keywords: [
        "second line",
        "l2",
        "operations team",
        "noc",
        "support queue",
        "escalation",
        "run operations",
        "production support",
      ],
    },
    {
      name: "Service performance & infrastructure",
      weight: 25,
      keywords: [
        "sla",
        "service level",
        "availability",
        "uptime",
        "mttr",
        "mtbf",
        "response time",
        "capacity",
        "performance monitoring",
        "dashboard",
        "datadog",
        "sentry",
      ],
    },
    {
      name: "Governance & frameworks",
      weight: 15,
      keywords: [
        "itil",
        "itsm",
        "iso 27001",
        "soc 2",
        "audit",
        "cab",
        "service review",
        "process improvement",
        "runbook",
      ],
    },
    {
      name: "Leadership & collaboration",
      weight: 10,
      keywords: [
        "service owner",
        "team lead",
        "manager",
        "stakeholder",
        "vendor",
        "cross-functional",
        "governance",
        "communication",
        "reporting",
      ],
    },
  ],
  mandatoryRules: [
    {
      name: "ITIL / ITSM certification",
      keywords: ["itil", "itil foundation", "itsm certification"],
    },
    {
      name: "Direct L2 or operations support ownership",
      keywords: ["second line", "l2", "operations team", "noc", "escalation"],
    },
    {
      name: "Formal SLA / KPI reporting",
      keywords: ["sla", "service level", "availability", "mttr", "mtbf", "kpi"],
    },
    {
      name: "Incident / Problem / Change process ownership",
      keywords: [
        "incident management",
        "problem management",
        "change management",
        "cab",
        "major incident",
      ],
    },
    {
      name: "Monitoring / tooling visibility",
      keywords: ["datadog", "sentry", "monitoring", "dashboard"],
    },
  ],
};

const PM_TRACK: TrackDefinition = {
  name: "Project Manager",
  dimensions: [
    {
      name: "Delivery ownership (scope/schedule/budget/RAID)",
      weight: 30,
      keywords: [
        "scope",
        "schedule",
        "budget",
        "raid",
        "risk",
        "issue",
        "dependency",
        "project plan",
        "baseline",
        "change request",
      ],
    },
    {
      name: "Methodology fluency",
      weight: 20,
      keywords: [
        "agile",
        "scrum",
        "scrumban",
        "kanban",
        "waterfall",
        "pmbok",
        "prince2",
        "ceremony",
        "stand-up",
        "retro",
      ],
    },
    {
      name: "Stakeholder and client governance",
      weight: 20,
      keywords: [
        "stakeholder",
        "steering committee",
        "governance",
        "status report",
        "communication",
        "client",
        "customer",
        "executive",
      ],
    },
    {
      name: "Budget / commercial accountability",
      weight: 15,
      keywords: [
        "budget",
        "p&l",
        "margin",
        "commercial",
        "contract",
        "pricing",
        "change order",
        "proposal",
      ],
    },
    {
      name: "Seniority signals",
      weight: 15,
      keywords: [
        "program",
        "portfolio",
        "multi-country",
        "large team",
        "30+ engineers",
        "senior",
        "lead",
      ],
    },
  ],
  mandatoryRules: [
    {
      name: "Project control artefacts (RAID, plans, change control)",
      keywords: ["raid", "project plan", "baseline", "change request"],
    },
    {
      name: "Agile / Scrumban ceremonies",
      keywords: ["agile", "scrum", "scrumban", "stand-up", "retro"],
    },
    {
      name: "Budget / commercial responsibility",
      keywords: ["budget", "margin", "commercial", "contract", "pricing"],
    },
    {
      name: "Cloud / DevOps exposure (if JD mentions it)",
      keywords: ["aws", "azure", "gcp", "ci/cd", "kubernetes"],
    },
  ],
};

const SENIOR_PM_TRACK: TrackDefinition = {
  name: "Senior Project Manager",
  dimensions: PM_TRACK.dimensions.map((d) => ({ ...d })),
  mandatoryRules: PM_TRACK.mandatoryRules,
};

const CRM_TRACK: TrackDefinition = {
  name: "Customer Relationship Manager",
  dimensions: [
    {
      name: "Account ownership & growth",
      weight: 30,
      keywords: [
        "account manager",
        "customer success",
        "renewal",
        "upsell",
        "cross-sell",
        "expansion",
        "retention",
      ],
    },
    {
      name: "Relationship management",
      weight: 25,
      keywords: [
        "relationship",
        "qbr",
        "business review",
        "cadence",
        "stakeholder map",
        "executive sponsor",
        "success plan",
      ],
    },
    {
      name: "Service performance / satisfaction",
      weight: 20,
      keywords: [
        "nps",
        "csat",
        "churn",
        "satisfaction",
        "feedback",
        "net promoter",
      ],
    },
    {
      name: "Commercials",
      weight: 15,
      keywords: [
        "contract",
        "negotiation",
        "pricing",
        "proposal",
        "quote",
        "rfp",
      ],
    },
    {
      name: "Industry / domain alignment",
      weight: 10,
      keywords: [
        "financial",
        "manufacturing",
        "retail",
        "telecom",
        "saas",
        "b2b",
      ],
    },
  ],
  mandatoryRules: [
    {
      name: "Explicit account / CRM ownership",
      keywords: ["account manager", "customer success", "crm", "customer relationship"],
    },
    {
      name: "Customer satisfaction metrics",
      keywords: ["nps", "csat", "churn", "retention"],
    },
    {
      name: "Proactive growth (upsell / cross-sell)",
      keywords: ["upsell", "cross-sell", "expansion"],
    },
    {
      name: "Governed cadence (QBRs, reviews)",
      keywords: ["qbr", "business review", "cadence", "roadmap"],
    },
  ],
};

export const TRACKS: TrackDefinition[] = [
  ITSM_OPS_TRACK,
  PM_TRACK,
  SENIOR_PM_TRACK,
  CRM_TRACK,
];

export function getTrackByName(name: string): TrackDefinition | undefined {
  return TRACKS.find((t) => t.name.toLowerCase() === name.toLowerCase());
}
