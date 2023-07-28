const express = require('express');
const { PipelineController } = require('../controllers');

const router = express.Router();

router.post('/create', PipelineController.createPipeline);
router.post('/get', PipelineController.getPipeline);
module.exports = router;
