import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use onboarding@resend.dev until you verify your domain in Resend dashboard
// Once verified, change to: "TalentAxiss <noreply@yourdomain.com>"
const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendOtpEmail(to: string, otp: string, name?: string) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `${otp} is your TalentAxiss verification code`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0d0d1a;color:#fff;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:28px;font-weight:900;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">TalentAxiss</span>
        </div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Verify your ${name ? "email" : "account"}</h2>
        <p style="color:rgba(255,255,255,0.5);margin-bottom:24px;">Hi ${name || "there"}, use the code below to verify your account. It expires in 10 minutes.</p>
        <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#6366f1;">${otp}</span>
        </div>
        <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;">If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message || "Failed to send email");
  }
  console.log("Email sent:", data?.id, "→", to);
}

export async function sendWelcomeEmail(to: string, name: string, agencyName: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to TalentAxiss, ${name}!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0d0d1a;color:#fff;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:28px;font-weight:900;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">TalentAxiss</span>
        </div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Welcome aboard, ${name}! 🎉</h2>
        <p style="color:rgba(255,255,255,0.5);margin-bottom:16px;"><strong style="color:#fff;">${agencyName}</strong> is now live on TalentAxiss. Start adding candidates and let AI do the matching.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-align:center;padding:14px;border-radius:10px;font-weight:700;text-decoration:none;margin-bottom:24px;">Go to Dashboard →</a>
        <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;">You're on the 7-day free trial. No credit card required.</p>
      </div>
    `,
  });
}
