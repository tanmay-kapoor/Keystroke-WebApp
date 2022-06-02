const Entry = require("../models/entries.model.js");
const getAllFeatures = require("../services/features.service");
const cmd = require("node-cmd");
const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

const addEntry = async (newEntry) => {
    const entry = new Entry(getAllFeatures(newEntry));
    return await entry.save();
};

const predict = async (data) => {
    const completeData = getAllFeatures(data);
    const csv = new ObjectsToCsv([completeData]);
    await csv.toDisk("./helpers/input.csv");

    cmd.runSync("python ./helpers/predict_2.py");
    const prediction = JSON.parse(
        fs.readFileSync("./helpers/prediction.json", "utf8")
    );

    fs.unlink("./helpers/input.csv", (err) => {
        if (err) throw err;
    });
    fs.unlink("./helpers/prediction.json", (err) => {
        if (err) throw err;
    });
    return prediction;
};

module.exports = { addEntry, predict };
