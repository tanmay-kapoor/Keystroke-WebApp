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

const port =
    process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
