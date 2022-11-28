const asyncHandler = require('express-async-handler')
const Chat = require("../models/Chat");

const createChat = asyncHandler(async (req, res) => {

    const newChat = new Chat({ members: [req.body.senderId, ...req.body.receiverId], groupAdmin: req.body.senderId, isGroupChat: (req.body?.isGroupChat || false) });
    const savedChat = await newChat.save();
    res.status(200).json(savedChat);

});

const getChat = asyncHandler(async (req, res) => {

    const chat = await Chat.find({ members: { $in: [req.params.userId] } }).populate("members latestMessage", "-password");
    res.status(200).json(chat);

});

const findChat = asyncHandler(async (req, res) => {

    const { userId, memberId } = req.params;
    const chat = await Chat.find({ isGroupChat: { $ne: true }, members: { $all: [userId, memberId] } }).populate("members", "-password")
    res.status(200).json(chat);

});

const updateLatestMessage = asyncHandler(async (req, res) => {

    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate("latestMessage");
    res.status(200).json(updatedChat)

});

module.exports = { createChat, getChat, findChat, updateLatestMessage }
