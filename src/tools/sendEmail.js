import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
dotenv.config();

const { user, pass } = process.env;
const transporter = nodemailer.createTransport({
  host: "mail.itbiz.gr",
  port: 587,
  auth: {
    user: user,
    pass: pass,
  },
  tls:{
    rejectUnauthorized: false
  }
});

const sendEmail = async (subject, text, to) => {
  const info = await transporter.sendMail({
    from: `"Larissa Roob" <${user}>`,
    to: to || user,
    subject,
    text
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
