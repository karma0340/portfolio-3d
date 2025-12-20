import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Create transporter instance
let transporter = null;

/**
 * Initialize email service
 * Should be called on server startup
 */
export const initializeEmailService = async () => {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // Remove spaces from app password
      },
      secure: true,
      port: 465,
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email service initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service initialization failed:', error.message);
    return false;
  }
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 * @param {string} options.replyTo - Reply-to email address
 */
export const sendEmail = async (options) => {
  try {
    if (!transporter) {
      throw new Error('Email service not initialized. Call initializeEmailService first.');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || process.env.EMAIL_USER,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('To:', options.to);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
};

/**
 * Send contact form email
 * @param {Object} data - Contact form data
 */
export const sendContactEmail = async (data) => {
  const { from_name, from_email, message, to_email } = data;

  // Validate required fields
  if (!from_name || !from_email || !message || !to_email) {
    throw new Error('Missing required fields');
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Portfolio Contact Message</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <p><strong>From:</strong> ${from_name}</p>
        <p><strong>Email:</strong> ${from_email}</p>
        <p><strong>Message:</strong></p>
        <p style="color: #666; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        This message was sent from your 3D Portfolio website.
      </p>
    </div>
  `;

  const textContent = `From: ${from_name} (${from_email})\n\nMessage:\n${message}`;

  return sendEmail({
    to: to_email,
    subject: `New message from ${from_name}`,
    html: htmlContent,
    text: textContent,
    replyTo: from_email,
  });
};

export default {
  initializeEmailService,
  sendEmail,
  sendContactEmail,
};
