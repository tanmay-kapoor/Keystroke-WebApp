const jwt = require("jsonwebtoken");
const userService = require("../services/users.service");
const ObjectId = require("mongoose").Types.ObjectId;
const webLocalStorage = require("../helpers/clearStorage");

const verifyToken = async (req, res, next) => {
    if (!req.query.token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(
                req.query.token,
                process.env.JWT_SECRET_KEY
            );
            const userid = new ObjectId(decoded.sub);
            const user = await userService.findById(userid);
            if (!user) {
                webLocalStorage.setClearStorage(true);
                res.redirect("/login");
            } else {
                next();
            }
        } catch (err) {
            res.redirect("/login");
        }
    }
};

const verifyTempToken = async (req, res, next) => {
    if (!req.query.token) {
        res.json("error! missing token");
    } else {
        try {
            const id = new ObjectId(req.params.id);
            const user = await userService.findById(id);
            if (!user) {
                res.json("this user doesn't exist");
            } else {
                const secret = process.env.JWT_SECRET_KEY + user.password;
                const decoded = jwt.verify(req.query.token, secret);
                if (decoded.sub === req.params.id) {
                    next();
                } else {
                    res.json("token-url mismatch!");
                }
            }
        } catch (err) {
            res.json(err.message);
        }
    }
};

module.exports = { verifyToken, verifyTempToken };
