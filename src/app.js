const express = require("express");
const app = express();
const path = require("path");
const { engine } = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Configurations
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
    })
);
app.set("view engine", ".hbs");
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(methodOverride("_method"));
app.use(
    session({
        secret: "mysupersecret",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Globar variables
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.message = req.message;
    res.locals.user = req.user;
    next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/accounts"));
app.use(require("./routes/downloads"));

// Public
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;