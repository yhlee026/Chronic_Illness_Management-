const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home'); // Render the home 
  });

module.exports = router;