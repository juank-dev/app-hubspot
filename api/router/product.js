const express = require('express');
const { ProductController } = require('../controllers');
const router = express.Router();

router.post('/create-property-product', ProductController.createPropertyProduct);
router.post('/search-product', ProductController.searchProduct);
router.get('/properties/:portal_id', ProductController.getPropertiesProduct);
router.put('/update', ProductController.update);
router.get('/get-products-cotizador-triario', ProductController.getProductCotizadorTriario);
router.post('/createGroupProperty', ProductController.createGroupPropertyCustom);

module.exports = router;
