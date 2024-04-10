const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const { authMiddleware } = require('../MiddleWares/authMiddleware');

router.route('/bookings').post(authMiddleware, bookingController.createBooking).get(authMiddleware, bookingController.getUserBookings);
router.route('/bookings/:id').delete(bookingController.deleteBooking);

module.exports = router;
