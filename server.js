const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/keystrokeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const baselineRoutes = require("./routes/baseline.routes.js");

app.use("/baseline", baselineRoutes);

app.listen("3000", () => console.log("Server started on port 3000"));
