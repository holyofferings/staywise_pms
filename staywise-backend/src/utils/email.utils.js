const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  // In production, use actual email credentials
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // In development, use ethereal for testing
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_EMAIL || 'ethereal.user@ethereal.email',
      pass: process.env.ETHEREAL_PASSWORD || 'etherealpassword'
    }
  });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @returns {Promise} Email send result
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Staywise CRM <noreply@staywise.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send welcome email to new user
 * @param {Object} user - User object
 * @param {String} password - Plain password (for created users)
 * @returns {Promise} Email send result
 */
const sendWelcomeEmail = async (user, password = null) => {
  const subject = 'Welcome to Staywise CRM';
  let html = `
    <h1>Welcome to Staywise CRM, ${user.name}!</h1>
    <p>Your account has been successfully created with the role of <strong>${user.role}</strong>.</p>
    <p>You can log in using your email: <strong>${user.email}</strong></p>
  `;
  
  if (password) {
    html += `
      <p>Your temporary password is: <strong>${password}</strong></p>
      <p>Please change your password after your first login.</p>
    `;
  }
  
  html += `
    <p>If you have any questions, please contact support.</p>
    <p>Best regards,<br>Staywise CRM Team</p>
  `;
  
  return sendEmail({
    to: user.email,
    subject,
    html,
    text: html.replace(/<[^>]*>?/gm, '')
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {String} resetToken - Reset token
 * @param {String} resetUrl - Frontend reset URL
 * @returns {Promise} Email send result
 */
const sendPasswordResetEmail = async (user, resetToken, resetUrl) => {
  const subject = 'Password Reset Request';
  const resetLink = `${resetUrl}?token=${resetToken}`;
  
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hello ${user.name},</p>
    <p>You requested a password reset for your Staywise CRM account.</p>
    <p>Please click the link below to reset your password. The link is valid for 1 hour.</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>If you didn't request this reset, you can safely ignore this email.</p>
    <p>Best regards,<br>Staywise CRM Team</p>
  `;
  
  return sendEmail({
    to: user.email,
    subject,
    html,
    text: html.replace(/<[^>]*>?/gm, '')
  });
};

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking object
 * @param {Object} hotel - Hotel object
 * @param {Object} room - Room object
 * @returns {Promise} Email send result
 */
const sendBookingConfirmationEmail = async (booking, hotel, room) => {
  const subject = `Booking Confirmation - ${hotel.name}`;
  
  const checkInDate = new Date(booking.checkInDate).toLocaleDateString();
  const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString();
  
  const html = `
    <h1>Booking Confirmation</h1>
    <p>Hello ${booking.guestName},</p>
    <p>Your booking at <strong>${hotel.name}</strong> has been confirmed!</p>
    <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2>Booking Details</h2>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Room:</strong> ${room.roomNumber} (${room.type})</p>
      <p><strong>Check-in:</strong> ${checkInDate}</p>
      <p><strong>Check-out:</strong> ${checkOutDate}</p>
      <p><strong>Total Amount:</strong> ${hotel.settings.currency} ${booking.totalAmount}</p>
    </div>
    <p>We look forward to welcoming you!</p>
    <p>Best regards,<br>${hotel.name} Team</p>
  `;
  
  return sendEmail({
    to: booking.guestEmail,
    subject,
    html,
    text: html.replace(/<[^>]*>?/gm, '')
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail
}; 