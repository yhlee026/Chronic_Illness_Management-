const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("login.ejs"); // Render the records
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.log("Received email:", email); // Debugging log
  console.log("Received password:", password); // Debugging log

  try {
    const db = global.db;
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM login_credentials WHERE email = ?",
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    console.log("User retrieved from database:", user); // Debugging log

    if (user && (await bcrypt.compare(password, user.password))) {
      res.redirect("/home");
    } else {
      res.render("login.ejs", { error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during login;", err);
    res.status(500).send("An error occured during login");
  }
});

module.exports = router;
