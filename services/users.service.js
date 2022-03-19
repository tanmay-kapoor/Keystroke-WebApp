const User = require("../models/users.model.js");

const findOne = async (params) => {
    return await User.findOne(params);
};

const findByEmailOrUsername = async (email, username) => {
    return await User.find({ $or: [{ email }, { username }] });
};

const findById = async (userid) => {
    return await User.findById(userid);
};

const addUser = async (newUser) => {
    const user = new User(newUser);
    await user.save();
};

const updateOne = async (params, updates) => {
    return await User.updateOne(params, updates);
};

module.exports = {
    findOne,
    findByEmailOrUsername,
    findById,
    addUser,
    updateOne,
};
