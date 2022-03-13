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

module.exports = { verifyToken };
