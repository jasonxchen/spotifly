const express = require("express");
const db = require("../models");
const axios = require("axios");
const router = express.Router();

// GET /exercises - list of exercises from wger Workout Manager
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
// POST /exercises - find or create exercise record of interest and add it relationally to the routine selected
router.post("/", async (req, res) => {
    try {
        if (!res.locals.user) {
            // send error message if user is not logged-in and trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else if (!req.body.routineId) {
            // To do: add message telling user to make a routine first (none on account)
            res.redirect("/exercises");
        }
        else {
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
            // manually change updatedAt for routine ordering purposes
            routine.changed("updatedAt", true)
            await routine.update({updatedAt: new Date()})
            res.redirect(`/routines/${routine.id}`);
        }
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})

module.exports = router;