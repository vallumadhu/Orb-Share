const express = require("express")
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { authenticate } = require("../controllers/common");
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

    const newUser = new User({
        email: body.email,
        password: body.password
    })

    newUser.save()
        .then(user => {
            return res.status(200).json({ message: "registered" })
        })
        .catch(error => {
            console.error("Failed to register:", error.message)
            return res.status(400).json({ message: error.message })
        })
})

router.get("/email", authenticate, (req, res) => {
    if (req.user) {
        res.status(200).json({ "email": req.user })
    } else {
        res.status(404).json({ "message": "User Not Found" })
    }
})

module.exports = router;