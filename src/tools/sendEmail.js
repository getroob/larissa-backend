import nodemailer from "nodemailer";
import * as dotenv from 'dotenv'
dotenv.config() 

const { user, pass } = process.env;
const transporter = nodemailer.createTransport({
  // host: "imap.gmail.com",
  // port: 993,
  // secure: true,
  // auth: {
  //   user,
  //   pass,
  // },
  host: "mail.auth.gr",
  port: 587,
  secure: true,
  auth: {
    user: "user",
    pass: "pass",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendEmail = async (subject, text, to) => {
  const info = await transporter.sendMail({
    from: `"Larissa Roob" <${user}>`,
    to: to || user,
    // from: `"Larissa Roob" <email>`,
    // to: "email",
    subject,
    text,
    // html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
