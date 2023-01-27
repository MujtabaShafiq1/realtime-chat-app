const express = require("express");
const router = express.Router();

const { createMessage, getAllChatMessage, updateReadby, deleteMessage, deleteAllMessage } = require("../controllers/message");
const { validateToken } = require("../middlewares/verifyToken");

router.get("/:chatId", validateToken, getAllChatMessage)
router.post("/", validateToken, createMessage)
router.put("/:messageId", validateToken, updateReadby)
router.delete("/:messageId", validateToken, deleteMessage)
router.delete("/", validateToken, deleteAllMessage)

module.exports = router;