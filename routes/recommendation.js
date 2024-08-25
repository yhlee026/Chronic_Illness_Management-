const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('recommendation'); // Render the signup 
  });

module.exports = router;
