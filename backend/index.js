const express = require("express")
const mongoose = require("mongoose")
const randomWords = require('random-words')
const crypto = require("crypto")
const cors = require("cors");
require("dotenv").config();
const jwt = require('jsonwebtoken');
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

mongoose.connect(process.env.ATLAS_URL)
    .then(() => console.log("Mongodb connected"))
    .catch((e) => console.error("failed to connect to mongodb", e.message))

const urlSchema = mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
)

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
const urlModel = mongoose.model("urlModel", urlSchema)
const noteModel = mongoose.model("noteModel", noteSchema)

app.use(cors({
    origin: ["https://nanopath.netlify.app"],
    methods: ["GET", "POST"],
}));

app.use(express.json());

app.post("/url", async (req, res) => {
    const query = req.query
    if (!query.url) {
        return res.status(400).json({ message: "url query is required" })
    }

    const existing = await urlModel.findOne({ url: query.url })
    if (existing) {
        return res.status(200).json(existing)
    }
    let id = null;
    while (true) {
        id = crypto.randomBytes(4).toString("hex")
        const exists = await urlModel.findOne({ id })
        if (!exists) break
    }

    const newEntry = new urlModel({ id: id, url: query.url });
    await newEntry.save();

    return res.status(200).json(newEntry);
})

app.get("/url", async (req, res) => {
    const query = req.query
    if (!query.id) {
        return res.status(400).json({ message: "id query is required" })
    }
    const instance = await urlModel.findOne({ id: query.id })
    if (instance) {
        let targetUrl = instance.url
        if (!targetUrl.includes("https://") && !targetUrl.includes("http://")) {
            targetUrl = "https://" + targetUrl;
        }
        res.redirect(targetUrl);
    }
    else {
        res.status(404).json({ message: `No url exits with id:${query.id}` })
    }
})

app.post("/custom", async (req, res) => {
    const query = req.query
    if (!query.url) {
        return res.status(400).json({ message: "url query is required" })
    }
    if (!query.id) {
        return res.status(400).json({ message: "id query is required" })
    }
    const existing = await urlModel.findOne({ id: query.id })
    if (existing) {
        if (existing.url == query.url) return res.status(200).json(existing)
        return res.status(400).json({ message: "url already exists with id" })
    }
    const newEntry = new urlModel({ id: query.id, url: query.url });
    await newEntry.save();

    return res.status(200).json(newEntry);
})

app.post("/note", async (req, res) => {
    const query = req.query
    const body = req.body
    if (!query.id) {
        return res.status(400).json({ message: "id query is required" })
    }
    const existing = await noteModel.findOne({ id: query.id })
    if (existing) {
        return res.status(400).json({ message: "note already exists with id" })
    }
    if (!body.note) {
        return res.status(400).json({ message: "note is required" })
    }
    body.email = body.email ?? null

    const newNode = new noteModel({ id: query.id, note: body.note, email: body.email })
    await newNode.save()

    return res.status(200).json(newNode)
})

app.get("/note", async (req, res) => {
    const query = req.query
    if (!query.id) {
        return res.status(400).json({ message: "id query is required" })
    }
    const note = await noteModel.findOne({ id: query.id })
    if (!note) {
        return res.status(404).json({ message: "note doesn't exist" })
    }

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
    const query = req.query
    const body = req.body
    if (!query.id) {
        return res.status(400).json({ message: "id query is required" })
    }
    if (!body.note) {
        return res.status(400).json({ message: "note is required" })
    }
    try {
        let result = await noteModel.updateOne(
            { id: query.id },
            { $set: { note: body.note } }
        )
    }
    catch (error) {
        res.status(500).json({ "message": "some error occured during updaing database" })
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