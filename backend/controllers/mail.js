const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    tls: {
        ciphers: 'SSLv3',
    },
    port: 465,
    secure: true,
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