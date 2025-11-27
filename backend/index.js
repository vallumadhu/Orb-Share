require('dotenv').config()
const express = require("express")
const cors = require("cors")
const { connectDB } = require("./controllers/common")
const noteRouter = require("./routes/note")
const authRouter = require("./routes/auth")

const PORT = process.env.PORT || 3000;
const app = express()

connectDB(process.env.ATLAS_URL)
    .then(() => console.log("Mongodb connected"))
    .catch((e) => console.error("Failed to connect to MongoDB", e.message))

app.use(cors({
    origin: ["https://nanopath.netlify.app", "https://orbshare.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
}))

app.use(express.json())

app.use("/", authRouter)
app.use("/", noteRouter)

app.get("/health", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(200).json({ status: "ok" })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})