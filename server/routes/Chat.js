const express = require("express");
const router = express.Router();

const { validateToken } = require("../middlewares/verifyToken");
const { createChat, getChat, findChat, updateLatestMessage, addUser, removeUser } = require("../controllers/chat");

router.post("/", validateToken, createChat)
router.put("/:id", validateToken, updateLatestMessage)

router.put("/add/:id", validateToken, addUser)
router.put("/remove/:id", validateToken, removeUser)

router.get("/:userId", validateToken, getChat)
router.get("/find/:userId/:memberId", validateToken, findChat)

module.exports = router;