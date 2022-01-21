const User = require("../models/users.model.js");

const findOne = async ({ username }) => {
    return await User.findOne({ username });
};

const addUser = async (newUser) => {
    const user = new User(newUser);
    await user.save();
};

module.exports = { findOne, addUser };
