const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { sendMessage, getInbox, getConversation, getThreads } = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/inbox", protect, getInbox);
router.get("/threads", protect, getThreads);
router.get("/conversation/:otherUserId", protect, getConversation);

module.exports = router;
