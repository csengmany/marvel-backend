const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to Cathy's Marvel API 🦸🏻‍♀️ create at Le Reacteur");
});

const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);

app.all("*", (req, res) => {
    res.json({ message: "Cette route n'existe pas !" });
});

app.listen(3100, () => {
    console.log("Server started 🚀");
});
