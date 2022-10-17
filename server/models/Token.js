const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 3600
        }
    }
)

module.exports = mongoose.model("Token", TokenSchema);