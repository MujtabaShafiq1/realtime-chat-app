const express = require("express");
const router = express.Router();

const { registerUser, login, logout } = require("../controllers/auth");

router.post("/login", login)
router.get("/logout", logout)
router.post("/register", registerUser)

module.exports = router;