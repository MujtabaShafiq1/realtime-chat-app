const asyncHandler = require('express-async-handler')
const Message = require("../models/Message");
const Chat = require("../models/Chat");

const createMessage = asyncHandler(async (req, res) => {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: savedMessage._id })
    res.status(200).json(savedMessage);
});


const getAllChatMessage = asyncHandler(async (req, res) => {
    const messages = await Message.find({ chatId: req.params.chatId })
    res.status(200).json(messages);
});


const updateReadby = asyncHandler(async (req, res) => {
    await Message.findByIdAndUpdate(req.params.messageId, { $addToSet: { "readBy": req.body.userId } }, { new: true });
    res.status(200).json(`Updated`)
});


const deleteMessage = asyncHandler(async (req, res) => {
    await Message.deleteOne({ _id: req.params.messageId });
    res.status(200).json(`Message Deleted Successfully`)
});


const deleteAllMessage = asyncHandler(async (req, res) => {
    await Message.deleteMany({ chatId: req.body.chatId });
    res.status(200).json(`Deleted Successfully`)
});

module.exports = { createMessage, getAllChatMessage, updateReadby, deleteMessage, deleteAllMessage }
