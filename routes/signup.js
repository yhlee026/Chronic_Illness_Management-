const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("signup.ejs"); // Render the signup
});

router.post("/signup", (req, res) => {
  const {
    first_name,
    last_name,
    d_o_b,
    sex,
    mobile_number,
    email,
    address,
    unit_number,
    postal_code,
    country,
    password,
  } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .send("An error occurred while processing your reques at first.");
    }

    const db = global.db;

    // Insert into personal_information table
    const insertPersonalInfo = `INSERT INTO personal_information (first_name, last_name, d_o_b, sex, mobile_number, email, address, unit_number, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      insertPersonalInfo,
      [
        first_name,
        last_name,
        d_o_b,
        sex,
        mobile_number,
        email,
        address,
        unit_number,
        postal_code,
        country,
      ],
      function (err) {
        if (err) {
          console.error(err.message);
          return res
            .status(500)
            .send(
              "An error occurred while processing your request for personal information."
            );
        }

        // Insert into login_credentials table
        const insertLoginCredentials = `INSERT INTO login_credentials (email, password) VALUES (?, ?)`;
        db.run(insertLoginCredentials, [email, hashedPassword], function (err) {
          if (err) {
            console.error(err.message);
            return res
              .status(500)
              .send(
                "An error occurred while processing your request password."
              );
          } else {
            res.redirect("/"); // Redirect to another route or page upon success
          }
        });
      }
    );
  });
});

module.exports = router;
