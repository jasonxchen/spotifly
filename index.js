// required packages
require("dotenv").config();
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const db = require("./models");
const cookieParser = require("cookie-parser");
const crypto = require("crypto-js");

// config express app/middlewares
const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(async (req, res, next) => {
    if (req.cookies.userId) {
        let decryptedUserId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        decryptedUserId = decryptedUserId.toString(crypto.enc.Utf8);
        const user = await db.user.findByPk(decryptedUserId);    // To do: refactor code to use "currUser" instead of "user"
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

// routes
app.get("/", (req, res) => {
    res.render("index.ejs");
})

// listen
app.listen(PORT, () => {
    console.log(`Spotifly Express server is listening on port: ${PORT}`)
})
