const express = require("express");
const router = express.Router();
const userFunctions = require("../controllers/user.controller");
const isLoggedIn = require("../middlewares/isLoggedIn");
router.route("/register").post(userFunctions.createuser);
router.route("/login").post(userFunctions.login);
router.route("/logout").post(userFunctions.logout);
router.route("/update").post(isLoggedIn, userFunctions.updateProfile);

module.exports = router;
