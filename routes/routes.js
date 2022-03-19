const express = require("express");
const router = express.Router();
const { verifyToken, verifyTempToken } = require("../helpers/middlewares");

const {
    getLoginPage,
    authenticateUser,
    getSignupPage,
    addUser,
    getForgotPasswordPage,
    sendResetLink,
    getResetPasswordPage,
    resetPassword,
    getChoicesPage,
    getStressTaskPage,
    getTypingPage,
    postData,
} = require("../controllers/controller.js");

router.get("/login", getLoginPage);

router.post("/login", authenticateUser);

router.get("/signup", getSignupPage);

router.post("/signup", addUser);

router.get("/forgot-password", getForgotPasswordPage);

router.post("/forgot-password", sendResetLink);

router.get("/reset-password/:id", verifyTempToken, getResetPasswordPage);

router.post("/reset-password/:id", verifyTempToken, resetPassword);

router.get("/", verifyToken, getChoicesPage);

router.get("/induce-stress", verifyToken, getStressTaskPage);

router.get("/type-data", verifyToken, getTypingPage);

router.post("/type-data", verifyToken, postData);

module.exports = router;
