const express = require("express");
const router = express.Router();

const { createTemporaryUser, getAll } = require("../controllers/Token");

router.get("/", getAll)
router.post("/", createTemporaryUser)

module.exports = router;