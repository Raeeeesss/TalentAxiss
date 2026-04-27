export async function sendOtpSms(phone: string, otp: string): Promise<void> {
  const apiKey     = process.env.MSG91_API_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!apiKey || !templateId) {
    console.log(`[SMS OTP] No keys set. To: ${phone} | OTP: ${otp}`);
    return;
  }

  // Normalize to 10-digit, prefix 91 for India
  const normalized = phone.replace(/\D/g, "").slice(-10);
  const mobile     = `91${normalized}`;

  console.log(`[SMS] Sending OTP to ${mobile} via MSG91...`);

  const res = await fetch("https://api.msg91.com/api/v5/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authkey: apiKey,
    },
    body: JSON.stringify({
      template_id: templateId,
      mobile,
      otp,
    }),
  });

  const text = await res.text();
  console.log(`[SMS] MSG91 response (${res.status}):`, text);

  let body: any = {};
  try { body = JSON.parse(text); } catch { /* raw text */ }

  if (body?.type === "error") {
    throw new Error(`MSG91 error: ${body?.message || text}`);
  }

  console.log(`[SMS] OTP sent successfully to ${mobile}`);
}
