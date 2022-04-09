module.exports = {
    isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) next();
        else {
            req.flash("error", "Unauthorized");
            res.redirect("/");
        }
    },
    isNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            req.flash("error", "You're already authenticated");
            res.redirect("/");
        } else next();
    },
};