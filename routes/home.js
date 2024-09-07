const express = require("express"); // Require the Express framework
const router = express.Router(); // Create an Express router to handle specific routes

// Handle GET requests to the root URL ("/") of the router
router.get("/", (req, res) => {
  // If the user is logged in, render the home page and pass the user and lastLogin data
  if (req.session.user) {
    res.render("home.ejs", {
      user: req.session.user, // Pass the logged-in user to the EJS template
      lastLogin: req.session.lastLogin, // Pass the last login time to the EJS template
    });
  } else {
    // If the user is not logged in, redirect to the login page
    res.redirect("/login");
  }
});

module.exports = router;
