const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    googleId: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: ''
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    // Vendor-specific fields
    businessName: {
        type: String,
        trim: true,
        maxlength: 100
    },
    vendorStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    vendorDetails: {
        city: { type: String, trim: true },
        address: { type: String, trim: true },
        venueType: { type: String, enum: ['banquet', 'lawn', 'resort', 'hotel', 'farmhouse', 'community-hall', 'marriage-garden', ''] },
        description: { type: String, maxlength: 500 },
        estimatedCapacity: { type: Number },
        experience: { type: String, maxlength: 200 }
    },
    rejectionReason: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
