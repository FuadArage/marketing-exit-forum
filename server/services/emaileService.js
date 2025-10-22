const dotenv = require("dotenv");
const { Resend } = require("resend");

// Load environment variables
dotenv.config();

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify Resend connection (optional)
(async () => {
  try {
    console.log("✅ Email service (Resend) is ready");
  } catch (error) {
    console.error("❌ Email service initialization failed:", error);
  }
})();

/**
 * Reusable HTML email template for Marketing Students Forum.
 */
function createEmailTemplate({ title, body, buttonText, buttonLink }) {
  const bannerUrl = "https://your-marketing-banner-link.com/banner.jpg"; // <-- change to your banner or logo image URL

  return `
    <div style="background-color: #f9fafb; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <img src="${bannerUrl}" alt="Marketing Students Forum" style="width: 100%; height: auto; display: block;"/>
        <div style="padding: 30px; color: #1f2937;">
          <h2 style="margin-top: 0; font-weight: 700; font-size: 24px;">${title}</h2>
          <p style="font-size: 16px; line-height: 1.6;">${body}</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${buttonLink}" style="display: inline-block; padding: 14px 30px; background: linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%); color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: transform 0.2s;">
              ${buttonText}
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">If you have any questions, reply to this email or contact our support team.</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          &copy; ${new Date().getFullYear()} Marketing Students Forum. All rights reserved.<br/>
          Marketing Students Community, Addis Ababa, Ethiopia
        </div>
      </div>
    </div>
  `;
}

/**
 * Sends password reset email.
 */
async function sendPasswordResetEmail(email, username, resetLink) {
  try {
    const emailHtml = createEmailTemplate({
      title: "Password Reset Request",
      body: `Hi ${username},<br/><br/>We received a request to reset your password. Click below to proceed. This link will expire in 1 hour. If you didn’t request this, you can safely ignore this email.`,
      buttonText: "Reset My Password",
      buttonLink: resetLink,
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    });

    console.log("✅ Password reset email sent successfully");
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return false;
  }
}

/**
 * Sends notification when someone answers a question.
 */
async function sendAnswerNotification(email, questionId, questionTitle = "your question") {
  try {
    const questionLink = `${process.env.FRONTEND_URL}/question-detail/${questionId}`;
    const emailHtml = createEmailTemplate({
      title: "Your Question Has a New Answer!",
      body: `Someone just answered your question: <strong>"${questionTitle}"</strong>.<br/>Click below to view the response and join the discussion.`,
      buttonText: "View Answer",
      buttonLink: questionLink,
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Question Has a New Answer!",
      html: emailHtml,
    });

    console.log("✅ Answer notification email sent successfully");
    return true;
  } catch (error) {
    console.error("❌ Error sending answer notification email:", error);
    return false;
  }
}

module.exports = {
  resend,
  sendPasswordResetEmail,
  sendAnswerNotification,
};
