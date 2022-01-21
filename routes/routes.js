const loginChecker = require("../services/loginChecker.service");
const express = require("express");
const router = express.Router();

let loggedIn = false;

const {
    getLoginPage,
    authenticateUser,
    getSignupPage,
    addUser,
    getTypingPage,
    postData,
} = require("../controllers/controller.js");

router.get("/login", getLoginPage);

router.post("/login", authenticateUser);

router.get("/signup", getSignupPage);

router.post("/signup", addUser);

router.get("/", checkLoggedIn, getTypingPage);

router.post("/", checkLoggedIn, postData);

function checkLoggedIn(req, res, next) {
    if (loginChecker.checkLoggedIn()) {
        return next();
    } else {
        return res.redirect("/login");
    }
}

module.exports = router;
