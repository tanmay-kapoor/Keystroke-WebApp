const express = require("express");
const router = express.Router();

const {
    getBaselinePage,
    postBaselineData,
} = require("../controllers/baseline.controller.js");

router.get("/", getBaselinePage);
router.post("/", postBaselineData, (res) => {
    res.status(200).json(res);
});

module.exports = router;
