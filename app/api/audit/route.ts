import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "../../../lib/audit";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    roleTrack,
    targetTitle,
    company,
    cvText,
    jobText,
  } = body as {
    roleTrack: string;
    targetTitle?: string;
    company?: string;
    cvText: string;
    jobText: string;
  };

  if (!cvText || !jobText || !roleTrack) {
    return NextResponse.json(
      { error: "roleTrack, cvText, and jobText are required" },
      { status: 400 }
    );
  }

  const result = runAudit({ roleTrack, targetTitle, company, cvText, jobText });
  return NextResponse.json(result);
}
