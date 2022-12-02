const express = require("express");
const router = express.Router();

const { getAllUsers, getMyDetails, AddChatMembers } = require("../controllers/user");
const { validateToken } = require("../middlewares/verifyToken");

router.get("/me", validateToken, getMyDetails)
router.get("/all", validateToken, getAllUsers)
router.get("/:id", validateToken, AddChatMembers)

module.exports = router;