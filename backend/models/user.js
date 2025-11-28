const mongoose = require("mongoose")

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

const tempUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    otp: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});


const User = mongoose.model("User", userSchema);
const tempUser = mongoose.model("tempUser", tempUserSchema)

module.exports = { User, tempUser }