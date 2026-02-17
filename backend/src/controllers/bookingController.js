const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const Availability = require('../models/Availability');

// @desc    Create booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const { venueId, eventType, eventDate, eventTime, guestCount, packageSelected, addOns, specialNotes } = req.body;

        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        // Check availability
        const existingAvailability = await Availability.findOne({
            venue: venueId,
            date: new Date(eventDate),
            $or: [{ isAvailable: false }, { isLocked: true, lockedBy: { $ne: req.user._id } }]
        });

        if (existingAvailability) {
            return res.status(400).json({ success: false, message: 'Venue is not available on this date' });
        }

        // Calculate pricing
        const basePrice = packageSelected?.price || venue.startingPrice;
        const addOnsTotal = addOns ? addOns.reduce((sum, a) => sum + (a.price || 0), 0) : 0;
        const tax = Math.round((basePrice + addOnsTotal) * 0.18);
        const totalAmount = basePrice + addOnsTotal + tax;
        const advanceAmount = Math.round(totalAmount * 0.20);
        const remainingAmount = totalAmount - advanceAmount;

        const booking = await Booking.create({
            bookingId: 'EVB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
            user: req.user._id,
            venue: venueId,
            eventType,
            eventDate: new Date(eventDate),
            eventTime,
            guestCount,
            packageSelected,
            addOns,
            specialNotes,
            pricing: { basePrice, addOnsTotal, tax, totalAmount, advanceAmount, remainingAmount },
            venueContact: {
                name: venue.owner ? 'Venue Manager' : '',
                phone: ''
            }
        });

        // Lock the date
        await Availability.findOneAndUpdate(
            { venue: venueId, date: new Date(eventDate) },
            {
                isAvailable: false,
                isLocked: true,
                lockedBy: req.user._id,
                lockedAt: new Date(),
                booking: booking._id
            },
            { upsert: true, new: true }
        );

        const populatedBooking = await Booking.findById(booking._id)
            .populate('venue', 'name city area images address')
            .populate('user', 'name email mobile');

        res.status(201).json({ success: true, booking: populatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { user: req.user._id };
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate('venue', 'name city area images startingPrice')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: bookings.length, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('venue', 'name city area images address amenities owner')
            .populate('user', 'name email mobile');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'vendor') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('venue', 'name city area');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // If cancelled, release the date
        if (status === 'cancelled') {
            await Availability.findOneAndUpdate(
                { booking: booking._id },
                { isAvailable: true, isLocked: false, lockedBy: null, booking: null }
            );
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Check venue availability
// @route   GET /api/bookings/check-availability
exports.checkAvailability = async (req, res) => {
    try {
        const { venueId, date } = req.query;
        const availability = await Availability.findOne({
            venue: venueId,
            date: new Date(date)
        });

        const isAvailable = !availability || (availability.isAvailable && !availability.isLocked);

        res.status(200).json({ success: true, isAvailable, date });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get vendor bookings
// @route   GET /api/bookings/vendor
exports.getVendorBookings = async (req, res) => {
    try {
        const venues = await Venue.find({ owner: req.user._id }).select('_id');
        const venueIds = venues.map(v => v._id);

        const bookings = await Booking.find({ venue: { $in: venueIds } })
            .populate('venue', 'name city area')
            .populate('user', 'name email mobile')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: bookings.length, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
