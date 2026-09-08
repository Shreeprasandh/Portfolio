import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS & method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, _honeypot } = req.body || {};

    // Bot trap: silently drop spam submissions
    if (_honeypot) {
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'kaizzcer@gmail.com';

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipientEmail],
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #141414; color: #D8D3CC; border-radius: 12px; border: 1px solid #2A2A2A;">
          <h2 style="color: #FFFFFF; margin-top: 0; padding-bottom: 12px; border-bottom: 1px solid #2A2A2A; font-size: 20px;">
            📬 New Portfolio Inquiry
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; font-size: 14px; color: #A09D98;">
              <strong style="color: #D8D3CC;">Sender Name:</strong> ${name}
            </p>
            <p style="margin: 8px 0; font-size: 14px; color: #A09D98;">
              <strong style="color: #D8D3CC;">Email Address:</strong> 
              <a href="mailto:${email}" style="color: #66A3BF; text-decoration: none;">${email}</a>
            </p>
          </div>

          <div style="margin-top: 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #D8D3CC; font-weight: 600;">Message:</p>
            <div style="background-color: #1F1F1F; padding: 16px; border-radius: 8px; border-left: 3px solid #66A3BF; font-size: 14px; line-height: 1.6; color: #F2EFE7; white-space: pre-wrap;">${message}</div>
          </div>

          <p style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #2A2A2A; font-size: 12px; color: #666666; text-align: center;">
            Sent securely via Portfolio Resend Serverless API
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API dispatch error:', error);
      return res.status(400).json({ error: error.message || 'Failed to send message' });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact serverless handler exception:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
}
