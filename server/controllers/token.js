const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Token = require("../models/Token")
const asyncHandler = require('express-async-handler')
const { sendMail } = require("../utils/sendMail")

const createTemporaryUser = asyncHandler(async (req, res, next) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const verificationToken = jwt.sign({ data: req.body.password }, process.env.JWT_EMAIL_KEY, { expiresIn: "1h" });

    const url = `${process.env.CLIENT}confirmation/${verificationToken}`
    await sendMail(req.body.email, "Verify Email on localhost", url)

    const tempUser = new Token({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.image,
        token: verificationToken
    });

    await tempUser.save();
    res.status(201).json(tempUser)
})


const getAll = asyncHandler(async (req, res, next) => {
    const tokens = await Token.find();
    res.status(200).json(tokens)
})

module.exports = { createTemporaryUser, getAll }