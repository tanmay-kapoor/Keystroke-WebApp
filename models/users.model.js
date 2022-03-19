const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
});

const User = mongoose.model("User", usersSchema);
module.exports = User;
