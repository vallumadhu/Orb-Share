const mongoose = require("mongoose")

const noteSchema = mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            default: null,
            lowercase: true
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
    },
    { timestamps: true }
)
const noteModel = mongoose.model("noteModel", noteSchema)
module.exports = { noteModel }