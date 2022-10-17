const express = require("express");
const router = express.Router();

const { createChat, getChat, findChat, updateLatestMessage } = require("../controllers/chat");
const { validateToken } = require("../middlewares/verifyToken");

router.post("/", validateToken, createChat)
router.put("/:id", validateToken, updateLatestMessage)
router.get("/:userId", validateToken, getChat)
router.get("/find/:userId/:memberId", validateToken, findChat)

module.exports = router;