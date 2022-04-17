import nodemailer from "nodemailer";

const { user, pass } = process.env;
const transporter = nodemailer.createTransport({
  host: "imap.gmail.com",
  port: 993,
  secure: true,
  auth: {
    user,
    pass,
  },
  // host: "mail.auth.gr",
  // port: 587,
  // secure: false,
  // auth: {
  //   user: "email",
  //   pass: "password",
  // },
  // tls: {
  //   ciphers: "SSLv3",
  // },
});

const sendEmail = async (subject, text) => {
  const info = await transporter.sendMail({
    from: `"Larissa Roob" <${user}>`,
    to: user,
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
