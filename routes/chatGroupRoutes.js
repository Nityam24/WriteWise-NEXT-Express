const express = require("express");
const router = express.Router();
const chatGroupController = require("../controllers/chatGroupController");

router.post("/", chatGroupController.createChatGroup);
router.get("/:groupId/messages", chatGroupController.getChatGroupMessages);

module.exports = router;
