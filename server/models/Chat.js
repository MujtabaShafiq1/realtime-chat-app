const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
    {
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);