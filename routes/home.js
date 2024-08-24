const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home.ejs", {
      user: req.session.user,
      lastLogin: req.session.lastLogin,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
