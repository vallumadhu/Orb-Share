const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_ADDRESSS,
        pass: process.env.GMAIL_APP_PASS
    },
});

const sendMail = async (to, sub, msg) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_ADDRESSS,
            to,
            subject: sub,
            html: msg,
        });
        console.log('Mail sent:', info.messageId);
        return info;
    } catch (err) {
        console.error('Error sending mail:', err);
        throw err;
    }
};

module.exports = sendMail;