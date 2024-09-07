const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  chat_history_query = "SELECT * FROM text_messages";
  global.db.all(chat_history_query, function (err, chat_history_rows) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.render("chat.ejs", { chat_history_rows: chat_history_rows }); // Render the chat
    }
  });
});

router.post("/", (req, res, next) => {
  const contact_email = req.body.contact_email;

  // Query to fetch messages involving this contact
  const query = `
      SELECT * FROM text_messages 
      WHERE sender_email = ? OR recipient_email = ?
  `;
  const query_parameters = [contact_email, contact_email];

  global.db.all(query, query_parameters, function (err, chat_history_rows) {
    if (err) {
      next(err); // Pass the error to the error handler
    } else {
      // Render the chat page with the loaded messages
      res.render("chat.ejs", { chat_history_rows: chat_history_rows });
    }
  });
});

/**
 * @desc Send text message
 */
router.post("/text-message", (req, res, next) => {
  sender_email = req.body.sender_email; // Capture the sender_email from the form submission
  recipient_email = req.body.recipient_email; // Capture the sender_email from the form submission
  // Create a new comment to the comments database
  query =
    "INSERT INTO text_messages (sender_email, recipient_email, message_content) VALUES( ?, ?, ? );";
  query_parameters = [sender_email, recipient_email, req.body.message_content];

  // Execute the query and send a confirmation message
  global.db.run(query, query_parameters, function (err) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      // Refresh the page
      res.redirect(req.get("Referrer"));
      next();
    }
  });
});

module.exports = router;
