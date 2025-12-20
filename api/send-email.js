import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { from_name, from_email, message, to_email } = req.body;

        // Validate required fields
        if (!from_name || !from_email || !message || !to_email) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS?.replace(/\s/g, ''), // Remove spaces from app password
            },
            secure: true,
            port: 465,
        });

        // Email content
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

        // Send email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to_email,
            subject: `New message from ${from_name}`,
            html: htmlContent,
            text: textContent,
            replyTo: from_email,
        });

        console.log('✅ Email sent successfully:', info.messageId);

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to send email. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}
