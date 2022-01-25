const mongoose = require("mongoose");

const entriesSchema = new mongoose.Schema({
    username: String,
    stressLevel: Number,
    totalInputTime: Number,
    timePerKeystroke: Number,
    adjustedTimePerKeystroke: Number,
    averagePauseLength: Number,
    pauseRate: Number,
    backspaceKeyRate: Number,
    deleteKeyRate: Number,
    endKeyRate: Number,
    arrowKeyRate: Number,
    homeKeyRate: Number,
    sentenceEndingPunctuationKeyRate: Number,
    punctuationKeyRate: Number,
    tabKeyRate: Number,
    capslockKeyRate: Number,
    controlKeyRate: Number,
    insertKeyRate: Number,
    enterKeyRate: Number,
    shiftKeyRate: Number,
    spaceKeyRate: Number,
    otherKeyRate: Number,
    lexicalDiversity: Number,
    averageWordLength: Number,
    averageSentenceLength: Number,
    nounRate: Number,
    verbRate: Number,
    conjunctionRate: Number,
    adjectiveRate: Number,
    adverbRate: Number,
    modifierRate: Number,
    emotiveWordRate: Number,
    positiveWordRate: Number,
    negativeWordRate: Number,
});

const Entry = mongoose.model("Entry", entriesSchema);
module.exports = Entry;
