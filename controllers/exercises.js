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
router.post("/", async (req, res) => {
    try {
        const routine = await db.routine.findByPk(req.body.routineId);
        const exerciseId = req.body.exerciseId;
        const exerciseName = req.body.exerciseName;
        const exerciseDesc = req.body.exerciseDesc;
        const exerciseCategory = req.body.exerciseCategory;
        const exerciseEquip = req.body.exerciseEquip;
        const [exercise, exerciseCreated] = await db.exercise.findOrCreate({
            where: {
                id: exerciseId
            },
            defaults: {
                name: exerciseName,
                description: exerciseDesc,
                category: exerciseCategory,
                equipment: exerciseEquip
            }
        })
        console.log(`New exercise imported: ${exerciseCreated}`);
        await routine.addExercise(exercise);
        res.redirect(`/routines/${routine.id}`);
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})

module.exports = router;