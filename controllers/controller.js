const userService = require("../services/users.service");
const entryService = require("../services/entries.service");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

let username = "",
    message;

const getLoginPage = (req, res) => {
    res.render("login", { message });
    message = "";
};

const authenticateUser = async (req, res) => {
    try {
        const user = await userService.findOne({ username: req.body.username });
        if (!user) {
            message = "Username does not exist";
            res.redirect("/");
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                username = req.body.username;
                jwt.sign(
                    { username },
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
        const existingUser = await userService.findOne({
            username: req.body.username,
        });
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
    jwt.verify(req.query.token, "secretkey", (err, authData) => {
        if (!err) {
            res.render("index", { username });
        } else {
            res.redirect("/login");
        }
    });
};

const postData = async (req, res) => {
    try {
        return await entryService.addEntry(req.body);
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
