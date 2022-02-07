const express = require("express");
const router = express.Router();
const { verifyToken } = require("../helpers/middlewares");

const {
    getLoginPage,
    authenticateUser,
    getSignupPage,
    addUser,
    getChoicesPage,
    getStressTaskPage,
    getTypingPage,
    postData,
} = require("../controllers/controller.js");

router.get("/login", getLoginPage);

router.post("/login", authenticateUser);

router.get("/signup", getSignupPage);

router.post("/signup", addUser);

router.get("/", verifyToken, getChoicesPage);

router.get("/induce-stress", verifyToken, getStressTaskPage);

router.get("/type-data", verifyToken, getTypingPage);

router.post("/type-data", verifyToken, postData);

module.exports = router;
