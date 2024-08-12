const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASS } = require("../config/server-config");

async function sendMail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Akash 👻" <${EMAIL_USER}>`,
    to: email,
    subject: "Account Creation Successfull",
    text: `Your Account has been successfully created on TODO app`,
    html: `<h1>Account Successfully Created</h1><br><br/><div><p>Your account has been successfullly created on TODO app.<p/></div>`,
  });

  return info;
}

module.exports = {
  sendMail,
};
