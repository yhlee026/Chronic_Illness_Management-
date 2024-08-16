const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('records'); // Render the records
  });
  
module.exports = router;