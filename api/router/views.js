const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/guide', async (req, res) => {
  router.use(express.static(__dirname + '/../../src'));
  res.sendFile(path.join(__dirname + '/../../src/views/documentation.html'));
});

module.exports = router;
