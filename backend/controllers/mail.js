const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 587,
    auth: {
        user: process.env.GMAIL_ADDRESSS,
        pass: process.env.GMAIL_APP_PASS
    },
});

const sendMail = (to, sub, msg) => {
    transporter.sendMail({
        from: process.env.GMAIL_ADDRESS,
        to: to,
        subject: sub,
        html: msg
    })
}

module.exports = sendMail