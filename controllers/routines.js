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
// POST /routines - create routine associated w/ logged-in user in db
router.post("/", async (req, res) => {
    try {
        const routine = await db.routine.create({
            title: req.body.title,
            description: req.body.description,
            userId: res.locals.user.id
        })
        res.redirect(`/routines/${routine.id}`);
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})

module.exports = router;