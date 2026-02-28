import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiOfficeBuilding, HiArrowLeft, HiUser, HiPhone, HiLocationMarker, HiDocumentText, HiUsers, HiCheck, HiArrowRight, HiClock, HiShieldCheck } from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const venueTypes = [
    { value: 'banquet', label: 'Banquet Hall' },
    { value: 'lawn', label: 'Lawn / Garden' },
    { value: 'resort', label: 'Resort' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'farmhouse', label: 'Farmhouse' },
    { value: 'community-hall', label: 'Community Hall' },
    { value: 'marriage-garden', label: 'Marriage Garden' },
];

export default function VendorLogin() {
    const navigate = useNavigate();
    const { login, register, logout, user } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Personal, 2: Business, 3: Success

    // OTP state
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSending, setOtpSending] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', password: '',
        businessName: '',
        vendorDetails: {
            city: '', address: '', venueType: '', description: '', estimatedCapacity: '', experience: ''
        }
    });

    // OTP helpers
    const startTimer = () => {
        setOtpTimer(60);
        const interval = setInterval(() => {
            setOtpTimer(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
        }, 1000);
    };

    const handleSendOtp = async () => {
        setOtpSending(true);
        setError('');
        try {
            const { data } = await axios.post(`${API_URL}/auth/send-otp`, { email: formData.email });
            if (data.success) {
                toast.success('OTP sent to your email!');
                setOtpStep(true);
                startTimer();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setOtpSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) { setError('Please enter the 6-digit OTP'); return; }
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${API_URL}/auth/verify-otp`, { email: formData.email, otp: otpValue });
            if (data.success) {
                toast.success('Email verified!');
                setOtpStep(false);
                setStep(2); // Move to business details
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (otpTimer > 0) return;
        setOtpSending(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/send-otp`, { email: formData.email });
            if (data.success) { toast.success('OTP resent!'); setOtp(['', '', '', '', '', '']); startTimer(); }
        } catch (err) { setError(err.response?.data?.message || 'Failed to resend OTP'); }
        finally { setOtpSending(false); }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value[value.length - 1];
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) document.getElementById(`votp-${index + 1}`)?.focus();
    };
    const handleOtpKeyDown = (index, e) => { if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById(`votp-${index - 1}`)?.focus(); };
    const handleOtpPaste = (e) => { e.preventDefault(); const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6); if (p.length === 6) { setOtp(p.split('')); document.getElementById('votp-5')?.focus(); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin && step === 1) {
            // Validate step 1
            if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
                setError('Please fill all required fields');
                return;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            setError('');
            // Send OTP instead of going to step 2
            handleSendOtp();
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const data = await login({ email: formData.email, password: formData.password });
                if (data && data.success) {
                    if (data.user.role !== 'vendor' && data.user.role !== 'admin') {
                        setError('Access denied. This account is not a vendor account.');
                        await logout(true);
                        setLoading(false);
                        return;
                    }
                    if (data.user.vendorStatus === 'pending') {
                        setStep(3); // Show pending screen
                        setLoading(false);
                        return;
                    }
                    if (data.user.vendorStatus === 'rejected') {
                        setError('Your vendor application was rejected. Please contact support.');
                        await logout(true);
                        setLoading(false);
                        return;
                    }
                    navigate('/vendor/dashboard');
                }
            } else {
                // Step 2 validation
                if (!formData.businessName) {
                    setError('Business name is required');
                    setLoading(false);
                    return;
                }
                if (!formData.vendorDetails.city) {
                    setError('City is required');
                    setLoading(false);
                    return;
                }
                if (!formData.vendorDetails.venueType) {
                    setError('Please select venue type');
                    setLoading(false);
                    return;
                }

                const data = await register({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    password: formData.password,
                    role: 'vendor',
                    businessName: formData.businessName,
                    vendorDetails: {
                        ...formData.vendorDetails,
                        estimatedCapacity: Number(formData.vendorDetails.estimatedCapacity) || undefined
                    }
                });

                if (data && data.success) {
                    setStep(3); // Show success/pending screen
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateVendorDetails = (field, value) => {
        setFormData(prev => ({
            ...prev,
            vendorDetails: { ...prev.vendorDetails, [field]: value }
        }));
    };

    const inputCls = "flex items-center px-3.5 bg-bg-secondary border border-border-default rounded-xl transition-all duration-300 focus-within:border-accent-emerald focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]";
    const inputInner = "flex-1 py-3.5 px-3 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted";
    const labelCls = "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide";

    // Pending approval screen
    if (step === 3) {
        return (
            <div className="min-h-screen flex items-center justify-center p-10 px-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_70%)] -top-[150px] -left-[150px] animate-[float_8s_ease-in-out_infinite]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>
                <motion.div className="w-full max-w-lg bg-bg-card border border-border-default rounded-3xl p-10 text-center relative z-[2] shadow-[0_8px_32px_rgba(0,0,0,0.5)]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-gold/15 flex items-center justify-center">
                        <HiClock className="text-accent-gold text-4xl" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white mb-3">Application Under Review</h2>
                    <p className="text-text-secondary text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                        Thank you for registering! Your venue owner application is being reviewed by our team. You'll receive an email once approved.
                    </p>
                    <div className="bg-white/[0.03] border border-border-default rounded-xl p-5 mb-6 text-left space-y-2.5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-emerald/15 flex items-center justify-center shrink-0"><HiCheck className="text-accent-emerald" /></div>
                            <span className="text-text-secondary text-sm">Account created successfully</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-gold/15 flex items-center justify-center shrink-0"><HiClock className="text-accent-gold text-sm" /></div>
                            <span className="text-text-secondary text-sm">Admin verification in progress</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 text-text-muted text-xs">3</div>
                            <span className="text-text-muted text-sm">Dashboard access after approval</span>
                        </div>
                    </div>
                    <p className="text-text-muted text-xs mb-6">Typically takes 24-48 hours</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all duration-300">
                        <HiArrowLeft /> Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-10 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_70%)] -top-[150px] -left-[150px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(108,60,225,0.15)_0%,transparent_70%)] -bottom-[100px] -right-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>
            <Link to="/" className="fixed top-6 left-6 flex items-center gap-1.5 text-text-secondary text-sm font-medium z-10 hover:text-white transition-all duration-300"><HiArrowLeft /> Back to Home</Link>
            <motion.div className="grid grid-cols-2 max-md:grid-cols-1 w-full max-w-[960px] bg-bg-card border border-border-default rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-[2]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="p-12 px-10 bg-gradient-to-br from-accent-emerald to-teal-500 flex flex-col justify-center max-md:hidden">
                    <div className="mb-10"><h1 className="text-[2rem] font-extrabold text-white mb-2">Event<span className="opacity-85">Book</span></h1><p className="text-white/75 text-[0.95rem]">Venue Owner Portal</p></div>
                    <h3 className="text-white font-semibold mb-5">Why list your venue?</h3>
                    <div className="flex flex-col gap-5">
                        {[
                            { emoji: '📈', title: 'Increase Bookings', desc: 'Get discovered by 50,000+ monthly visitors looking for venues' },
                            { emoji: '💰', title: 'Zero Listing Fee', desc: 'List your venue for free. Pay only a small commission on bookings' },
                            { emoji: '📊', title: 'Dashboard & Analytics', desc: 'Track bookings, revenue, reviews, and manage your venue easily' },
                            { emoji: '🛡️', title: 'Secure Payments', desc: 'Payments processed securely and transferred directly to your account' },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3.5">
                                <span className="text-2xl w-12 h-12 flex items-center justify-center bg-white/15 rounded-[14px] shrink-0">{f.emoji}</span>
                                <div><h4 className="text-sm font-semibold text-white mb-0.5">{f.title}</h4><p className="text-xs text-white/65">{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-12 px-10 max-md:p-9 max-md:px-6 flex flex-col justify-center">
                    <div className="mb-5">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-accent-emerald/15 text-accent-emerald text-2xl mb-4"><HiOfficeBuilding /></div>
                        <h2 className="font-display text-[1.75rem] font-bold text-white mb-1.5">
                            {isLogin ? 'Venue Owner Login' : otpStep ? 'Verify Email' : (step === 1 ? 'Register — Step 1 of 2' : 'Register — Step 2 of 2')}
                        </h2>
                        <p className="text-text-secondary text-sm">
                            {isLogin ? 'Access your venue management dashboard' : otpStep ? `We've sent a 6-digit code to ${formData.email}` : (step === 1 ? 'Your personal details' : 'Your venue & business details')}
                        </p>
                    </div>

                    {/* Login/Register Toggle */}
                    {!otpStep && (
                        <div className="flex bg-bg-secondary rounded-xl p-1 mb-5">
                            <button className={`flex-1 py-2.5 border-none rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-gradient-to-r from-accent-emerald to-teal-500 text-white' : 'bg-transparent text-text-muted'}`} onClick={() => { setIsLogin(true); setError(''); setStep(1); setOtpStep(false); }}>Login</button>
                            <button className={`flex-1 py-2.5 border-none rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-gradient-to-r from-accent-emerald to-teal-500 text-white' : 'bg-transparent text-text-muted'}`} onClick={() => { setIsLogin(false); setError(''); setStep(1); setOtpStep(false); }}>Register</button>
                        </div>
                    )}

                    {/* Step Indicator for Registration */}
                    {!isLogin && !otpStep && (
                        <div className="flex items-center gap-2 mb-5">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 1 ? 'bg-accent-emerald/15 text-accent-emerald' : 'bg-white/[0.06] text-text-muted'}`}>
                                {step > 1 ? <HiCheck className="text-accent-emerald" /> : <span>1</span>} Personal
                            </div>
                            <div className="w-6 h-px bg-border-default" />
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 2 ? 'bg-accent-emerald/15 text-accent-emerald' : 'bg-white/[0.06] text-text-muted'}`}>
                                <span>2</span> Business
                            </div>
                        </div>
                    )}
                    {/* OTP Verification Step */}
                    {otpStep ? (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-emerald/15 flex items-center justify-center">
                                <HiShieldCheck className="text-accent-emerald text-3xl" />
                            </div>

                            {error && (<motion.div className="p-3 mb-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>)}

                            <div className="flex justify-center gap-2.5 mb-6" onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input key={i} id={`votp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 text-center text-xl font-bold text-white bg-bg-secondary border border-border-default rounded-xl outline-none focus:border-accent-emerald focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] transition-all"
                                    />
                                ))}
                            </div>

                            <button onClick={handleVerifyOtp} disabled={loading || otp.join('').length !== 6}
                                className="w-full mb-4 inline-flex items-center justify-center gap-2 px-9 py-3.5 text-base font-semibold rounded-2xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50">
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </button>

                            <div className="flex items-center justify-between">
                                <button onClick={() => { setOtpStep(false); setOtp(['', '', '', '', '', '']); setError(''); }} className="text-text-muted text-sm bg-transparent border-none cursor-pointer hover:text-white transition-colors">
                                    <HiArrowLeft className="inline mr-1" /> Back
                                </button>
                                <p className="text-text-muted text-sm">
                                    {otpTimer > 0 ? (
                                        <span className="text-text-secondary">Resend in {otpTimer}s</span>
                                    ) : (
                                        <button onClick={handleResendOtp} disabled={otpSending} className="bg-transparent border-none text-accent-emerald font-semibold cursor-pointer text-sm">
                                            {otpSending ? 'Sending...' : 'Resend OTP'}
                                        </button>
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {error && (<motion.div className="p-3 mb-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>)}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mb-4">
                                <AnimatePresence mode="wait">
                                    {/* LOGIN FORM */}
                                    {isLogin && (
                                        <motion.div key="login" className="flex flex-col gap-3.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                            <div className={inputCls}><HiMail className="text-text-muted text-lg shrink-0" /><input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputInner} /></div>
                                            <div className={inputCls}>
                                                <HiLockClosed className="text-text-muted text-lg shrink-0" />
                                                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className={inputInner} />
                                                <button type="button" className="bg-transparent border-none text-text-muted text-lg p-1 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiEyeOff /> : <HiEye />}</button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* REGISTER STEP 1 — Personal Info */}
                                    {!isLogin && step === 1 && (
                                        <motion.div key="step1" className="flex flex-col gap-3.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                            <div className={inputCls}><HiUser className="text-text-muted text-lg shrink-0" /><input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputInner} /></div>
                                            <div className={inputCls}><HiMail className="text-text-muted text-lg shrink-0" /><input type="email" placeholder="Email Address *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputInner} /></div>
                                            <div className={inputCls}><HiPhone className="text-text-muted text-lg shrink-0" /><input type="tel" placeholder="Mobile Number *" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required className={inputInner} /></div>
                                            <div className={inputCls}>
                                                <HiLockClosed className="text-text-muted text-lg shrink-0" />
                                                <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 chars) *" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} className={inputInner} />
                                                <button type="button" className="bg-transparent border-none text-text-muted text-lg p-1 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiEyeOff /> : <HiEye />}</button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* REGISTER STEP 2 — Business/Venue Details */}
                                    {!isLogin && step === 2 && (
                                        <motion.div key="step2" className="flex flex-col gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                            <div>
                                                <label className={labelCls}>Business / Venue Name *</label>
                                                <div className={inputCls}><HiOfficeBuilding className="text-text-muted text-lg shrink-0" /><input type="text" placeholder="e.g. Royal Gardens Banquet" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} required className={inputInner} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className={labelCls}>City *</label>
                                                    <div className={inputCls}><HiLocationMarker className="text-text-muted text-lg shrink-0" /><input type="text" placeholder="e.g. Bhopal" value={formData.vendorDetails.city} onChange={(e) => updateVendorDetails('city', e.target.value)} required className={inputInner} /></div>
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Venue Type *</label>
                                                    <select value={formData.vendorDetails.venueType} onChange={(e) => updateVendorDetails('venueType', e.target.value)} required className="w-full px-3.5 py-3.5 bg-bg-secondary border border-border-default rounded-xl text-white text-sm outline-none focus:border-accent-emerald transition-all [&>option]:bg-bg-card">
                                                        <option value="">Select type</option>
                                                        {venueTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Full Address</label>
                                                <div className={inputCls}><HiLocationMarker className="text-text-muted text-lg shrink-0" /><input type="text" placeholder="Street address, area, landmark" value={formData.vendorDetails.address} onChange={(e) => updateVendorDetails('address', e.target.value)} className={inputInner} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className={labelCls}>Est. Guest Capacity</label>
                                                    <div className={inputCls}><HiUsers className="text-text-muted text-lg shrink-0" /><input type="number" placeholder="e.g. 500" value={formData.vendorDetails.estimatedCapacity} onChange={(e) => updateVendorDetails('estimatedCapacity', e.target.value)} className={inputInner} /></div>
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Experience</label>
                                                    <div className={inputCls}><HiDocumentText className="text-text-muted text-lg shrink-0" /><input type="text" placeholder="e.g. 5 years" value={formData.vendorDetails.experience} onChange={(e) => updateVendorDetails('experience', e.target.value)} className={inputInner} /></div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Brief Description</label>
                                                <textarea placeholder="Tell us about your venue (facilities, specialities, etc.)" value={formData.vendorDetails.description} onChange={(e) => updateVendorDetails('description', e.target.value)} rows={3} maxLength={500} className="w-full px-3.5 py-3 bg-bg-secondary border border-border-default rounded-xl text-white text-sm outline-none placeholder:text-text-muted focus:border-accent-emerald transition-all resize-none" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-1">
                                    {!isLogin && step === 2 && (
                                        <button type="button" onClick={() => { setStep(1); setError(''); }} className="px-5 py-3.5 bg-white/[0.06] border border-border-default rounded-2xl text-text-secondary text-sm font-semibold hover:text-white transition-all duration-300">
                                            <HiArrowLeft className="inline mr-1" /> Back
                                        </button>
                                    )}
                                    <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-9 py-3.5 text-base font-semibold rounded-2xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-50" disabled={loading || otpSending}>
                                        {loading ? 'Please wait...' : otpSending ? 'Sending OTP...' : (
                                            isLogin ? <><HiOfficeBuilding /> Sign In</> :
                                                step === 1 ? <>Verify Email & Continue <HiArrowRight /></> :
                                                    <><HiCheck /> Submit Application</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>)}

                    <div className="flex justify-center text-sm mt-4">
                        <Link to="/login" className="text-text-secondary hover:text-white transition-all duration-300">← Back to Customer Login</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
