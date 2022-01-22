const express = require("express");
const router = express.Router();

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

function verifyToken(req, res, next) {
    if (req.query.token) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;
