const express = require("express")
const jwt = require("jsonwebtoken");
const { User, tempUser } = require("../models/user");
const otpTemplate = require("../html_templates/mail_otp")
const { authenticate, getOTP } = require("../controllers/common");
const sendMail = require("../controllers/mail");
const router = express.Router()

router.post("/login", async (req, res) => {
    console.log("Login endpoint hit, body:", req.body);
    const body = req.body
    if (!body.email || !body.password) {
        return res.status(400).json({ message: "Email and password required" })
    }

    let email = body.email
    email = email ? email.toLowerCase() : null

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (user.password != body.password) {
        return res.status(400).json({ message: "Invaild Password" })
    }

    const token = jwt.sign(
        { userId: user.email },
        process.env.JWT_SECRET
    )
    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.status(200).json({
        message: "Login successful",
        user: {
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
})

router.post("/register", async (req, res) => {
    const body = req.body
    let email = body.email
    email = email ? email.toLowerCase() : null
    if (!email || !body.password) {
        return res.status(400).json({ message: "Email and password required" })
    }
    const otp = getOTP()
    const newUser = new tempUser({
        email: body.email,
        password: body.password,
        otp: otp
    })
    const HTMLotpTemplate = otpTemplate(otp, "https://orbshare.netlify.app/")
    try {
        sendMail(body.email, "Registration OTP Orb Share", HTMLotpTemplate)
    } catch {
        return res.status(500).json({ message: "Failed to send OTP" })
    }
    //deleting the exiting entry in tempUser
    try {
        const existing = await tempUser.findOne({ email })
        if (existing) {
            await tempUser.deleteOne({ email })
        }
    } catch (err) {
        console.log(err)
    }

    newUser.save()
        .then(user => {
            return res.status(200).json({ message: `OTP Send to ${body.email}` })
        })
        .catch(error => {
            console.error("Failed to register:", error.message)
            return res.status(400).json({ message: error.message })
        })
})

router.post("/verifyregistration", async (req, res) => {
    const { email, otp } = req.body
    if (!email) return res.status(400).json({ message: "Email Required" })
    if (!otp) return res.status(400).json({ message: "OTP Required" })

    try {
        const item = await tempUser.findOne({ email });
        if (!item) {
            return res.status(400).json({ message: "User not found or OTP expired" });
        }
        if (item.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        await tempUser.deleteOne({ email });

        const newUser = new User({
            email: item.email,
            password: item.password
        });
        await newUser.save();
        return res.status(200).json({ message: "Registration successful" });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "User already registered" });
    }

})

router.get("/email", authenticate, (req, res) => {
    if (req.user) {
        res.status(200).json({ "email": req.user })
    } else {
        res.status(404).json({ "message": "User Not Found" })
    }
})

module.exports = router;