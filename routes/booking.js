const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('booking'); // Render the booking 
  });
  
module.exports = router;