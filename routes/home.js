const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   const db = global.db;
//   const userId = req.session.userId;

//   // Query the database for the user's information
//   db.get(
//     "SELECT first_name, last_name FROM personal_information WHERE id = ?",
//     [userId],
//     (err, row) => {
//       if (err) {
//         return res.status(500).send("Error retrieving user data");
//       }

//       const userData = {
//         firstName: row.first_name,
//         lastName: row.last_name,
//       };

//       res.render("home.ejs", { user: userData });
//     }
//   );
// });

router.get("/home", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }

  const userData = {
    firstName: req.session.firstName,
    lastName: req.session.lastName,
  };

  res.render("home.ejs", { user: userData });
});

router.get("/home", (req, res) => {
  res.render("home.ejs");
});

module.exports = router;
