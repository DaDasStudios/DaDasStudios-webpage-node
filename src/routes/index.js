const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.render("index", { classFooter: "bg-primary-blue" });
});

router.get("/products", (req, res) => {
    res.render("products", { classFooter: "bg-secondary" });
});

router.get("/resources", (req, res) => {
    res.render("resources", {
        classFooter: "bg-primary-blue",
        classNav: "bg-primary",
    });
});

router.get("/pricing", (req, res) => {
    res.render("pricing", {
        classNav: "bg-primary",
        classFooter: "bg-terciary",
    });
});

module.exports = router;