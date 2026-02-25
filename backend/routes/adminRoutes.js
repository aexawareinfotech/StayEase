const express = require('express');
const { getDashboardStats, getAllBookings, updateBookingStatus, getOccupancyReport, getRevenueReport } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/reports/occupancy', getOccupancyReport);
router.get('/reports/revenue', getRevenueReport);

module.exports = router;
