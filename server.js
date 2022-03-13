require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/keystrokeDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const routes = require("./routes/routes.js");

app.use("/", routes);

app.listen("3000", () => console.log("Server started on port 3000"));
