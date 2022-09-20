const express = require("express");
const db = require("../models");
const axios = require("axios");
const router = express.Router();

// GET /exercises?page=[...]&q=[...] - list of exercises from wger Workout Manager
router.get("/", async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        // handle user incorrect input of page number in url
        if (page < 1) {
            page = 1;
        }
        // if there is a search query
        if (req.query.q) {
            // no results limit or 'pages'
            const response = await axios.get(`https://wger.de/api/v2/exerciseinfo/?limit=1000`);
            const results = response.data.results;
            // String.prototype.match() doesn't work in IE
            // To do: RegExp.prototype.test() does, but doesn't return results that are prefixed or suffixed
            const search = new RegExp(req.query.q, "gi"),
            filtered = results.filter(result => {
                // keep results that have matching exercise name or muscle group
                if (result.name.match(search)) {
                    return true;
                }
                else if (result.category.name.match(search)) {
                    return true;
                }
                // keep results that have matching equipment name
                result.equipment.forEach(equipment => {
                    if (equipment.name.match(search)) {
                        return true;
                    }
                })
            });
            // filter results to only contain english entries (built-in API url filter broken as of 2022-09-19)
            const exercises = filtered.filter(item => item.language.id === 2);
            res.render("exercises/index.ejs", {exercises, page});
        }
        else {
            // offset=0 on first page and increases by 50 as page num increases
            const response = await axios.get(`https://wger.de/api/v2/exerciseinfo/?limit=50&offset=${(page - 1) * 50}`);
            // filter results to only contain english entries (built-in API url filter broken as of 2022-09-19)
            const exercises = response.data.results.filter(item => item.language.id === 2);
            res.render("exercises/index.ejs", {exercises, page});
        }
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
            res.redirect("/routines/new?message=No routines found on account. Create one before adding an exercise.");
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