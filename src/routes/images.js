const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/imagesController')

router.route('/images')
  .get(imagesController.getAllImageMetaData)
  .post(imagesController.analyzeNewImage);

router.route('/images/by')
  .get(imagesController.getImagesBySpecifiedObjects);

router.route('/images/:id')
  .get(imagesController.getImageById);

module.exports = router;
