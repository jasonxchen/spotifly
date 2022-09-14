const express = require("express");
const db = require("../models");
const crypto = require("crypto-js");
const bcrypt = require("bcrypt");
const router = express.Router();

// GET /users/new - form to create new user
router.get("/new", (req, res) => {
    res.render("users/new.ejs");
})
// POST /users - create user in db
router.post("/", async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 12);
        const [newUser, userCreated] = await db.user.findOrCreate({
            where: {
                username: req.body.username
            },
            defaults: {
                email: req.body.email,    // To do: handle duplicate emails
                password: hashedPassword
            }
        });
        if (!userCreated) {
            console.log("user exists already");
            res.redirect("/users/login?message=Please log into your account to continue.");
        }
        else {
            // on successful login
            const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET);
            res.cookie("userId", encryptedUserId.toString());
            res.redirect("/users/profile");
        }
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// GET /users/login - show a login form to user
router.get("/login", (req, res) => {
    res.render("users/login.ejs", {
        // potenitally receive login error message
        message: req.query.message ? req.query.message : null
    });
})
// POST /users/login - accept a payload of form data and use it to log a user in
router.post("/login", async (req, res) => {
    try {
        // look up user in the db using the supplied email
        const user = await db.user.findOne({
            where: {
                // To do: log in with either username or email
                email: req.body.email
            }
        })
        const incorrectLogin = "Incorrect username or password";    // default error message
        // if the user is not found, send user back to login form
        if (!user) {
            console.log("user not found");
            res.redirect("/users/login?message=" + incorrectLogin);
        }
        // if the user is found, but wrong pw, send back to form
        else if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log("wrong password");
            res.redirect("/users/login?message=" + incorrectLogin);
        }
        // if the user is found and pw matches what is in the db, log them in
        else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET);
            res.cookie("userId", encryptedUserId.toString());
            res.redirect("/users/profile");
        }
    } 
    catch (error) {
        console.log(error);
        res.send("server error");
    }
})
// GET /users/logout - log out a user by clearing the stored cookie
router.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.redirect("/");
})
// GET /users/profile
router.get("/profile", (req,res) => {    // broken link; To do: redirect to related /users/:username route OR remove route OR refactor into settings page
    if (!res.locals.user) {
        res.redirect("/users/login?message=You must authenticate before you are authorized to view this resource.");
    }
    else {
        res.render("users/profile.ejs", {user: res.locals.user});
    }
})
// GET /users/:username - public details about a user
router.get("/:username", async (req, res) => {
    try {
        const user = await db.user.findOne(
        {
            where:
            {
                username: req.params.username
            },
            include: [db.routine]
        }) 
        res.render("users/profile.ejs", {user});
    } 
    catch (error) {
        console.log(error);
        res.send("server error");
    }
})

module.exports = router;
