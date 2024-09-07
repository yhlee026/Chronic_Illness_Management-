const express = require("express"); // Require the Express framework
const router = express.Router(); // Create an Express router to handle specific routes
const bcrypt = require("bcrypt"); // Require bcrypt for password hashing and comparison

// Handle GET request to "/login"
router.get("/login", (req, res) => {
  res.render("login.ejs"); // Render to login route
});

// Handle POST requests to the root URL ("/") of this router (for user login)
router.post("/", async (req, res) => {
  const { email, password } = req.body; //extract email and password

  console.log("Received email:", email); // Debugging log
  console.log("Received password:", password); // Debugging log

  try {
    const db = global.db; //Access the global sqlite database
    const user = await new Promise((resolve, reject) => {
      db.get(
        // Retrieve the user information from the login_credentials table based on the email
        "SELECT * FROM login_credentials WHERE email = ?",
        [email], //user provide email to query the database
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

    // Update last login timestamp for the user in the personal_information
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE personal_information SET last_login = CURRENT_TIMESTAMP WHERE email = ?",
        [email], //update last login timestamp for the specific email
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    // Check if the user exists and if the provided password matches the stored hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      const personalInfo = await new Promise((resolve, reject) => {
        db.get(
          "SELECT first_name, last_name FROM personal_information WHERE email = ?",
          [email], //user provide email to query personal information
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      });
      // Set the session user data with the user's email, first name, and last name
      req.session.user = {
        email,
        firstName: personalInfo.first_name,
        lastName: personalInfo.last_name,
      };
      req.session.lastLogin = await new Promise((resolve, reject) => {
        db.get(
          "SELECT last_login FROM personal_information WHERE email = ?",
          [email], //query the last login timestamp for the user
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.last_login); //return the last login timestamp
            }
          }
        );
      });
      res.redirect("/home"); //redirect the user to the home page if successfully sign in
    } else {
      // If the user doesn't exist or the password is incorrect, render the login page with an error message
      res.render("login.ejs", { error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during login;", err);
    res.status(500).send("An error occurred during login");
  }
});

module.exports = router;
