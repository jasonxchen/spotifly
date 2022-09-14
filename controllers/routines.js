const express = require("express");
const db = require("../models");
const router = express.Router();

router.get("/:routineId", async (req, res) => {
    try {
        const routine = await db.routine.findByPk(req.params.routineId, {include: [db.user, db.exercise]});
        res.render("routines/details.ejs", {routine});
    } catch (error) {
        console.warn(error);
        res.send("server error");
    }
})

module.exports = router;