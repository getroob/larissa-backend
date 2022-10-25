import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
dotenv.config();

const { user, pass } = process.env;
const transporter = nodemailer.createTransport({
  host: "mail.itbiz.gr",
  port: 587,
  secure: true,
  auth: {
    user: user,
    pass: pass,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendEmail = async (subject, text, to) => {
  const info = await transporter.sendMail({
    from: `"Larissa Roob" <${user}>`,
    to: "wagasic523@24rumen.com",
    subject,
    text,
    // html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
