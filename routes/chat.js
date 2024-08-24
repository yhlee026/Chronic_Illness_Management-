const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("chat.ejs"); // Render the chat
});

module.exports = router;
