const { Router } = require("express");
const router = Router();
const path = require("path");

router.get("/download/shangoo", (req, res) => {
    res.download(
        path.join(__dirname, "../public/img/shangoo-image.png"),
        (err) => {
            if (err) console.log(err);
        }
    );
});

module.exports = router;