import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiOfficeBuilding, HiArrowLeft, HiUser, HiPhone } from 'react-icons/hi';

export default function VendorLogin() {
    const navigate = useNavigate();
    const { login, register, logout } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { ...formData, role: 'vendor' };

            const data = isLogin ? await login(payload) : await register(payload);

            if (data && data.success) {
                if (data.user.role !== 'vendor' && data.user.role !== 'admin') {
                    setError('Access denied. This account is not authorized as a vendor.');
                    await logout();
                    setLoading(false);
                    return;
                }
                navigate('/vendor/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "flex items-center px-3.5 bg-bg-secondary border border-border-default rounded-xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.15)]";
    const inputInner = "flex-1 py-3.5 px-3 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted";

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
                    <div className="mb-6">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-accent-emerald/15 text-accent-emerald text-2xl mb-4"><HiOfficeBuilding /></div>
                        <h2 className="font-display text-[1.75rem] font-bold text-white mb-1.5">{isLogin ? 'Venue Owner Login' : 'Register Your Venue'}</h2>
                        <p className="text-text-secondary text-sm">{isLogin ? 'Access your venue management dashboard' : 'Join EventBook and start getting bookings'}</p>
                    </div>
                    <div className="flex bg-bg-secondary rounded-xl p-1 mb-6">
                        <button className={`flex-1 py-2.5 border-none rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-gradient-to-r from-accent-emerald to-teal-500 text-white' : 'bg-transparent text-text-muted'}`} onClick={() => { setIsLogin(true); setError(''); }}>Login</button>
                        <button className={`flex-1 py-2.5 border-none rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-gradient-to-r from-accent-emerald to-teal-500 text-white' : 'bg-transparent text-text-muted'}`} onClick={() => { setIsLogin(false); setError(''); }}>Register</button>
                    </div>
                    {error && (<motion.div className="p-3 mb-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>)}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mb-5">
                        {!isLogin && (<>
                            <div className={inputCls}><HiUser className="text-text-muted text-lg shrink-0" /><input type="text" placeholder="Full Name / Business Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputInner} /></div>
                            <div className={inputCls}><HiPhone className="text-text-muted text-lg shrink-0" /><input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required className={inputInner} /></div>
                        </>)}
                        <div className={inputCls}><HiMail className="text-text-muted text-lg shrink-0" /><input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputInner} /></div>
                        <div className={inputCls}>
                            <HiLockClosed className="text-text-muted text-lg shrink-0" />
                            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className={inputInner} />
                            <button type="button" className="bg-transparent border-none text-text-muted text-lg p-1 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiEyeOff /> : <HiEye />}</button>
                        </div>
                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-1.5 text-text-secondary text-[0.825rem] cursor-pointer"><input type="checkbox" className="accent-accent-emerald" /> Remember me</label>
                                <Link to="/forgot-password" className="text-[0.825rem] text-accent-emerald font-medium">Forgot password?</Link>
                            </div>
                        )}
                        <button type="submit" className="w-full mt-1 inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-50" disabled={loading}>
                            {loading ? 'Please wait...' : (<><HiOfficeBuilding /> {isLogin ? 'Sign In' : 'Register as Venue Owner'}</>)}
                        </button>
                    </form>
                    <div className="bg-accent-emerald/[0.08] border border-accent-emerald/20 rounded-xl p-4 mb-4 text-sm">
                        <p className="text-accent-emerald font-semibold mb-1">Demo Credentials:</p>
                        <p className="text-text-secondary">Email: <strong className="text-white">vendor@eventbook.com</strong></p>
                        <p className="text-text-secondary">Password: <strong className="text-white">vendor123</strong></p>
                    </div>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link to="/admin" className="text-text-secondary hover:text-white transition-all duration-300">Admin Login →</Link>
                        <Link to="/login" className="text-text-secondary hover:text-white transition-all duration-300">Customer Login →</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
