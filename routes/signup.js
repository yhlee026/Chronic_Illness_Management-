const express = require("express");
const router = express.Router();

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
  } = req.body;

  const db = global.db;

  const query =
    "INSERT INTO personal_information (first_name, last_name, d_o_b, sex, mobile_number, email, address, unit_number, postal_code, country)VALUES (?,?,?,?,?,?,?,?,?,?)";

  db.run(
    query,
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
        res
          .status(500)
          .send("An error occurred while processing your request.");
      } else {
        res.redirect("/"); // Redirect to another route or page upon success
      }
    }
  );
});

module.exports = router;
