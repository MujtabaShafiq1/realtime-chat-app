const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { createError } = require("./error")

const validateToken = async (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_KEY)
        const data = await User.findById(id).select(["-password"])
        const user = { id: data._id, username: data.username, email: data.email, profilePicture: data.profilePicture }
        req.user = user;
        next();
    } catch (e) {
        return next(createError(403, "Token is not valid!"));
    }
}

module.exports = { validateToken }