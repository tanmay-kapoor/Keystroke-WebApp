const userService = require("../services/users.service");
const entryService = require("../services/entries.service");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt_decode = require("jwt-decode");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

let clearStorage = false,
    message;

const getLoginPage = (req, res) => {
    res.render("login", { clearStorage, message });
    clearStorage = false;
    message = "";
};

const authenticateUser = async (req, res) => {
    try {
        const user = await userService.findByUsername(req.body.username);
        if (!user) {
            message = "Username does not exist";
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
                message = "Invalid username/password";
                res.redirect("/");
            }
        }
    } catch (err) {
        console.log(err);
    }
};

const getSignupPage = (req, res) => {
    res.render("signup", { message });
    message = "";
};

const addUser = async (req, res) => {
    try {
        const existingUser = await userService.findByUsername(
            req.body.username
        );
        if (existingUser) {
            message = "Account with this username already exists";
            res.redirect("/signup");
        } else {
            const newUser = {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, saltRounds),
            };
            await userService.addUser(newUser);
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
    }
};

const getTypingPage = async (req, res) => {
    try {
        const decoded = jwt.verify(req.query.token, "secretkey");
        const userid = new ObjectId(decoded.sub);
        const user = await userService.findById(userid);
        if (!user) {
            clearStorage = true;
            res.redirect("/login");
        } else {
            res.render("index");
        }
    } catch (err) {
        res.redirect("/login");
    }
};

const postData = async (req, res) => {
    try {
        const userid = new ObjectId(jwt_decode(req.query.token).sub);
        const username = (await userService.findById(userid)).username;
        return await entryService.addEntry({ username, ...req.body });
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getLoginPage,
    authenticateUser,
    getSignupPage,
    addUser,
    getTypingPage,
    postData,
};
