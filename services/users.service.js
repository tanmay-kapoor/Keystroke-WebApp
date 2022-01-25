const User = require("../models/users.model.js");

const findByUsername = async (username) => {
    return await User.findOne({ username });
};

const findById = async (userid) => {
    return await User.findById(userid);
};

const addUser = async (newUser) => {
    const user = new User(newUser);
    await user.save();
};

module.exports = { findByUsername, findById, addUser };
