const natural = require("natural");

// const wordTokenizer = new natural.WordTokenizer();
// const sentenceTokenizer = new natural.SentenceTokenizer();

const language = "EN";
const defaultCategory = "NN";
const defaultCategoryCapitalized = "NNP";

const lexicon = new natural.Lexicon(
    language,
    defaultCategory,
    defaultCategoryCapitalized
);
const ruleSet = new natural.RuleSet("EN");
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

const nounTags = ["NN", "NNP", "NNPS", "NNS"];
const verbTags = ["VB", "VBD", "VBG", "VBN", "VBP", "VBZ"];
const conjunctionTags = ["CC"];
const adjectiveTags = ["JJ", "JJR", "JJS"];

let text,
    keystrokes,
    totalInputTime,
    totalKeystrokes,
    totalPauseTime,
    totalPauses;

let words, sentences;

function getAllFeatures(body) {
    text = body.text;
    keystrokes = body.keystrokes;
    totalInputTime = body.totalInputTime;
    totalKeystrokes = body.totalKeystrokes;
    totalPauseTime = body.totalPauseTime;
    totalPauses = body.totalPauses;

    return {
        ...timingFeatures(),
        ...keystrokeFeatures(),
        ...wordFeatures(),
        ...sentenceFeatures(),
    };
}

function timingFeatures() {
    return {
        totalInputTime,
        timePerKeystroke: totalInputTime / totalKeystrokes,
        adjustedTimePerKeystroke:
            (totalInputTime - totalPauseTime) / totalKeystrokes,
        averagePauseLength: totalPauseTime / totalPauses || 0,
        pauseRate: totalPauses / totalKeystrokes,
    };
}

function keystrokeFeatures() {
    return {
        backspaceKeyRate: getKeystrokeCount("backspace") / totalKeystrokes,
        deleteKeyRate: getKeystrokeCount("delete") / totalKeystrokes,
        endKeyRate: getKeystrokeCount("end") / totalKeystrokes,

        arrowKeyRate:
            (getKeystrokeCount("arrowup") +
                getKeystrokeCount("arrowdown") +
                getKeystrokeCount("arrowleft") +
                getKeystrokeCount("arrowright")) /
            totalKeystrokes,

        homeKeyRate: getKeystrokeCount("home") / totalKeystrokes,

        sentenceEndingPunctuationKeyRate:
            getKeystrokeCount("sentenceEndingPunctuation") / totalKeystrokes,

        punctuationKeyRate: getKeystrokeCount("punctuation") / totalKeystrokes,

        tabKeyRate: getKeystrokeCount("tab") / totalKeystrokes,
        capslockKeyRate: getKeystrokeCount("capslock") / totalKeystrokes,
        controlKeyRate: getKeystrokeCount("control") / totalKeystrokes,
        insertKeyRate: getKeystrokeCount("insert") / totalKeystrokes,
        enterKeyRate: getKeystrokeCount("enter") / totalKeystrokes,
        shiftKeyRate: getKeystrokeCount("shift") / totalKeystrokes,
        spaceKeyRate: getKeystrokeCount(" ") / totalKeystrokes,
        otherKeyRate: getKeystrokeCount("alphanumeric") / totalKeystrokes,
    };
}

function wordFeatures() {
    // words = wordTokenizer.tokenize(text);
    words = text.split(/[\s.?!,:;]+/g); // separate out words in text

    uniqueWords = new Set(words); // get unique words

    taggedWords = tagger.tag(words).taggedWords;

    return {
        lexicalDiversity: uniqueWords.size / words.length,
        averageWordLength: totalKeystrokes / words.length,
        nounRate: getRateFromTags(nounTags),
        verbRate: getRateFromTags(verbTags),
        conjunctionRate: getRateFromTags(conjunctionTags),
        adjectiveRate: getRateFromTags(adjectiveTags),
    };
}

function sentenceFeatures() {
    // sentences = sentenceTokenizer.tokenize(text);
    sentences = text.split(/[.?!\n]+/g);

    return {
        averageSentenceLength: words.length / sentences.length,
    };
}

function getKeystrokeCount(key) {
    return keystrokes[key] || 0;
}

function getRateFromTags(tags) {
    return getCount(tags) / words.length;
}

function getCount(tags) {
    const arr = taggedWords.filter((taggedWord) =>
        tags.includes(taggedWord.tag)
    );
    return arr.length;
}

module.exports = getAllFeatures;
