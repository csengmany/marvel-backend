const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
    try {
        const { name, page } = req.query;

        //in frontend there is a page query to skip 100 characters / 200, 300, ...
        console.log("page", req.query.page); //0, 1, 2, 3

        // in backend page start at 0 and skip = 0
        // in frontend we want that page start at 1 and skip = 0
        //to fixe page and have same skip in frontend and backend :
        let numberOfpage;
        if (Number(page)) {
            numberOfpage = page - 1; //if in frontend page 1 => page 0 in backend
        }
        let skip = numberOfpage * 100;
        const response = await axios.get(
            `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_SECRET}&skip=${skip}&name=${name}`
        );

        res.json(
            response.data
            // response.data.results.map((character, index) => {
            //     return character.name;
            // }),
        );
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
