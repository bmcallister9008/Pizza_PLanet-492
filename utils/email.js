import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or SMTP host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendConfirmationEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"Pizza Planet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
