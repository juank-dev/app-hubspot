const express = require('express');
const { ContactController } = require('../controllers');
const router = express.Router();

router.post('/get-contact-email', ContactController.getContactByEmail);
router.post('/get-contact-vid', ContactController.getContactById);
router.post('/get-contact-email-triario', ContactController.getContactByEmailTriario);
router.post('/search-contact', ContactController.searchContact);
router.post('/update-contact', ContactController.updateContact);
router.post('/update-contact-triario', ContactController.updateContactTriario);
router.post('/create-contact', ContactController.createContact);
router.post('/create-property-contact', ContactController.createPropertyContact);

module.exports = router;
