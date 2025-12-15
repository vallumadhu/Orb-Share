require('dotenv').config()
const express = require("express")
const cors = require("cors")
const { connectDB } = require("./controllers/common")
const noteRouter = require("./routes/note")
const authRouter = require("./routes/auth")
const axillaryRouter = require("./routes/axillary")
const sendMail = require("./controllers/mail")

const PORT = process.env.PORT || 3000;
const app = express()

connectDB(process.env.ATLAS_URL)
    .then(() => console.log("Mongodb connected"))
    .catch((e) => console.error("Failed to connect to MongoDB", e.message))

app.use(cors({
    // origin: "https://orbshare.netlify.app",
    origin: "*",
    methods: ["GET", "POST"],
}))

app.use(express.json())

app.use("/", authRouter)
app.use("/", noteRouter)
app.use("/", axillaryRouter)

app.get("/health", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(200).json({ status: "ok" })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})