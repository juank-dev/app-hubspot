const express = require('express');
const { AssociationsController } = require('../controllers');

const router = express.Router();

router.put('/update', AssociationsController.createAssociations);
router.post('/getAssociation', AssociationsController.getAssociations);

module.exports = router;
