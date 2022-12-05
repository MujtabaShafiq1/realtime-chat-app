const express = require("express");
const router = express.Router();

const { createMessage, getAllChatMessage, updateReadby, deleteMessage } = require("../controllers/message");
const { validateToken } = require("../middlewares/verifyToken");

router.get("/:chatId", validateToken, getAllChatMessage)
router.post("/", validateToken, createMessage)
router.put("/:messageId", validateToken, updateReadby)
router.delete("/", validateToken, deleteMessage)            // for testing

module.exports = router;