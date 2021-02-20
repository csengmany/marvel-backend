const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
    try {
        const { name, page, limit } = req.query;

        //in frontend there is a page query to skip 100 characters / 200, 300, ...
        console.log("page", req.query.page); //0, 1, 2, 3

        // in backend page start at 0 and skip = 0
        // in frontend we want that page start at 1 and skip = 0
        //to fixe page and have same skip in frontend and backend :
        let numberOfPage;
        if (page) {
            numberOfPage = page - 1; //if in frontend page 1 => page 0 in backend
        }
        let skip = limit * numberOfPage;
        const response = await axios.get(
            `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_SECRET}&skip=${skip}&name=${name}&limit=${limit}`
        );
        res.json(response.data);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
