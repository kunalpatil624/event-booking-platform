import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff, HiArrowLeft, HiShieldCheck } from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Login() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });

    // OTP state
    const [otpStep, setOtpStep] = useState(false); // true = show OTP input
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    // Start resend timer
    const startTimer = () => {
        setOtpTimer(60);
        const interval = setInterval(() => {
            setOtpTimer(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOtp = async () => {
        if (!formData.email) { toast.error('Please enter your email'); return; }
        if (!formData.name) { toast.error('Please enter your name'); return; }
        if (!formData.password || formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

        setOtpSending(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/send-otp`, { email: formData.email });
            if (data.success) {
                toast.success('OTP sent to your email!');
                setOtpStep(true);
                startTimer();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setOtpSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }

        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/verify-otp`, { email: formData.email, otp: otpValue });
            if (data.success) {
                setOtpVerified(true);
                toast.success('Email verified!');
                // Now auto-register
                const regData = await register(formData);
                if (regData && regData.success) {
                    toast.success('Account created successfully!');
                    setTimeout(() => navigate('/'), 500);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (otpTimer > 0) return;
        setOtpSending(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/send-otp`, { email: formData.email });
            if (data.success) {
                toast.success('OTP resent!');
                setOtp(['', '', '', '', '', '']);
                startTimer();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setOtpSending(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value[value.length - 1];
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            document.getElementById('otp-5')?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin) {
            // For registration, trigger OTP flow
            handleSendOtp();
            return;
        }
        setLoading(true);
        try {
            const data = await login({ email: formData.email, password: formData.password });
            if (data && data.success) {
                toast.success('Login successful!');
                setTimeout(() => navigate('/'), 500);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-10 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(108,60,225,0.2)_0%,transparent_70%)] -top-[150px] -left-[150px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,107,107,0.1)_0%,transparent_70%)] -bottom-[100px] -right-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <Link to="/" className="fixed top-6 left-6 flex items-center gap-1.5 text-text-secondary text-sm font-medium z-10 hover:text-white transition-all duration-300">
                <HiArrowLeft /> Back to Home
            </Link>

            <motion.div className="grid grid-cols-2 max-md:grid-cols-1 w-full max-w-[960px] bg-bg-card border border-border-default rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-[2]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="p-12 px-10 bg-gradient-to-br from-primary to-primary-light flex flex-col justify-center max-md:hidden">
                    <div className="mb-10">
                        <h1 className="text-[2rem] font-extrabold text-white mb-2">Event<span className="opacity-85">Book</span></h1>
                        <p className="text-white/75 text-[0.95rem]">Find & Book Perfect Event Venues</p>
                    </div>
                    <div className="flex flex-col gap-5">
                        {[
                            { emoji: '🏰', title: '500+ Premium Venues', desc: 'Curated selection across MP' },
                            { emoji: '💰', title: 'Best Price Guarantee', desc: 'Transparent pricing, no hidden charges' },
                            { emoji: '📅', title: 'Instant Booking', desc: 'Real-time availability & confirmation' },
                            { emoji: '⭐', title: 'Verified Reviews', desc: '10,000+ genuine customer reviews' },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3.5">
                                <span className="text-2xl w-12 h-12 flex items-center justify-center bg-white/15 rounded-[14px] shrink-0">{f.emoji}</span>
                                <div><h4 className="text-sm font-semibold text-white mb-0.5">{f.title}</h4><p className="text-xs text-white/65">{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-12 px-10 max-md:p-9 max-md:px-6 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {otpStep && !isLogin ? (
                            /* ─── OTP VERIFICATION SCREEN ─── */
                            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="mb-6">
                                    <button onClick={() => { setOtpStep(false); setOtp(['', '', '', '', '', '']); }} className="flex items-center gap-1 text-text-muted text-sm mb-4 bg-transparent border-none cursor-pointer hover:text-white transition-colors">
                                        <HiArrowLeft /> Back
                                    </button>
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/15 flex items-center justify-center">
                                        <HiShieldCheck className="text-primary-light text-3xl" />
                                    </div>
                                    <h2 className="font-display text-[1.75rem] font-bold text-white mb-1.5 text-center">Verify Email</h2>
                                    <p className="text-text-secondary text-sm text-center">We've sent a 6-digit code to <strong className="text-white">{formData.email}</strong></p>
                                </div>

                                <div className="flex justify-center gap-2.5 mb-6" onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className="w-12 h-14 text-center text-xl font-bold text-white bg-bg-secondary border border-border-default rounded-xl outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(108,60,225,0.15)] transition-all"
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.join('').length !== 6}
                                    className="w-full mb-4 inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white shadow-[0_4px_15px_rgba(108,60,225,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(108,60,225,0.5)] transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Create Account'}
                                </button>

                                <p className="text-center text-text-muted text-sm">
                                    Didn't receive the code?{' '}
                                    {otpTimer > 0 ? (
                                        <span className="text-text-secondary">Resend in {otpTimer}s</span>
                                    ) : (
                                        <button onClick={handleResendOtp} disabled={otpSending} className="bg-transparent border-none text-primary-light font-semibold cursor-pointer text-sm">
                                            {otpSending ? 'Sending...' : 'Resend OTP'}
                                        </button>
                                    )}
                                </p>
                            </motion.div>
                        ) : (
                            /* ─── LOGIN / REGISTER FORM ─── */
                            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className="mb-6">
                                    <h2 className="font-display text-[1.75rem] font-bold text-white mb-1.5">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                                    <p className="text-text-secondary text-sm">{isLogin ? 'Login to your account to manage bookings' : 'Join EventBook to start booking venues'}</p>
                                </div>
                                <div className="flex bg-bg-secondary rounded-xl p-1 mb-6">
                                    <button className={`flex-1 py-2.5 border-none rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-gradient-to-r from-primary to-primary-light text-white' : 'bg-transparent text-text-muted'}`} onClick={() => { setIsLogin(true); setOtpStep(false); }}>Login</button>
                                    <button className={`flex-1 py-2.5 border-none rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-gradient-to-r from-primary to-primary-light text-white' : 'bg-transparent text-text-muted'}`} onClick={() => { setIsLogin(false); setOtpStep(false); }}>Sign Up</button>
                                </div>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mb-5">
                                    {!isLogin && (
                                        <div className="flex items-center px-3.5 bg-bg-secondary border border-border-default rounded-xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.15)]">
                                            <HiUser className="text-text-muted text-lg shrink-0" />
                                            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="flex-1 py-3.5 px-3 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted" />
                                        </div>
                                    )}
                                    <div className="flex items-center px-3.5 bg-bg-secondary border border-border-default rounded-xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.15)]">
                                        <HiMail className="text-text-muted text-lg shrink-0" />
                                        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="flex-1 py-3.5 px-3 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted" />
                                    </div>
                                    {!isLogin && (
                                        <div className="flex items-center px-3.5 bg-bg-secondary border border-border-default rounded-xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.15)]">
                                            <HiPhone className="text-text-muted text-lg shrink-0" />
                                            <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="flex-1 py-3.5 px-3 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted" />
                                        </div>
                                    )}
                                    <div className="flex items-center px-3.5 bg-bg-secondary border border-border-default rounded-xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.15)]">
                                        <HiLockClosed className="text-text-muted text-lg shrink-0" />
                                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="flex-1 py-3.5 px-3 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted" />
                                        <button type="button" className="bg-transparent border-none text-text-muted text-lg p-1 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiEyeOff /> : <HiEye />}</button>
                                    </div>
                                    {isLogin && (
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-1.5 text-text-secondary text-[0.825rem] cursor-pointer"><input type="checkbox" className="accent-primary" /> Remember me</label>
                                            <Link to="/forgot-password" className="text-[0.825rem] text-primary-light font-medium">Forgot password?</Link>
                                        </div>
                                    )}
                                    <button type="submit" className="w-full mt-1 inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white shadow-[0_4px_15px_rgba(108,60,225,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(108,60,225,0.5)] transition-all duration-300 disabled:opacity-50" disabled={loading || otpSending}>
                                        {loading ? 'Please wait...' : otpSending ? 'Sending OTP...' : (isLogin ? 'Login' : 'Verify & Sign Up')}
                                    </button>
                                    <div className="flex items-center gap-3 text-text-muted text-xs"><div className="flex-1 h-px bg-border-default" /><span>or continue with</span><div className="flex-1 h-px bg-border-default" /></div>
                                    <button type="button" className="flex items-center justify-center gap-2.5 w-full py-3 bg-white/5 border border-border-default rounded-xl text-text-primary text-sm font-medium hover:bg-white/10 hover:border-border-light transition-all duration-300" onClick={() => { window.location.href = `${API_URL}/auth/google`; }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                        Continue with Google
                                    </button>
                                </form>
                                <p className="text-center text-text-secondary text-sm">
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <button className="bg-none border-none text-primary-light font-semibold cursor-pointer text-sm" onClick={() => { setIsLogin(!isLogin); setOtpStep(false); }}>{isLogin ? 'Sign Up' : 'Login'}</button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
