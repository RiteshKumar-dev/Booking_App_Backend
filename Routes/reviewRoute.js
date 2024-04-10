const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.route('/reviews').post(authMiddleware, reviewController.createReview);
router.route('/reviews/place/:placeId').get(reviewController.getReviewsByPlace);
router.route('/reviews/:id').delete(authMiddleware, reviewController.deleteReview);

module.exports = router;
