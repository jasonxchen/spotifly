const express = require("express");
const db = require("../models");
const router = express.Router();

// GET /routines/new - form to create a new routine
router.get("/new", async (req, res) => {
    try {
        if (!res.locals.user) {
            // redirect to home page if user is not logged-in and trying to access /routines/new through url
            res.redirect("/");
        }
        else {
            res.render("routines/new.ejs");
        }
    }
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// GET /routines/:routineId
router.get("/:routineId", async (req, res) => {
    try {
        const routine = await db.routine.findByPk(req.params.routineId, {include: [db.user, db.exercise]});
        res.render("routines/details.ejs", {routine});
    } catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// GET /routines/edit/:routineId - form to edit a routine
router.get("/edit/:routineId", async (req, res) => {
    try {
        const routine = await db.routine.findByPk(req.params.routineId);
        if (res.locals.user && res.locals.user.id === routine.userId) {
            res.render("routines/edit.ejs", {routine});
        }
        else {
            // redirect back to details page if user is not the owner of specified routine and trying to access url
            res.redirect(`/routines/${req.params.routineId}`);
        }
    }
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// POST /routines - create routine associated w/ logged-in user in db
router.post("/", async (req, res) => {
    try {
        if (!res.locals.user) {
            // send error message if user is not logged-in and trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else {
            const routine = await db.routine.create({
                title: req.body.title,
                description: req.body.description,
                userId: res.locals.user.id
            })
            res.redirect(`/routines/${routine.id}`);
        }
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// PUT /routines/:routineId - update routine in db
router.put("/:routineId", async (req, res) => {
    try {
        const routine = await db.routine.findByPk(req.params.routineId);
        if (!res.locals.user || res.locals.user.id !== routine.userId) {
            // send error message if user is not logged-in OR the owner, and is trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else {
            routine.set({
                title: req.body.title,
                description: req.body.description
            })
            await routine.save();
            res.redirect(`/routines/${routine.id}`);
        }
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// DELETE /routines/:routineId - delete a routine from db
router.delete("/:routineId", async (req, res) => {
    try {
        const routine = await db.routine.findByPk(req.params.routineId);
        if (!res.locals.user || res.locals.user.id !== routine.userId) {
            // send error message if user is not logged-in OR the owner, and is trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else {
            const routinesExercises = await db.routines_exercises.findAll({
                where: {
                    routineId: routine.id
                }
            })
            routinesExercises.forEach(async (record) => {
                await record.destroy();
            })
            await routine.destroy();
            res.redirect(`/users/${res.locals.user.username}`);
        }
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// DELETE /routines/:routineId/exercises/:exerciseId - remove an association of a specific exercise to a routine with routineId
router.delete("/:routineId/exercises/:exerciseId", async (req, res) => {
    try {
        const routine = await db.routine.findByPk(req.params.routineId);
        if (!res.locals.user || res.locals.user.id !== routine.userId) {
            // send error message if user is not logged-in OR the owner, and is trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else {
            const exercise = await db.exercise.findByPk(req.params.exerciseId);
            await routine.removeExercise(exercise);
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