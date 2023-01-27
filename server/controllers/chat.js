const asyncHandler = require('express-async-handler')
const Chat = require("../models/Chat");
const Message = require("../models/Message")

const createChat = asyncHandler(async (req, res) => {

    const { senderId, receiverId, isGroupChat, type, content, images } = req.body;

    const newChat = new Chat({ members: [senderId, ...receiverId], groupAdmin: (isGroupChat ? senderId : null), isGroupChat });
    const savedChat = await newChat.save();

    const newMessage = new Message({ chatId: savedChat._id, senderId, type, images, content, readBy: [senderId] });
    const savedMessage = await newMessage.save();

    const updatedChat = await Chat.findByIdAndUpdate(savedChat._id, { latestMessage: savedMessage._id }, { new: true })
    const chat = await updatedChat.populate("members latestMessage", "-password");
    res.status(200).json(chat);

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

const deleteChat = asyncHandler(async (req, res) => {
    await Chat.deleteOne({ _id: req.body.chatId });
    res.status(200).json(`Chat Deleted Successfully`)
});

const updateLatestMessage = asyncHandler(async (req, res) => {
    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate("latestMessage");
    res.status(200).json(updatedChat)
});


const addUser = asyncHandler(async (req, res) => {

    const { id } = req.params
    const { sender, users } = req.body;

    const newMessage = new Message({
        chatId: id, senderId: sender.id, type: "info", readBy: [sender.id],
        content: `${sender.username} added ${users.map(u => u.username).join(', ')}`,
    });
    const savedMessage = await newMessage.save();

    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, {
        $addToSet: { "members": { $each: users } }, latestMessage: savedMessage._id
    }, { new: true }).populate("members latestMessage", "-password");

    res.status(200).json(updatedChat)
});


const removeUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { sender, users } = req.body;

        const newMessage = new Message({
            chatId: id, senderId: sender.id, type: "info", readBy: [sender.id],
            content: (users.length > 0) ? `${sender.username} removed ${users.map(u => u.username).join(', ')}` : `${sender.username} left`,
        });
        const savedMessage = await newMessage.save();

        const updatedChat = await Chat.findByIdAndUpdate(req.params.id, {
            $pull: { "members": { $in: (users.length > 0 ? users : [sender.id]) } }, latestMessage: savedMessage._id
        }, { new: true }).populate("members latestMessage", "-password");

        res.status(200).json(updatedChat)
    } catch (e) {
        console.log(e)
    }
});

module.exports = { createChat, deleteChat, getChat, findChat, updateLatestMessage, addUser, removeUser }
