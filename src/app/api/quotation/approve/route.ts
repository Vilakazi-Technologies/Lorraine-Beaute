import { NextRequest, NextResponse } from "next/server";

export interface QuotationSubmission {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  agreed: boolean;
  kickoffFee: number;
  revenueShare: number;
  submittedAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuotationSubmission;

    if (!body.fullName || !body.email || !body.agreed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const notifyEmail = process.env.QUOTATION_NOTIFY_EMAIL;
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;

    if (web3Key && notifyEmail) {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `Quotation Approved — ${body.company ?? "Lorraine Beauté"}`,
          from_name: body.fullName,
          email: notifyEmail,
          replyto: body.email,
          message: `
Quotation Approval Received

Name: ${body.fullName}
Email: ${body.email}
Phone: ${body.phone ?? "Not provided"}
Company: ${body.company ?? "Lorraine Beauté"}
Kick-off Fee: R${body.kickoffFee}
Revenue Share: ${body.revenueShare}%
Submitted: ${body.submittedAt}

Notes: ${body.notes ?? "None"}

Client has approved the quotation terms.
          `.trim(),
        }),
      });
    }

    console.log("[Quotation Approval]", JSON.stringify(body, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quotation submit error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
