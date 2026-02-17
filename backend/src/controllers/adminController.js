const User = require('../models/User');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalVendors = await User.countDocuments({ role: 'vendor' });
        const totalVenues = await Venue.countDocuments();
        const pendingVenues = await Venue.countDocuments({ isApproved: false });
        const totalBookings = await Booking.countDocuments();
        const revenue = await Booking.aggregate([
            { $match: { status: 'completed' } }, // Only completed bookings count towards revenue
            { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                users: totalUsers,
                vendors: totalVendors,
                venues: totalVenues,
                pendingVenues,
                bookings: totalBookings,
                revenue: revenue[0]?.total || 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get All Venues (Admin)
// @route   GET /api/admin/venues
exports.getAllVenues = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        if (status === 'pending') query.isApproved = false;
        if (status === 'approved') query.isApproved = true;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        const venues = await Venue.find(query)
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: venues.length, venues });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Approve/Reject Venue
// @route   PUT /api/admin/venues/:id/status
exports.updateVenueStatus = async (req, res) => {
    try {
        const { isApproved, rejectionReason } = req.body;

        const venue = await Venue.findByIdAndUpdate(
            req.params.id,
            { isApproved, rejectionReason: isApproved ? '' : rejectionReason },
            { new: true }
        );

        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        // Logic to notify vendor could be added here

        res.status(200).json({ success: true, venue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle Venue Active Status (Stop/Resume)
// @route   PUT /api/admin/venues/:id/toggle-active
exports.toggleVenueActive = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        venue.isActive = !venue.isActive;
        await venue.save();

        res.status(200).json({
            success: true,
            venue,
            message: venue.isActive ? 'Venue activated successfully' : 'Venue stopped successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle Venue Featured Status
// @route   PUT /api/admin/venues/:id/toggle-featured
exports.toggleFeatured = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        venue.featured = !venue.featured;
        await venue.save();

        res.status(200).json({
            success: true,
            venue,
            message: venue.featured ? 'Venue marked as featured' : 'Venue removed from featured'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Single Venue Details (Admin)
// @route   GET /api/admin/venues/:id
exports.getVenueDetail = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id)
            .populate('owner', 'name email mobile');

        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        res.status(200).json({ success: true, venue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get All Users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
