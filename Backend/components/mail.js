import nodemailer from "nodemailer";
import "dotenv/config"


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for other ports
  auth: {
    user:  process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});


async function mail(email, token) {
  if (!email) {
    throw new Error("No recipient email address provided.");
  }

  try {
    const info = await transporter.sendMail({
      from: '"TradeX" <tradex0.0.1.1.1@gmail.com>', // Sender address
      to: email, // Recipient address
      subject: "Email confirmation", // Subject line
      text: "Hello world?", // Plain text body
      html: `
        <h1 style="text-align: center;">Final step...</h1><br>
        <p style="text-align: center;">Follow this link to verify your email address.</p><br>
        <a href="http://localhost:5173/email_verification/${ token }" target="_blank" style="text-align: center; padding: 12px 24px; border-radius: 4px; color: white; background: black; display: inline-block; margin: 0.5rem 0;">Confirm now</a><br>
        <p style="text-align: center;">If you didn't ask to verify this address, you can ignore this email.</p><br>
        <p style="text-align: center;">Thanks,<br>The TradeX team</p>
      `, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default mail;