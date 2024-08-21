const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("records.ejs"); // Render the records
});

module.exports = router;
