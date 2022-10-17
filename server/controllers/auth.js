const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Token = require("../models/Token")
const asyncHandler = require('express-async-handler')
const { createError } = require("../middlewares/error")

const registerUser = asyncHandler(async (req, res, next) => {

    const decodedToken = jwt.verify(req.body.token, process.env.JWT_EMAIL_KEY)

    const user = await Token.findOne({ token: req.body.token })

    const { username, password, email, profilePicture } = user
    const newUser = new User({ username, email, password, profilePicture });
    await newUser.save()

    res.status(201).json({ email: email, password: decodedToken.data })
})

const login = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "user not found"))

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return next(createError(400, "wrong password"));

    const { password, ...otherDetails } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "2d" })
    res.cookie("accessToken", token, { httpOnly: true }).status(200).json({ details: { ...otherDetails } })
})

const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie("accessToken");
    res.end()
})


module.exports = { registerUser, login, logout }