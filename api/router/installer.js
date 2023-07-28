const express = require('express');
const { InstallerController } = require('../controllers');
const router = express.Router();
const path = require('path');

router.get('/oauth-callback', InstallerController.auth);
router.get('/install', InstallerController.preInstall);
router.get('/tokenHubspot', InstallerController.getToken);
router.post('/tokenRefresh', InstallerController.refreshToken);
router.get('/getUser', InstallerController.getUser);
router.get('/home', async (req, res) => {
  router.use(express.static(__dirname + '/../../src'));
  res.sendFile(path.join(__dirname + '/../../src/index.html'));
});

module.exports = router;
