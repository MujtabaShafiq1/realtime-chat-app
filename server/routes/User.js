const express = require("express");
const router = express.Router();

const { getAllUsers, getMyDetails } = require("../controllers/user");
const { validateToken } = require("../middlewares/verifyToken");

router.get("/me", validateToken, getMyDetails)
router.get("/all", validateToken, getAllUsers)

module.exports = router;