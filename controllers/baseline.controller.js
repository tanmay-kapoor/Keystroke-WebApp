const Entry = require("../models/entries.model.js");
const getAllFeatures = require("../services/features.service.js");

const getBaselinePage = async (req, res) => {
    res.render("index");
};

const postBaselineData = async (req, res) => {
    try {
        const entry = new Entry(getAllFeatures(req.body));
        return await entry.save();
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getBaselinePage,
    postBaselineData,
};
