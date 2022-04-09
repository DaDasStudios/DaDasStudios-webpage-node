const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Connection and handlement of the DB
const dbConnection = require("../config/database-connection");
const errorHandler = require("../helpers/query-error-handler");
const queryPromise = require("../helpers/query-promise");
const {
    isAuthenticated,
    isNotAuthenticated,
} = require("../helpers/routes-protector");

// Passport requires
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;

// Google strategy

passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/accounts/google/callback",
            passReqToCallback: true,
        },
        function(request, accessToken, refreshToken, profile, done) {
            const handleGoogleAuth = function(err, result) {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    else {
                        if (!result.length)
                            resolve({
                                message: "That user does not exist, so he will be inserted in DB",
                                keyToDo: "create",
                            });
                        else
                            resolve({
                                message: "User has been found",
                                keyToDo: "send",
                            });
                    }
                });
            };

            // Search the user in db
            dbConnection.query(
                "SELECT * FROM users WHERE id=?", [profile.id],
                (err, result) => {
                    handleGoogleAuth(err, result)
                        .then((resolve) => {
                            console.log(resolve.message);
                            if (resolve.keyToDo === "create") {
                                dbConnection.query(
                                    `INSERT INTO users(id, username, email) VALUES(${profile.id}, '${profile.displayName}', '${profile.email}')`,
                                    (err) => {
                                        queryPromise(err).then((success) => {
                                            console.log("New record in DB...");
                                            return done(err, {
                                                id: profile.id,
                                                username: profile.displayName,
                                                email: profile.email,
                                                password: null,
                                            });
                                        });
                                    }
                                );
                                return;
                            }
                            if (resolve.keyToDo === "send") {
                                done(null, result[0]);
                            }
                        })
                        .catch((err) => {
                            console.log("Something went wrong in GoogleAuth");
                            console.log(err);
                        });
                }
            );
        }
    )
);

// Facebook strategy

passport.use(
    new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3000/accounts/facebook/callback",
            profileFields: [
                "id",
                "displayName",
                "name",
                "picture.type(large)",
                "email",
            ],
        },
        function(accessToken, refreshToken, profile, done) {
            // Function to handler the callback easily
            const handleFacebookAuth = function(err, result) {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    else {
                        if (!result.length)
                            resolve({
                                message: "That user does not exist, so he will be inserted in DB",
                                keyToDo: "create",
                            });
                        else
                            resolve({
                                message: "User has been found",
                                keyToDo: "send",
                            });
                    }
                });
            };
            // Validate that user in DB
            console.log(profile);
            dbConnection.query(
                "SELECT * FROM users WHERE id=?", [profile.id],
                (err, result) => {
                    handleFacebookAuth(err, result)
                        .then((resolve) => {
                            console.log(resolve.message);
                            if (resolve.keyToDo === "create") {
                                dbConnection.query(
                                    `INSERT INTO users(id, username, email) VALUES(${profile.id}, '${profile.displayName}', '${profile.emails[0].value}')`,
                                    (err) => {
                                        queryPromise(err).then((success) => {
                                            return done(err, {
                                                id: profile.id,
                                                username: profile.displayName,
                                                email: profile.emails[0].value,
                                                password: null,
                                            });
                                        });
                                    }
                                );
                            }
                            if (resolve.keyToDo === "send") {
                                return done(null, result[0]);
                            }
                        })
                        .catch((err) => {
                            console.log("Something went wrong in FacebookAuth");
                            console.log(err);
                        });
                }
            );
        }
    )
);

// Github strategy
passport.use(
    new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/accounts/github/callback",
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            const handleGithub = function(err, result) {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    else {
                        if (!result.length)
                            resolve({
                                message: "That user does not exist, so he will be inserted in DB",
                                keyToDo: "create",
                            });
                        else
                            resolve({
                                message: "User has been found",
                                keyToDo: "send",
                            });
                    }
                });
            };

            // Search the user in db
            dbConnection.query(
                "SELECT * FROM users WHERE id=?", [profile.id],
                (err, result) => {
                    handleGithub(err, result)
                        .then((resolve) => {
                            console.log(resolve.message);
                            if (resolve.keyToDo === "create") {
                                dbConnection.query(
                                    `INSERT INTO users(id, username, email) VALUES(${profile.id}, '${profile.username}', '${profile.email}')`,
                                    (err) => {
                                        queryPromise(err).then((success) => {
                                            console.log("New record in DB...");
                                            return done(err, {
                                                id: profile.id,
                                                username: profile.username,
                                                email: profile.email,
                                                password: null,
                                            });
                                        });
                                    }
                                );
                                return;
                            }
                            if (resolve.keyToDo === "send") {
                                done(null, result[0]);
                            }
                        })
                        .catch((err) => {
                            console.log("Something went wrong in Github Auth");
                            console.log(err);
                        });
                }
            );
        }
    )
);

