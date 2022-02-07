const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const ObjectId = require("mongoose").Types.ObjectId;

const userService = require("../services/users.service");
const entryService = require("../services/entries.service");
const webLocalStorage = require("../helpers/clearStorage");
const message = require("../helpers/message");

const getLoginPage = (req, res) => {
    res.render("login", {
        clearStorage: webLocalStorage.getClearStorage(),
        message: message.getMessage(),
    });
};

const authenticateUser = async (req, res) => {
    try {
        const user = await userService.findByUsername(req.body.username);
        if (!user) {
            message.setMessage("Username does not exist");
            res.redirect("/");
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                jwt.sign(
                    { sub: user._id.valueOf() },
                    "secretkey",
                    { expiresIn: "7 days" },
                    (err, token) => {
                        const encodedToken = encodeURIComponent(token);
                        res.redirect(`/?token=${encodedToken}`);
                    }
                );
            } else {
                message.setMessage("Invalid username/password");
                res.redirect("/");
            }
        }
    } catch (err) {
        console.log(err);
    }
};

const getSignupPage = (req, res) => {
    res.render("signup", { message: message.getMessage() });
};

const addUser = async (req, res) => {
    try {
        const existingUser = await userService.findByUsername(
            req.body.username
        );
        if (existingUser) {
            message.setMessage("Account with this username already exists");
            res.redirect("/signup");
        } else {
            const newUser = {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, saltRounds),
            };
            await userService.addUser(newUser);
            message.setMessage("Account created!");
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
    }
};

const getChoicesPage = (req, res) => {
    res.render("choices");
};

const getStressTaskPage = (req, res) => {
    res.render("stress-task");
};

const getTypingPage = (req, res) => {
    res.render("type-data");
};

const postData = async (req, res) => {
    try {
        const userid = new ObjectId(jwt_decode(req.query.token).sub);
        const username = (await userService.findById(userid)).username;
        const data = { username, ...req.body };
        await entryService.addEntry(data);
        res.status(200).json({ data });
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getLoginPage,
    authenticateUser,
    getSignupPage,
    addUser,
    getChoicesPage,
    getStressTaskPage,
    getTypingPage,
    postData,
};
