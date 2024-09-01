const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const userEmail = req.session.user.email;
  const db = global.db;

  db.all(
    "SELECT * FROM med_records WHERE user = ? ORDER BY date DESC LIMIT 5;",
    [userEmail],
    (err, records) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .send("An error occurred while retrieving records"); // Throw error when failure to retrieve records
      }

      res.render("records.ejs", { records });
    }
  );
});

module.exports = router;
