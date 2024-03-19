const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/", messageController.createMessage);
router.get("/:groupId", messageController.getGroupMessages);

module.exports = router;
