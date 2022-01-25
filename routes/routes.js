const express = require("express");
const router = express.Router();
const { verifyToken } = require("../helpers/middlewares");

const {
    getLoginPage,
    authenticateUser,
    getSignupPage,
    addUser,
    getTypingPage,
    postData,
} = require("../controllers/controller.js");

router.get("/", verifyToken, getTypingPage);

router.post("/", verifyToken, postData);

router.get("/login", getLoginPage);

router.post("/login", authenticateUser);

router.get("/signup", getSignupPage);

router.post("/signup", addUser);

module.exports = router;
