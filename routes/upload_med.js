const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("upload_med.ejs");
});

// Handle form submission
router.post("/", (req, res) => {
  const { doc_no, date, type, doctor, report } = req.body;
  const userEmail = req.session.user.email;

  const db = global.db;

  db.run(
    "INSERT INTO med_records (user, doc_no, date, type, doctor, report) VALUES (?, ?, ?, ?, ?, ?)",
    [userEmail, doc_no, date, type, doctor, report],
    (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .send("An error occurred while uploading the record"); // Throw error when failure to upload
      }

      res.redirect("/records"); // Redirect to records page after successful upload
    }
  );
});

module.exports = router;
