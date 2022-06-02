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
    getStressDetectionPage,
    predictStress,
} = require("../controllers/controller.js");

router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);
router.get("/forgot-password", getForgotPasswordPage);
router.get("/reset-password/:id", verifyTempToken, getResetPasswordPage);
router.get("/", verifyToken, getChoicesPage);
router.get("/induce-stress", verifyToken, getStressTaskPage);
router.get("/type-data", verifyToken, getTypingPage);
router.get("/stress-detection", verifyToken, getStressDetectionPage);

router.post("/login", authenticateUser);
router.post("/signup", addUser);
router.post("/forgot-password", sendResetLink);
router.post("/reset-password/:id", verifyTempToken, resetPassword);
router.post("/type-data", verifyToken, postData);
router.post("/stress-detection", verifyToken, predictStress);

module.exports = router;
