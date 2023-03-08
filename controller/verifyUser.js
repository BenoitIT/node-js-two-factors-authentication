const { users } = require("../models");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
require("dotenv").config();
const verifyUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    //generate verification secret
    const secret = await speakeasy.generateSecret({ length: 15 });
    //generate token
    const token = await speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });
    //send email containing to an attempting user
    //define transport variable
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "benoitnda35@gmail.com", pass: process.env.GPASSOWRD },
    });
    //define sending email option
    const mailOptions = {
      from: "benoitnda35@gmail.com",
      to: "benatiawayne@gmail.com",
      subject: "verification code",
      text: "Your verification code is: " + token,
    };
    const accountSid = process.env.TWILIO_SSID;
    const authToken = process.env.TWILIO_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body: "Your TOTP token is: " + token,
        from: process.env.TELEPHONE,
        to: process.env.TELEPHONE,
      })
      .then((message) => console.log(message.sid));

    // assigning transporter the options
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        res.status(201).send({
          message: "Email sent: " + info.response,
          secret,
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//validate token
const checkValidToken = async (req, res) => {
 const varifiedToken=speakeasy.totp.verify(req.body.token);
 if (varifiedToken) return res.status(200).json({ message:'token is valid' });
 res.status(500).json({ message: 'Token is not valid' });
}
module.exports = { verifyUser, checkValidToken };
