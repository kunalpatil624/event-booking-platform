const express = require('express');
const router = express.Router();
const {
    createBooking, getMyBookings, getBooking, updateBookingStatus,
    checkAvailability, getVendorBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/check-availability', checkAvailability);
router.get('/my', protect, getMyBookings);
router.get('/vendor', protect, authorize('vendor'), getVendorBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateBookingStatus);

module.exports = router;
