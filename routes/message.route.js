const express = require("express");
const router = express.Router();
const messageFunctions = require("../controllers/message.controller");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.route("/send").post(isLoggedIn, messageFunctions.send);
router.route("/my-messages").get(isLoggedIn, messageFunctions.getMessages);

module.exports = router;
