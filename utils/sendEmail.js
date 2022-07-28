/**
 * Send email service for forgot password
 * * Send email service for OTP
 * @author Shuja
 */
var nodemailer = require('nodemailer');
const sender_name = process.env.MAILER_DOMAIN;
const sender_email = process.env.MAILER_EMAIL;
const sender_password = process.env.MAILER_PASSWORD;
// const logo = require("../uploads/blogImages/Email_logo.png");

/**
 * sendEmail
 * @param {string} email
 * @param {string} password
 * @return {void}
 */
exports.sendEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: 'Your password has been changed',
      text: password,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

exports.sendForgetPasswordEmail = (email, link) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: 'Your password has been changed',
      text: `click the given link: ${link}`,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

exports.sendOTP = (email, otp) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });
    const OTP = otp;
    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: 'Your OTP is:',
      html: OtpTemplate(OTP),
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.trace(error);
        reject(error);
      } else {
        resolve({
          success: true,
          message: 'Email sent successfully',
        });
      }
    });
  });
};

const OtpTemplate = (otp) => {
  return `
  <body style="margin: 0; padding: 0">
  <table
    role="presentation"
    style="
      width: 100%;
      border-collapse: collapse;
      border: 0;
      border-spacing: 0;
      background: #ffffff;
    "
  >
    <tr>
      <td align="center" style="padding: 0">
        <table
          role="presentation"
          style="
            width: 602px;
            border-collapse: collapse;
            border: 1px solid #cccccc;
            border-spacing: 0;
            text-align: left;
          "
        >
          <tr>
            <td
              align="center"
              style="padding: 20px 5px 10px 5px; "
            >
              <img src={../uploads/blogImages/Email_logo.png}>
              <h4 style="font-family: Verdana; color: #CC8E9C;">
                OTP for your request is below
              </h4>
            </td>
          </tr>
          <tr>
            <td
              align="center"
              style="
                padding: 20px 10px 20px 10px;
                background: rgba(255, 227, 232, 1);
              "
            >
            <div style="width: 50%;">
              <h3
                style="
                  font-family: Verdana;
                  font-size: 35px;
                  background-color: #CC8E9C;
                  padding: 2%;
                  color: #FFFFFF;
                  border-radius: 10px;
                "
              >
                ${otp}
              </h3>
              </div>
              <p align="center" style="
                  font-family: Verdana;
                  color: #A0A0A0;">
                If you haven't sent this opt, please ignore this message.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p align="center" style="color: #A0A0A0; font-family: Verdana">
                This email is generated automatically please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`;
};
