const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        type: {
            type: String,
        },
        images: [
            {
                type: String,
            }
        ],
        content: {
            type: String,
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);