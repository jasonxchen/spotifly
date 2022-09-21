const express = require("express");
const db = require("../models");
const router = express.Router();

// PUT /notes/:noteId - update note in db
router.put("/:noteId", async (req, res) => {
    try {
        const note = await db.note.findByPk(req.params.noteId);
        if (!res.locals.user || res.locals.user.id !== note.userId) {
            // send error message if user is not logged-in OR the owner, and is trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else {
            note.set({
                text: req.body.noteText
            })
            await note.save();
            // To do: add "successfully updated note" message
            res.redirect(`/routines/${note.routineId}`);
        }
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})

module.exports = router;