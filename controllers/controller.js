const loginChecker = require("../services/loginChecker.service");
const userService = require("../services/users.service");
const entryService = require("../services/entries.service");

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
            // res.status(401).json({ message: "Username does not exist" });
            message = "Username does not exist";
            res.redirect("/");
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                username = req.body.username;
                loginChecker.setLoggedIn(true);
                res.redirect("/");
            } else {
                // return res
                //     .status(403)
                //     .json({ message: "Invalid username/password" });
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
            // res.status(401).json({
            //     message: "Account with this username already exists",
            // });
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
    res.render("index", { username });
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
