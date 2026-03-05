const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, getMyBookings, getBooking, updateBookingStatus, cancelBooking, getDashboardStats } = require('../controllers/bookingController');
const { protect, staffOrAdmin } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard-stats', staffOrAdmin, getDashboardStats);
router.get('/my', getMyBookings);
router.get('/', staffOrAdmin, getAllBookings);
router.post('/', createBooking);
router.get('/:id', getBooking);
router.put('/:id/status', staffOrAdmin, updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;