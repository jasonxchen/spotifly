// required packages
require("dotenv").config();
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const db = require("./models");
const cookieParser = require("cookie-parser");
const crypto = require("crypto-js");
const methodOverrive = require("method-override");

// config express app/middlewares
const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverrive("_method"));
app.use(async (req, res, next) => {
    if (req.cookies.userId) {
        let decryptedUserId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        decryptedUserId = decryptedUserId.toString(crypto.enc.Utf8);
        const user = await db.user.findByPk(decryptedUserId, {    // To do: refactor code to use "currUser" instead of "user"
            include: [db.routine],
            // order by most recently updated routines
            order: [[db.routine, "updatedAt", "DESC"]]
        });
        res.locals.user = user;    // supply all routes downstream with a sequelize instance of logged in user
    }
    else {
        res.locals.user = null;
    }
    next();
})

// controllers
app.use("/users", require("./controllers/users"));
app.use("/routines", require("./controllers/routines"));
app.use("/exercises", require("./controllers/exercises"));

// routes
// home page
app.get("/", async (req, res) => {
    try {
        // To do: render older routines later (i.e. facebook feed scrolling) and/or hard limit
        const routines = await db.routine.findAll({
            include: [db.user],
            order: [["updatedAt", "DESC"]]
        });
        res.render("index.ejs", {routines});
    } 
    catch (error) {
        console.warn(error);
        res.send("server error");
    }
})
// display form to edit user settings
app.get("/settings", (req, res) => {
    if (!res.locals.user) {
        res.redirect("/users/login");
    }
    else {
        res.render("users/settings.ejs");
    }
})
// display form to create new user
app.get("/signup", (req, res) => {
    if (res.locals.user) {
        res.redirect("/");
    }
    else {
        res.render("users/new.ejs");
    }
})
// show a login form to user
app.get("/login", (req, res) => {
    if (res.locals.user) {
        res.redirect("/");
    }
    else {
        res.render("users/login.ejs", {
            // potenitally receive login error message
            message: req.query.message ? req.query.message : null
        });
    }
})
// log out a user by clearing the stored cookie
app.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.redirect("/");
})

// listen
app.listen(PORT, () => {
    console.log(`Spotifly Express server is listening on port: ${PORT}`)
})
