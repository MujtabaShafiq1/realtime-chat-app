const asyncHandler = require('express-async-handler')
const User = require("../models/User")

const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({ email: { $ne: req.user.email } }).select(["-password"])
    res.status(200).json(users)
})

const getMyDetails = asyncHandler(async (req, res, next) => {
    res.json(req.user)
})

module.exports = { getAllUsers, getMyDetails }