// Local strategy

passport.use(
    new passportLocal({
            usernameField: "email",
        },
        (email, password, done) => {
            // Validations of user
            dbConnection.query(
                "SELECT * FROM users WHERE email=?", [email],
                (err, result) => {
                    errorHandler(err, async() => {
                        // If result is major than cero, it means that user exists
                        if (result.length > 0) {
                            const matchPassword = await bcrypt.compare(
                                password,
                                result[0].password
                            );
                            if (matchPassword) {
                                console.log("password match");
                                return done(null, result[0]);
                            }
                            return done(null, false, { message: "Incorrect password" });
                        }
                        return done(null, false, { message: "User not found" });
                    });
                }
            );
        }
    )
);

// Serialization and deserialization

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    dbConnection.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
        errorHandler(err, () => {
            return done(null, result[0]);
        });
    });
});

// Main function with the routers

function main() {
    // Main routes

    router.get("/accounts/signin", isNotAuthenticated, (req, res) => {
        res.render("accounts/signin", { classFooter: "bg-primary-blue" });
    });

    router.post(
        "/accounts/signin",
        isNotAuthenticated,
        passport.authenticate("local", {
            failureRedirect: "/accounts/signin",
            successRedirect: "/",
            failureFlash: true,
        })
    );

    router.get("/accounts/signup", isNotAuthenticated, (req, res) => {
        res.render("accounts/signup", { classFooter: "bg-primary-blue" });
    });

    router.post("/accounts/signup", isNotAuthenticated, (req, res) => {
        // Creating a new account
        const { name, email, password, confirmPassword } = req.body;
        const errors = [];

        // Validating whether password don't match or if that user already exists
        dbConnection.query(
            "SELECT * FROM users WHERE email=?", [email],
            (err, result) => {
                queryPromise(err).then(async(success) => {
                    // If the array's length equals to zero, it means that the searched user is not found, therefore we can add it nosw
                    if (result.length > 0) {
                        errors.push("That email is already registered");
                    }

                    if (password !== confirmPassword) {
                        errors.push("Passwords don't match");
                    }

                    // Final validation
                    if (errors.length > 0) {
                        res.render("accounts/signup", {
                            classFooter: "bg-primary-blue",
                            errors,
                            name,
                            email,
                            password,
                        });
                    } else {
                        // In case there's no errors, create a new user, do a query to db, hash the password and redirect to signin view
                        const hashedPassword = await bcrypt.hash(password, 10);
                        const newUser = new User(name, email, hashedPassword);

                        // Create a new query in DB
                        dbConnection.query(
                            `INSERT INTO users(id, username, email, password) VALUES(${newUser.getValues()})`,
                            (err, result) => {
                                queryPromise(err)
                                    .then((success) => {
                                        console.log(success);
                                        console.log(result);
                                        req.flash("success", "Account created successfully");
                                        res.redirect("/accounts/signin");
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                        );
                    }
                });
            }
        );
    });

    router.get("/accounts/logout", isAuthenticated, (req, res) => {
        req.logOut();
        req.flash("success", "Logged out successfully");
        res.redirect("/");
    });

    // Google handler

    router.get(
        "/accounts/google/callback",
        isNotAuthenticated,
        passport.authenticate("google", {
            successRedirect: "/",
            failureRedirect: "/accounts/signin",
        })
    );

    router.post(
        "/accounts/signin/google",
        isNotAuthenticated,
        passport.authenticate("google", {
            scope: ["email", "profile"],
        })
    );

    // Facebook handler

    router.get(
        "/accounts/facebook/callback",
        isNotAuthenticated,
        passport.authenticate("facebook", {
            successRedirect: "/",
            failureRedirect: "/accounts/signin",
        })
    );

    router.post(
        "/accounts/signin/facebook",
        isNotAuthenticated,
        passport.authenticate("facebook", { scope: "email" })
    );

    // Git Hub handler

    router.get(
        "/accounts/github/callback",
        passport.authenticate("github", {
            successRedirect: "/",
            failureRedirect: "/accounts/signin",
        })
    );

    router.post(
        "/accounts/signin/github",
        passport.authenticate("github", { scope: "email" })
    );
}

// DB connetion
// In case occurs some errors, routers are not initializated

dbConnection.connect((err) => {
    if (err) console.log(err);
    else {
        console.log("DB connected");
        main();
    }
});

module.exports = router;