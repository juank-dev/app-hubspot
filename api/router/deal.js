//  registro del Negocio
const express = require('express');
const { DealController } = require('../controllers');

const router = express.Router();

router.post('/create', DealController.createDeal);
router.post('/create-property-deal', DealController.createPropertyDeal);
router.put('/update', DealController.update);
router.get('/get/:portal_id/idDeal/:idDeal', DealController.getDeal);
router.post('/createGroupProperty', DealController.createGroupPropertyCustom);

module.exports = router;
