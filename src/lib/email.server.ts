import { getDatabase } from "./db.server";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  templateName: string;
}

function getResendConfig() {
  const apiKey = process.env["RESEND_API_KEY"] || "";
  const rawFrom = process.env["RESEND_FROM"] || "entangle@silicofeller-quantum.com";
  const from = rawFrom.includes("<") ? rawFrom : `RiderzPro Support <${rawFrom}>`;
  return { apiKey, from };
}

export async function sendEmail({ to, subject, html, templateName }: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const db = getDatabase();
  const { apiKey, from } = getResendConfig();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { id?: string; message?: string; error?: string };
    if (!response.ok) {
      const errorDetail = data?.message || data?.error || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Resend API Error: ${errorDetail}`);
    }

    const messageId = data.id || "resend-ok";
    console.log(`[Email Service - Resend] Delivered '${templateName}' to ${to} (Message ID: ${messageId}) from ${from}`);

    // Log to PostgreSQL email_delivery_logs
    await db.query(
      `INSERT INTO email_delivery_logs (recipient_email, subject, template_name, status)
       VALUES ($1, $2, $3, 'SENT')`,
      [to, subject, templateName]
    ).catch((err) => console.warn("[Email Service] Failed to write delivery log:", err));

    return { success: true, messageId };
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error(`[Email Service - Resend] Failed sending '${templateName}' to ${to}:`, errorMsg);

    await db.query(
      `INSERT INTO email_delivery_logs (recipient_email, subject, template_name, status, error_message)
       VALUES ($1, $2, $3, 'FAILED', $4)`,
      [to, subject, templateName, errorMsg]
    ).catch(() => undefined);

    return { success: false, error: errorMsg };
  }
}

// ----------------------------------------------------------------------------
// Email Templates
// ----------------------------------------------------------------------------

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RiderzPro</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; color: #1f2937; }
    .container { max-width: 600px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 32px 28px; text-align: center; border-bottom: 3px solid #E31E24; }
    .logo-badge { display: inline-block; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; }
    .logo-red { color: #E31E24; }
    .content { padding: 36px 32px; }
    .footer { background-color: #f9fafb; padding: 24px 32px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; }
    .otp-box { background: #fef2f2; border: 2px dashed #E31E24; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #E31E24; font-family: monospace; }
    .button { display: inline-block; background-color: #E31E24; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 14px; margin: 20px 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
    .badge-approved { background-color: #d1fae5; color: #065f46; }
    .badge-rejected { background-color: #fee2e2; color: #991b1b; }
    .badge-info { background-color: #fef3c7; color: #92400e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">RIDERZ<span class="logo-red">PRO</span></div>
      <div style="color: #9ca3af; font-size: 12px; margin-top: 6px; letter-spacing: 1px; text-transform: uppercase;">Electric Vehicle & Automotive Accessories Marketplace</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">This is an automated notification from RiderzPro. Please do not reply directly to this email.</p>
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} RiderzPro Technologies Pvt Ltd. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendOtpEmail(to: string, otp: string, purpose: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD") {
  const titles = {
    CUSTOMER_SIGNUP: "Verify Your Email for Customer Registration",
    VENDOR_SIGNUP: "Verify Your Email for Vendor Registration",
    RESET_PASSWORD: "Reset Your RiderzPro Password",
  };
  const title = titles[purpose] || "Your RiderzPro Verification Code";

  const html = baseLayout(`
    <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">${title}</h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
      Thank you for registering with RiderzPro. Please use the 6-digit verification code below to confirm ownership of this email address.
    </p>

    <div class="otp-box">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #991b1b; letter-spacing: 1px; margin-bottom: 8px;">Your One-Time Password</div>
      <div class="otp-code">${otp}</div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">Valid for <strong>5 minutes</strong>. Do not share this code with anyone.</div>
    </div>

    <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 20px 0 0 0;">
      If you did not request this verification code, please disregard this email or contact support if you suspect unauthorized activity.
    </p>
  `);

  return sendEmail({
    to,
    subject: `Your RiderzPro Verification Code: ${otp}`,
    html,
    templateName: purpose,
  });
}

export async function sendVendorApplicationReceivedEmail(to: string, ownerName: string, storeName: string, applicationId: string) {
  const html = baseLayout(`
    <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">Vendor Application Received</h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Dear <strong>${ownerName}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Your vendor onboarding application for <strong>${storeName}</strong> has been successfully submitted and is currently <span class="badge badge-info">PENDING REVIEW</span> by our compliance team.
    </p>
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <div style="font-size: 13px; color: #4b5563;"><strong>Application ID:</strong> ${applicationId}</div>
      <div style="font-size: 13px; color: #4b5563; margin-top: 6px;"><strong>Store Name:</strong> ${storeName}</div>
      <div style="font-size: 13px; color: #4b5563; margin-top: 6px;"><strong>Status:</strong> Pending Document & KYC Verification</div>
    </div>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Our team typically reviews applications within 1-2 business days. You will receive an email confirmation once your KYC documents and business registration details are approved.
    </p>
  `);

  return sendEmail({
    to,
    subject: `RiderzPro Vendor Application Received — [${applicationId}]`,
    html,
    templateName: "VENDOR_APPLICATION_RECEIVED",
  });
}

export async function sendVendorApprovedEmail(to: string, ownerName: string, storeName: string, loginUrl: string) {
  const html = baseLayout(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge badge-approved" style="font-size: 14px; padding: 6px 16px;">ACCOUNT APPROVED</span>
    </div>
    <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 12px 0; text-align: center;">Welcome to RiderzPro Seller Network!</h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Dear <strong>${ownerName}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Congratulations! Your seller application for <strong>${storeName}</strong> has been fully verified and approved by the RiderzPro Administrator team.
    </p>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      You can now sign in to your dedicated Seller Inventory Dashboard, submit automotive & EV accessory products, manage inventory stock, and track customer orders.
    </p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${loginUrl}" class="button">Access Seller Dashboard &rarr;</a>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
      Direct Portal URL: <a href="${loginUrl}" style="color: #E31E24;">${loginUrl}</a>
    </p>
  `);

  return sendEmail({
    to,
    subject: `Congratulations! Your RiderzPro Vendor Account is Approved`,
    html,
    templateName: "VENDOR_APPROVED",
  });
}

