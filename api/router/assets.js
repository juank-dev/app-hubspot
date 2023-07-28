const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/close', async (req, res) => {
  router.use(express.static(__dirname + '/../../assets'));
  res.sendFile(path.join(__dirname + '/../../assets/close.png'));
});
router.get('/success', async (req, res) => {
  router.use(express.static(__dirname + '/../../assets'));
  res.sendFile(path.join(__dirname + '/../../assets/success.png'));
});

module.exports = router;
