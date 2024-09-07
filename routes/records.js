const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const userEmail = req.session.user.email;
  const db = global.db;

  db.all(
    // Query all entries from table based on email
    // Only 5 most recent entries are retrieved
    "SELECT * FROM med_records WHERE user = ? ORDER BY date DESC LIMIT 5;",
    [userEmail],
    (err, records) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .send("An error occurred while retrieving records"); // Throw error when failure to retrieve records
      }

      // Render records page
      res.render("records.ejs", { records });
    }
  );
});

module.exports = router;