export async function sendVendorRejectedEmail(to: string, ownerName: string, storeName: string, reason: string) {
  const html = baseLayout(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge badge-rejected" style="font-size: 14px; padding: 6px 16px;">APPLICATION REJECTED</span>
    </div>
    <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">Vendor Application Status Update</h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Dear <strong>${ownerName}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Thank you for your interest in partnering with RiderzPro. Following a review of your application for <strong>${storeName}</strong>, we are unable to approve your vendor account at this time.
    </p>
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <div style="font-size: 13px; font-weight: 700; color: #991b1b; margin-bottom: 4px;">Reason for Decision:</div>
      <div style="font-size: 13px; color: #7f1d1d; line-height: 1.5;">${reason}</div>
    </div>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      If you believe this decision was made in error or if your documentation has changed, you may reply to this email or re-apply with corrected information.
    </p>
  `);

  return sendEmail({
    to,
    subject: `RiderzPro Vendor Application Status Update — ${storeName}`,
    html,
    templateName: "VENDOR_REJECTED",
  });
}

export async function sendVendorMoreInfoEmail(to: string, ownerName: string, storeName: string, instructions: string) {
  const html = baseLayout(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge badge-info" style="font-size: 14px; padding: 6px 16px;">ACTION REQUIRED</span>
    </div>
    <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">Additional Information Needed for Vendor Review</h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Dear <strong>${ownerName}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      During the review of your vendor onboarding application for <strong>${storeName}</strong>, our compliance team identified missing or unverified details.
    </p>
    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 4px;">Requested Information / Changes:</div>
      <div style="font-size: 13px; color: #78350f; line-height: 1.5;">${instructions}</div>
    </div>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Please submit the requested updates so our team can finalize your vendor verification.
    </p>
  `);

  return sendEmail({
    to,
    subject: `Action Required: Additional Information Needed for RiderzPro Vendor Application`,
    html,
    templateName: "VENDOR_MORE_INFO_REQUIRED",
  });
}

export async function sendProductApprovalEmail(to: string, productName: string, approved: boolean, reason?: string) {
  const html = baseLayout(`
    <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">
      Product Listing ${approved ? "Approved" : "Rejected"}
    </h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Your product listing <strong>"${productName}"</strong> has been reviewed by the RiderzPro Product Administration team.
    </p>
    ${approved ? `
      <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <span style="color: #065f46; font-weight: 700;">Status: Approved & Live</span>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #047857;">Your product is now eligible to appear in the customer catalog, subject to inventory stock.</p>
      </div>
    ` : `
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <span style="color: #991b1b; font-weight: 700;">Status: Rejected</span>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #7f1d1d;"><strong>Reason:</strong> ${reason || "Does not meet catalog guidelines."}</p>
      </div>
    `}
  `);

  return sendEmail({
    to,
    subject: `Product Listing Update: ${productName} (${approved ? "Approved" : "Rejected"})`,
    html,
    templateName: approved ? "PRODUCT_APPROVED" : "PRODUCT_REJECTED",
  });
}
