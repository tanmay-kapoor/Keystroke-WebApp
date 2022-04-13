const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const ObjectId = require("mongoose").Types.ObjectId;

const userService = require("../services/users.service");
const entryService = require("../services/entries.service");
const webLocalStorage = require("../helpers/clearStorage");
const message = require("../helpers/message");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        refreshToken: process.env.REFRESH_TOKEN,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const getLoginPage = (req, res) => {
    res.render("login", {
        clearStorage: webLocalStorage.getClearStorage(),
        message: message.getMessage(),
    });
};

const authenticateUser = async (req, res) => {
    try {
        const user = await userService.findOne({ username: req.body.username });
        if (!user) {
            message.setMessage("Username does not exist");
            res.redirect("/");
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign(
                    { sub: user._id.valueOf() },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "7 days" }
                );
                const encodedToken = encodeURIComponent(token);
                res.redirect(`/?token=${encodedToken}`);
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
        const existingUsers = await userService.findByEmailOrUsername(
            req.body.email,
            req.body.username
        );
        if (existingUsers && existingUsers.length > 0) {
            message.setMessage(
                "Account with this email/username already exists"
            );
            res.redirect("/signup");
        } else {
            const newUser = {
                email: req.body.email,
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

const getForgotPasswordPage = (req, res) => {
    res.render("forgot-password", {
        clearStorage: webLocalStorage.getClearStorage(),
        message: message.getMessage(),
    });
};

const sendResetLink = async (req, res) => {
    const existingUser = await userService.findOne({ email: req.body.email });
    if (existingUser) {
        const secret = process.env.JWT_SECRET_KEY + existingUser.password;
        const id = existingUser._id.valueOf();
        const token = encodeURIComponent(
            jwt.sign({ sub: id }, secret, {
                expiresIn: "15m",
            })
        );
        const baseURL = process.env.BASE_URL || "http://localhost:3000";

        const mailOptions = {
            from: `Keystroke-WebApp <${process.env.EMAIL}>`,
            to: existingUser.email,
            subject: "Link to reset your password",
            html: `Dear <b>${existingUser.username},</b><br><br>Please use <a href="${baseURL}/reset-password/${id}?token=${token}">this link</a> to reset your password for <b>Keystroke WebApp.</b><br>Please note this a one time link and will expire in the next <b>15 minutes.</b><br><br>Thank you!`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.json(err);
            } else {
                message.setMessage("Check your email for reset link!");
                res.redirect("/login");
            }
        });
    } else {
        message.setMessage("Account with specified email doesn't exist");
        res.redirect("/forgot-password");
    }
};

const getResetPasswordPage = (req, res) => {
    res.render("reset-password", {
        clearStorage: webLocalStorage.getClearStorage(),
        message: message.getMessage(),
    });
};

const resetPassword = async (req, res) => {
    const userid = new ObjectId(jwt_decode(req.query.token).sub);
    try {
        await userService.updateOne(
            { _id: userid },
            { password: bcrypt.hashSync(req.body.password, saltRounds) }
        );
        message.setMessage("Password updated!");
        res.redirect("/login");
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
    getForgotPasswordPage,
    sendResetLink,
    getResetPasswordPage,
    resetPassword,
    getChoicesPage,
    getStressTaskPage,
    getTypingPage,
    postData,
};
