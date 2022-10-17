const express = require("express");
const router = express.Router();

const { createMessage, getAllChatMessage, updateReadby, deleteMessage } = require("../controllers/message");
const { validateToken } = require("../middlewares/verifyToken");

router.post("/", validateToken, createMessage)
router.put("/:chatId", validateToken, updateReadby)
router.delete("/", validateToken, deleteMessage)            // for testing
router.get("/:chatId", validateToken, getAllChatMessage)

module.exports = router;