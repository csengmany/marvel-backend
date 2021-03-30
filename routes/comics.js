const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics", async (req, res) => {
    try {
        const { title, skip, limit } = req.query;

        const response = await axios.get(
            `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_SECRET}&skip=${skip}&title=${title}&limit=${limit}`
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get("/comics/:characterId", async (req, res) => {
    const characterId = req.params.characterId;
    const response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.MARVEL_API_SECRET}`
    );
    res.json(response.data);
});
module.exports = router;
