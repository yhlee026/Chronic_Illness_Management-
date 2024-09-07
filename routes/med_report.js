const express = require("express");
const router = express.Router();

// Render medical report page
router.get("/", (req, res) => {
  res.render("med_report.ejs");
});

// Get document number and content from med_records table
router.get("/:doc_no", (req, res) => {
  const docNo = req.params.doc_no;
  const db = global.db;

  db.get(
    // Query to select all entries in the table
    "SELECT * FROM med_records WHERE doc_no = ?",
    [docNo],
    (err, record) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .send("An error occurred while retrieving the record"); // Throw error during retrieval failure
      }

      if (!record) {
        return res.status(404).send("Record not found"); // Throw error if record not found
      }

      res.render("med_report.ejs", { record });
    }
  );
});

module.exports = router;
