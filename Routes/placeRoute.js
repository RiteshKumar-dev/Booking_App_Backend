const express = require('express');
const router = express.Router();
const placeController = require('../Controllers/placeController');
const authMiddleware = require('../MiddleWares/authMiddleware');

router.route('/places').post(authMiddleware, placeController.createPlace);
router.route('/user-places').get(authMiddleware, placeController.getUserPlaces);
router.route('/user-places/:id').delete(placeController.deletePlace);
router.route('/places/:id').get(placeController.getPlaceById).put(authMiddleware, placeController.updatePlace);
router.route('/places').get(placeController.getAllPlaces);

module.exports = router;
