const express = require("express"); // Require the Express framework
const router = express.Router(); // Create an Express router to handle specific routes
const bcrypt = require("bcrypt"); // Require bcrypt for password hashing

//handle GET request to the signup page
router.get("/", (req, res) => {
  res.render("signup.ejs"); // Render the signup page
});

//handle POST request for user signup
router.post("/", async (req, res) => {
  //Destructure the fields from the signup form request body
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

    // Hash the password using bcrypt with a salt around of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const db = global.db; //Access the GLOBAL SQlite database instance

    // Start transaction in the database
    await db.run("BEGIN TRANSACTION");

    // SQL Query to insert personal information into personal_information database
    const insertPersonalInfo = `
      INSERT INTO personal_information 
      (first_name, last_name, d_o_b, sex, mobile_number, email, user_name, address, unit_number, postal_code, country) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the query and insert the user's personal information
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
    //SQL Query to insert login credentials into login_credentials database
    const insertLoginCredentials = `
      INSERT INTO login_credentials (email, user_name, password) 
      VALUES (?, ?, ?)`;

    // Execute the query and insert the user's email, username, and hashed password
    await db.run(insertLoginCredentials, [email, user_name, hashedPassword]);

    // Commit transaction after successfully inserting all data
    await db.run("COMMIT");

    // Redirect user to the login page on successful signup
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
