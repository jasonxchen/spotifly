const express = require("express");
const db = require("../models");
const crypto = require("crypto-js");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const router = express.Router();

// POST /users - create user in db
router.post("/", async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 12);
        const [newUser, userCreated] = await db.user.findOrCreate({
            where: {
                // don't create account if either username or email are already in use
                [Op.or]: [{username: req.body.username}, {email: req.body.email}]
            },
            defaults: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            }
        });
        if (!userCreated) {
            console.log("user exists already");
            res.redirect("/login?message=Please log into your account to continue.");
        }
        else {
            // on successful login
            const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET);
            res.cookie("userId", encryptedUserId.toString());
            res.redirect(`/users/${newUser.username}`);
        }
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// POST /users/login - accept a payload of form data and use it to log a user in
router.post("/login", async (req, res) => {
    try {
        // look up user in the db using the supplied username or email
        const user = await db.user.findOne({
            where: {
                [Op.or]: [{username: req.body.userOrEmail}, {email: req.body.userOrEmail}]
            }
        })
        const incorrectLogin = "Incorrect username or password";    // default error message
        // if the user is not found, send user back to login form
        if (!user) {
            console.log("user not found");
            res.redirect("/login?message=" + incorrectLogin);
        }
        // if the user is found, but wrong pw, send back to form
        else if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log("wrong password");
            res.redirect("/login?message=" + incorrectLogin);
        }
        // if the user is found and pw matches what is in the db, log them in
        else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET);
            res.cookie("userId", encryptedUserId.toString());
            res.redirect(`/users/${user.username}`);
        }
    } 
    catch (error) {
        console.log(error);
        res.send("server error");
    }
})
// GET /users/:username - public details about a user
router.get("/:username", async (req, res) => {
    try {
        const publicUser = await db.user.findOne(
        {
            where:
            {
                username: req.params.username
            },
            include: [db.routine],
            // have most recently updated routines at the top of profile
            order: [[db.routine, "updatedAt", "DESC"]]
        }) 
        res.render("users/profile.ejs", {publicUser});
    } 
    catch (error) {
        console.log(error);
        res.send("server error");
    }
})
// PUT /users/:userId - update user in db
router.put("/:userId", async (req, res) => {
    try {
        if (!res.locals.user) {
            // send error message if user is not logged-in and trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else {
            const user = await db.user.findByPk(req.params.userId);
            // find if username or email is taken in user db
            const existingUsername = await db.user.findOne({
                where: {
                    username: req.body.username
                }
            })
            const existingEmail = await db.user.findOne({
                where: {
                    email: req.body.email
                }
            })
            // if the username or email exists and they're not used by the logged-in user, redirect to settings page with message
            if (existingUsername && existingUsername.username !== res.locals.user.username) {
                res.redirect("/settings?message=Username unavailable");
            }
            else if (existingEmail && existingEmail.email !== res.locals.user.email) {
                res.redirect("/settings?message=Email already in use");
            }
            else if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
                res.redirect("/settings?message=Old password is incorrect");
            }
            else if (req.body.newPassword !== req.body.newPasswordConfirm) {
                res.redirect("/settings?message=Password confirmation does not match");
            }
            else {
                const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12);
                user.set({
                    // To do: separate changes (not all at once)
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword
                })
                await user.save();
                res.redirect(`/users/${user.username}`);
            }
        }
    }
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// DELETE /users/:userId - delete user from db
router.delete("/:userId", async (req, res) => {
    try {
        if (!res.locals.user) {
            // send error message if user is not logged-in and trying to send a request via other avenues
            res.send("Error 405 (Method Not Allowed)!");
        }
        else {
            const user = await db.user.findByPk(req.params.userId);
            const routines = await db.routine.findAll({where: {userId: user.id}});
            routines.forEach(async (routine) => {
                const routinesExercises = await db.routines_exercises.findAll({where: {routineId: routine.id}});
                routinesExercises.forEach(async (record) => {
                    await record.destroy();
                })
                await routine.destroy();
            })
            // delete all notes associated with user to be deleted
            const notes = await db.note.findAll({where: {userId: user.id}});
            notes.forEach(async (note) => {
                await note.destroy();
            })
            await user.destroy();
            res.redirect("/");
        }
    }
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})

module.exports = router;
