"use client";

import React, { useState } from "react";
import { AuditResult } from "../lib/types";

const ROLE_TRACKS = [
  "ITSM / Ops",
  "Project Manager",
  "Senior Project Manager",
  "Customer Relationship Manager",
] as const;

export default function HomePage() {
  const [roleTrack, setRoleTrack] = useState<string>(ROLE_TRACKS[0]);
  const [targetTitle, setTargetTitle] = useState("Manager - Service Performance");
  const [company, setCompany] = useState("Verisure");
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function runAudit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleTrack, targetTitle, company, cvText, jobText }),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setResult(data as AuditResult);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: "1080px",
        padding: "24px 16px 40px",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 600,
                margin: 0,
                color: "#0f172a",
              }}
            >
              Resume Audit Simulator
            </h1>
            <p
              style={{
                marginTop: "4px",
                marginBottom: 0,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Recruiter-style gap analysis for ITSM/Ops, Project Management and
              customer-facing roles.
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              padding: "4px 10px",
              borderRadius: "999px",
              border: "1px solid #cbd5f5",
              color: "#475569",
              backgroundColor: "#f8fafc",
            }}
          >
            Role track:{" "}
            <span style={{ fontWeight: 600 }}>{roleTrack}</span>
          </div>
        </div>
      </header>

      {/* Layout: left past audits, right new audit */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 2fr)",
          gap: "20px",
        }}
      >
        {/* Left column: placeholder for past audits */}
        <aside
          style={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            padding: "14px 14px 18px",
            minHeight: "140px",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            Past audits
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            This minimal version doesn&apos;t yet persist audit history. In a future
            iteration you can add local storage or a small database to keep track
            of which CV/JD pairs you&apos;ve tested.
          </p>
        </aside>

        {/* Right column: main audit card */}
        <section
          style={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            padding: "16px 16px 18px",
          }}
        >
          {/* Title and helper text */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                New audit
              </h2>
              <p
                style={{
                  marginTop: "4px",
                  marginBottom: 0,
                  fontSize: "11px",
                  color: "#64748b",
                  lineHeight: 1.5,
                  maxWidth: "520px",
                }}
              >
                Paste your CV and a target job description. The simulator scores
                your match for the selected role track, highlights missing
                requirements, and surfaces red flags as a recruiter would.
              </p>
            </div>
          </div>

          {/* Role track selection */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "4px",
              }}
            >
              Role track
            </label>
            <select
              value={roleTrack}
              onChange={(e) => setRoleTrack(e.target.value)}
              style={{
                width: "100%",
                fontSize: "11px",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #cbd5f5",
                outline: "none",
              }}
            >
              {ROLE_TRACKS.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </div>

          {/* Target title + company */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                Target role title
              </label>
              <input
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                placeholder="e.g. Manager - Service Performance"
                style={{
                  width: "100%",
                  fontSize: "11px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5f5",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                Company (optional)
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Verisure"
                style={{
                  width: "100%",
                  fontSize: "11px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5f5",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* CV + JD textareas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                Your CV (paste text)
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV text here…"
                style={{
                  width: "100%",
                  minHeight: "180px",
                  fontSize: "11px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5f5",
                  resize: "vertical",
                  outline: "none",
                }}
              />
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "10px",
                  color: "#94a3b8",
                  textAlign: "right",
                }}
              >
                {cvText.length} characters
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                Job description (paste text)
              </label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the target job description here…"
                style={{
                  width: "100%",
                  minHeight: "180px",
                  fontSize: "11px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5f5",
                  resize: "vertical",
                  outline: "none",
                }}
              />
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "10px",
                  color: "#94a3b8",
                  textAlign: "right",
                }}
              >
                {jobText.length} characters
              </div>
            </div>
          </div>

          {/* Run audit button + hint */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <button
              onClick={runAudit}
              disabled={loading || !cvText || !jobText}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "7px 14px",
                borderRadius: "999px",
                border: "none",
                cursor: loading || !cvText || !jobText ? "not-allowed" : "pointer",
                backgroundColor:
                  loading || !cvText || !jobText ? "#cbd5f5" : "#2563eb",
                color: "#ffffff",
                boxShadow:
                  loading || !cvText || !jobText
                    ? "none"
                    : "0 1px 3px rgba(15, 23, 42, 0.18)",
              }}
            >
              {loading ? "Running audit…" : "Run audit"}
            </button>
            <p
              style={{
                margin: 0,
                fontSize: "10px",
                color: "#94a3b8",
              }}
            >
              No data leaves your browser in this demo — scoring is local to this page.
            </p>
          </div>

          {/* Inline error card */}
          {error && (
            <div
              style={{
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                backgroundColor: "#fef2f2",
                padding: "8px 10px",
                fontSize: "11px",
                color: "#b91c1c",
              }}
            >
              <strong style={{ display: "block", marginBottom: "2px" }}>
                Audit failed
              </strong>
              <span>{error}</span>
            </div>
          )}

          {/* Results panel */}
          {result && (
  <div
    style={{
      marginTop: "14px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
      padding: "12px 12px 14px",
      fontSize: "11px",
      color: "#0f172a",
    }}
  >
    {/* Header + match score */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Audit result
        </h3>
        <p
          style={{
            margin: 0,
            marginTop: "3px",
            fontSize: "11px",
            color: "#64748b",
          }}
        >
          Scored for: {result.roleTrack} &mdash; {targetTitle}
          {company ? ` @ ${company}` : ""}
        </p>
      </div>
      <div
        style={{
          marginLeft: "auto",
          fontSize: "12px",
          fontWeight: 600,
          padding: "6px 10px",
          borderRadius: "999px",
          backgroundColor: "#eff6ff",
          color: "#1d4ed8",
          border: "1px solid #bfdbfe",
        }}
      >
        Match score:{" "}
        <span style={{ fontWeight: 700 }}>
          {result.overallScore}/100
        </span>
      </div>
    </div>

    {/* Dimension table */}
    <div style={{ marginTop: "6px" }}>
      <h4
        style={{
          margin: 0,
          fontSize: "11px",
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        Dimension breakdown
      </h4>
      <table
        style={{
          marginTop: "4px",
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px",
        }}
      >
        <thead>
          <tr style={{ color: "#64748b", textAlign: "left" }}>
            <th
              style={{
                padding: "4px 4px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              Dimension
            </th>
            <th
              style={{
                padding: "4px 4px",
                borderBottom: "1px solid #e2e8f0",
                width: "80px",
              }}
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {result.dimensions.map((dim) => (
            <tr key={dim.name}>
              <td
                style={{
                  padding: "4px 4px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {dim.name}
              </td>
              <td
                style={{
                  padding: "4px 4px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {dim.score}/100
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mandatory checks */}
    <div style={{ marginTop: "10px" }}>
      <h4
        style={{
          margin: 0,
          fontSize: "11px",
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        Mandatory checks
      </h4>
      <div
        style={{
          marginTop: "4px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        {result.mandatoryChecks.map((check) => {
          let bg = "#fee2e2";
          let border = "#fecaca";
          let color = "#b91c1c";

          if (check.status === "met") {
            bg = "#dcfce7";
            border = "#bbf7d0";
            color = "#166534";
          } else if (check.status === "partial") {
            bg = "#fef9c3";
            border = "#fde68a";
            color = "#854d0e";
          }

          return (
            <span
              key={check.name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 8px",
                borderRadius: "999px",
                border: `1px solid ${border}`,
                backgroundColor: bg,
                color,
                fontSize: "10px",
              }}
            >
              {check.name} — {check.status}
            </span>
          );
        })}
      </div>
    </div>

    {/* NEW: Areas to strengthen (themes), RIGHT HERE after mandatory checks */}
    {result.missingThemes && result.missingThemes.length > 0 && (
      <div style={{ marginTop: "10px" }}>
        <h4
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Areas to strengthen (from this JD)
        </h4>
        <ul
          style={{
            margin: "4px 0 0",
            paddingLeft: "16px",
          }}
        >
          {result.missingThemes.map((theme) => (
            <li key={theme.name} style={{ fontSize: "11px", color: "#64748b" }}>
              <strong>{theme.name}:</strong>{" "}
              {theme.keywords.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Red flags */}
    {result.redFlags.length > 0 && (
      <div style={{ marginTop: "10px" }}>
        <h4
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Red flags
        </h4>
        <ul
          style={{
            margin: "4px 0 0",
            paddingLeft: "16px",
          }}
        >
          {result.redFlags.map((rf, idx) => (
            <li
              key={idx}
              style={{
                fontSize: "11px",
                color: "#b91c1c",
                marginBottom: "2px",
              }}
            >
              {rf}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Recommendations */}
    {result.recommendations.length > 0 && (
      <div style={{ marginTop: "10px" }}>
        <h4
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Recommendations
        </h4>
        <ul
          style={{
            margin: "4px 0 0",
            paddingLeft: "16px",
          }}
        >
          {result.recommendations.map((rec, idx) => (
            <li
              key={idx}
              style={{
                fontSize: "11px",
                color: "#64748b",
                marginBottom: "2px",
              }}
            >
              {rec}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
        </section>
      </section>
    </main>
  );
}