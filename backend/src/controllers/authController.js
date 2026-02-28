const User = require('../models/User');
const { sendTokenResponse } = require('../utils/tokenHelper');
const { sendOtpEmail } = require('../utils/emailService');

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        // Check if email already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store with 5 min expiry
        otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

        // Send email
        await sendOtpEmail(email, otp);

        res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

        const stored = otpStore.get(email);
        if (!stored) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new one.' });
        }

        if (Date.now() > stored.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (stored.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // OTP verified — remove from store
        otpStore.delete(email);

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, mobile, password, role, businessName, vendorDetails } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const userData = { name, email, mobile, password, role: role || 'user' };

        // Add vendor-specific fields
        if (role === 'vendor') {
            userData.businessName = businessName;
            userData.vendorDetails = vendorDetails || {};
            userData.vendorStatus = 'pending';
        }

        const user = await User.create(userData);
        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, mobile, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, mobile, avatar },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle venue in wishlist (like/unlike)
// @route   PUT /api/auth/wishlist/:venueId
exports.toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const venueId = req.params.venueId;
        const index = user.wishlist.indexOf(venueId);

        if (index > -1) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(venueId);
        }

        await user.save({ validateBeforeSave: false });

        const updatedUser = await User.findById(req.user._id).populate('wishlist');

        res.status(200).json({
            success: true,
            isLiked: index === -1,
            wishlist: updatedUser.wishlist,
            message: index > -1 ? 'Removed from wishlist' : 'Added to wishlist'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            populate: { path: 'owner', select: 'name' }
        });
        res.status(200).json({ success: true, venues: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
