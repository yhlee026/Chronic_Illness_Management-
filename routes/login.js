 const express = require("express");
 const router = express.Router();
 router.get("/login", (req, res) => {
   res.render("login.ejs"); // Render the records
 });
 module.exports = router;
