const express = require('express');
const { createBooking, getMyBookings, cancelBooking, modifyBooking, payBooking } = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All routes require auth

router.route('/')
    .post(createBooking);

router.get('/my', getMyBookings);

router.route('/:id/cancel')
    .put(cancelBooking);

router.route('/:id/modify')
    .put(modifyBooking);

router.route('/:id/pay')
    .put(payBooking);

module.exports = router;
