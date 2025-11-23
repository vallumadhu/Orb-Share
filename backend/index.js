const express = require("express")
const mongoose = require("mongoose")
const randomWords = require('random-words')
const crypto = require("crypto")
const cors = require("cors");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { type } = require("os");
const PORT = process.env.PORT || 3000


const app = express()

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};

const emailMatch = (req, email) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return false;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return email == decoded.userId
    } catch (err) {
        return false;
    }
}

mongoose.connect(process.env.ATLAS_URL)
    .then(() => console.log("Mongodb connected"))
    .catch((e) => console.error("failed to connect to mongodb", e.message))

const noteSchema = mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            default: null
        },
        note: {
            type: String,
            required: true
        },
        view: {
            type: Boolean,
            default: true
        },
        edit: {
            type: Boolean,
            default: true
        },
        access: {
            type: [String],
            default: []
        }
    }
)

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const noteModel = mongoose.model("noteModel", noteSchema)

app.use(cors({
    origin: ["https://nanopath.netlify.app", "http://localhost:5173", "https://orbshare.netlify.app"],
    methods: ["GET", "POST"],
}));

app.use(express.json());

app.post("/note", async (req, res) => {
    const { id } = req.query
    let { note, view = false, edit = false, access = [], email = null } = req.body
    email = email ? email.toLowerCase() : null
    if (!id) {
        return res.status(400).json({ message: "id query is required" })
    }
    const existing = await noteModel.findOne({ id })
    if (existing) {
        return res.status(400).json({ message: "note already exists with id" })
    }
    if (!note) {
        return res.status(400).json({ message: "note is required" })
    }
    if (view || edit || access || email) {
        if (!emailMatch(req, email)) {
            return res.status(401).json({ message: "authentication error" })
        }
    }
    const newNode = new noteModel({ id, note, email, view, edit, access })
    await newNode.save()

    return res.status(200).json(newNode)
})

app.get("/note", async (req, res) => {
    const query = req.query
    let { email = null } = req.body
    email = email ? email.toLowerCase() : null
    if (!query.id) {
        return res.status(400).json({ message: "id query is required" })
    }
    const note = await noteModel.findOne({ id: query.id })
    if (!note) {
        return res.status(404).json({ message: "note doesn't exist" })
    }
    if (note.view === false) {
        if (!email) return res.status(400).json({ "message": "You don't have access to view this note" })
        if (!emailMatch(req, email)) {
            return res.status(401).json({ message: "authentication error" })
        }
    }
    if (email != note.email && !note.access.includes(email)) return res.status(400).json({ "message": "You don't have access to view this note" })
    res.status(200).json({ "note": note })
})
app.get("/note-random-id", async (req, res) => {
    let id = null;
    while (true) {
        id = randomWords.generate(2).join("-")
        const exists = await noteModel.findOne({ id })
        if (!exists) break
    }

    return res.status(200).json({ "id": id })
})

app.post("/updatenote", async (req, res) => {
    const { id } = req.query
    let { note, email } = req.body
    email = email ? email.toLowerCase() : null
    if (!id) {
        return res.status(400).json({ message: "id query is required" })
    }
    if (!note) {
        return res.status(400).json({ message: "note is required" })
    }

    const existing = await noteModel.findOne({ id: id })
    if (existing.edit === false) {
        if (!emailMatch(req, email)) {
            return res.status(401).json({ message: "authentication error" })
        }
    }
    if (email != existing.email && !existing.access.includes(email)) return res.status(400).json({ "message": "You don't have access to edit this note" })

    try {
        let result = await noteModel.updateOne(
            { id: id },
            { $set: { note: note } }
        )
    }
    catch (error) {
        return res.status(500).json({ "message": "some error occured during updaing database" })
    }

    res.status(200).json({ "message": "updated database successfully" })
})

app.post("/login", async (req, res) => {
    console.log("Login endpoint hit, body:", req.body);
    const body = req.body
    if (!body.email || !body.password) {
        return res.status(400).json({ message: "Email and password required" })
    }

    const email = body.email

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

app.post("/register", async (req, res) => {
    const body = req.body
    if (!body.email || !body.password) {
        return res.status(400).json({ message: "Email and password required" })
    }

    const newUser = new User({
        email: body.email,
        password: body.password
    })

    newUser.save()
        .then(user => {
            console.log("Registered successfully:", user)
            res.status(201).redirect("http://http://localhost:5173/login")
        })
        .catch(error => {
            console.error("Failed to register:", error.message)
            res.status(400).json({ message: error.message })
        })
})

app.get("/email", authenticate, (req, res) => {
    if (req.user) {
        console.log(req.user)
        res.status(200).json({ "email": req.user })
    } else {
        res.status(404).json({ "message": "User Not Found" })
    }
})

app.get("/health", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})