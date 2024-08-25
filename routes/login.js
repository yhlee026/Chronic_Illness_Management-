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

    // Update last login timestamp
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE personal_information SET last_login = CURRENT_TIMESTAMP WHERE email = ?",
        [email],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    // Initialize session user data
    if (user && (await bcrypt.compare(password, user.password))) {
      const personalInfo = await new Promise((resolve, reject) => {
        db.get(
          "SELECT first_name, last_name FROM personal_information WHERE email = ?",
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
      req.session.user = {
        email,
        firstName: personalInfo.first_name,
        lastName: personalInfo.last_name,
      };
      req.session.lastLogin = await new Promise((resolve, reject) => {
        db.get(
          "SELECT last_login FROM personal_information WHERE email = ?",
          [email],
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.last_login);
            }
          }
        );
      });
      res.redirect("/home");
    } else {
      res.render("login.ejs", { error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during login;", err);
    res.status(500).send("An error occurred during login");
  }
});

module.exports = router;
