const express = require("express")
const mongoose = require("mongoose")
const crypto = require("crypto")
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000


const app = express()

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

const urlModel = mongoose.model("urlModel", urlSchema)
app.use(cors({
    origin: "https://nanopath.netlify.app",
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
    let id
    while (true) {
        id = crypto.randomBytes(8).toString("hex")
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
        return res.status(200).json({ message: "url already exists with id" })
    }
    const newEntry = new urlModel({ id: query.id, url: query.url });
    await newEntry.save();

    return res.status(200).json(newEntry);
})


app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})