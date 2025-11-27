const express = require("express");
const noteModel = require("../models/note");
const randomWords = require("random-words");
const { getEmail, authenticate } = require("../controllers/common");
const router = express.Router()

router.post("/note", async (req, res) => {
    const { id } = req.query
    let { note, view = true, edit = true, access = [] } = req.body
    let email = getEmail(req)
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
    if ((!view || !edit || access.length > 0) && !email) return res.status(401).json({ message: "authentication error" });

    const newNode = new noteModel({ id, note, email, view, edit, access })
    await newNode.save()

    return res.status(200).json(newNode)
})

router.post("/fetchnote", async (req, res) => {
    const query = req.query
    let email = getEmail(req)
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

        if (email != note.email && !note.access.includes(email)) return res.status(400).json({ "message": "You don't have Access to view" })
    }
    res.status(200).json({ "note": note })
})
router.get("/note-random-id", async (req, res) => {
    let id = null;
    while (true) {
        id = randomWords.generate(2).join("-")
        const exists = await noteModel.findOne({ id })
        if (!exists) break
    }

    return res.status(200).json({ "id": id })
})

router.post("/updatenote", async (req, res) => {
    const { id } = req.query
    let { note, view = true, edit = true, access = [] } = req.body
    let email = getEmail(req)
    email = email ? email.toLowerCase() : null
    if (!id) {
        return res.status(400).json({ message: "id query is required" })
    }
    if (!note) {
        return res.status(400).json({ message: "note is required" })
    }
    const existing = await noteModel.findOne({ id: id })
    if ((!view || !edit) && (!email || (email != existing.email && !existing.access.includes(email)))) return res.status(401).json({ message: "You can only edit access control of your notes." })
    console.log(existing)
    if (existing.edit === false) {
        if (!email) return res.status(401).json({ message: "You don't have access to edit this note" });
        if (email != existing.email && !existing.access.includes(email)) return res.status(400).json({ "message": "You don't have access to edit this note" });
    }

    try {
        let result = await noteModel.updateOne(
            { id: id },
            { $set: { note: note, access: access, view: view, edit: edit } }
        )
    }
    catch (error) {
        return res.status(500).json({ "message": "some error occured during updaing database" })
    }

    res.status(200).json({ "message": "updated database successfully" })
})

router.get("/data", authenticate, async (req, res) => {
    let email = req.user.userId;

    if (!email) {
        return res.status(401).json({ message: "User Not Found" });
    }
    email = email.toLowerCase()
    try {
        const notes = await noteModel.find({ email: email })
        res.status(200).json({ "email": email, "notes": notes })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" })
    }
});


module.exports = router;