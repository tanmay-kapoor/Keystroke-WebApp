const Entry = require("../models/entries.model.js");
const getAllFeatures = require("../services/features.service");

const addEntry = async (newEntry) => {
    const entry = new Entry(getAllFeatures(newEntry));
    return await entry.save();
};

module.exports = { addEntry };
