import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import "dotenv/config"

const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer();

// Route to handle receiving and emailing the PDF
router.post('/send-history', upload.single('file'), async (req, res) => {
    const { email } = req.body; // Extract email from request body
    const file = req.file; // Get the uploaded file

  if (!file) {
    return res.status(400).json({ error: 'No file received' });
  }
  if (!email) {
    throw new Error("No recipient email address provided.");
  }

  try {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for other ports
        auth: {
          user:  process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS, 
        },
        debug: true,
      });
    const info = await transporter.sendMail({
      from: '"TradeX" <tradex0.0.1.1.1@gmail.com>', // Sender address
      to: email, // Recipient address
      subject: 'Transaction History PDF',
      text: 'Please find attached the transaction history.',
      attachments: [
        {
          filename: 'transaction-history.pdf',
          content: file.buffer, // PDF buffer sent from the client
          contentType: 'application/pdf',
        },
    ]
    });
    // Sen

    res.json({ message: `Email sent successfully!` });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
