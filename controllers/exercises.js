const express = require("express");
const db = require("../models");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // response data only has <= 60 results for testing speed...
        // To do: for mvp, increase limit; for stretch goal, add pagination
        const response = await axios.get("https://wger.de/api/v2/exerciseinfo/?limit=60");
        const exercises = response.data.results.filter(item => item.language.id === 2);
        res.render("exercises/index.ejs", {exercises});
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})

module.exports = router;