const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("signup.ejs"); // Render the signup page
});

router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    d_o_b,
    sex,
    mobile_number,
    email,
    user_name,
    address,
    unit_number,
    postal_code,
    country,
    password,
  } = req.body;

  try {
    // Log incoming request data
    console.log("Signup Request Data:", req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const db = global.db;

    // Start transaction
    await db.run("BEGIN TRANSACTION");

    // Insert into personal_information table
    const insertPersonalInfo = `
      INSERT INTO personal_information 
      (first_name, last_name, d_o_b, sex, mobile_number, email, user_name, address, unit_number, postal_code, country) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const test = await db.run(insertPersonalInfo, [
      first_name,
      last_name,
      d_o_b,
      sex,
      mobile_number,
      email,
      user_name,
      address,
      unit_number,
      postal_code,
      country,
    ]);
    console.log(email, test);
    // Insert into login_credentials table
    const insertLoginCredentials = `
      INSERT INTO login_credentials (email, user_name, password) 
      VALUES (?, ?, ?)`;

    await db.run(insertLoginCredentials, [email, user_name, hashedPassword]);

    // Commit transaction
    await db.run("COMMIT");

    // Redirect to the login page on successful signup
    res.redirect("/");
  } catch (err) {
    console.error("Detailed Error during signup:", err);

    // Rollback transaction on error
    //await db.run("ROLLBACK");

    if (err.message.includes("UNIQUE constraint failed")) {
      res
        .status(400)
        .send("Email already exists. Please use a different email.");
    } else {
      res.status(500).send("An error occurred while processing your request.");
    }
  }
});

module.exports = router;
