'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiShieldCheck, HiArrowLeft } from 'react-icons/hi';

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.email === 'admin@eventbook.com' && formData.password === 'admin123') {
            localStorage.setItem('adminToken', 'demo-admin-token');
            localStorage.setItem('adminUser', JSON.stringify({ name: 'Admin', email: formData.email, role: 'admin' }));
            router.push('/admin/dashboard');
        } else {
            setError('Invalid admin credentials');
        }
        setLoading(false);
    };

    const inputCls = "flex items-center px-3.5 bg-bg-secondary border border-border-default rounded-xl transition-all duration-300 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]";
    const inputInner = "flex-1 py-3.5 px-3 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted";

    return (
        <div className="min-h-screen flex items-center justify-center p-10 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.2)_0%,transparent_70%)] -top-[150px] -left-[150px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(108,60,225,0.15)_0%,transparent_70%)] -bottom-[100px] -right-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <Link href="/" className="fixed top-6 left-6 flex items-center gap-1.5 text-text-secondary text-sm font-medium z-10 hover:text-white transition-all duration-300">
                <HiArrowLeft /> Back to Home
            </Link>

            <motion.div
                className="w-full max-w-[460px] bg-bg-card border border-border-default rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-[2] p-10 max-md:p-8 max-md:px-6"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-red-500/15 text-red-500 text-3xl mx-auto mb-5">
                    <HiShieldCheck />
                </div>

                <h1 className="font-display text-[1.75rem] font-bold text-white text-center mb-1.5">Admin Panel</h1>
                <p className="text-text-secondary text-sm text-center mb-6">Sign in to access the admin dashboard</p>

                {error && (
                    <motion.div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mb-5">
                    <div className={inputCls}>
                        <HiMail className="text-text-muted text-lg shrink-0" />
                        <input type="email" placeholder="Admin Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputInner} />
                    </div>

                    <div className={inputCls}>
                        <HiLockClosed className="text-text-muted text-lg shrink-0" />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className={inputInner} />
                        <button type="button" className="bg-transparent border-none text-text-muted text-lg p-1 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <HiEyeOff /> : <HiEye />}
                        </button>
                    </div>

                    <button type="submit" className="w-full mt-1 inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_15px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(239,68,68,0.5)] transition-all duration-300 disabled:opacity-50" disabled={loading}>
                        {loading ? 'Please wait...' : (<><HiShieldCheck /> Sign In as Admin</>)}
                    </button>
                </form>

                <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl p-4 mb-5 text-sm">
                    <p className="text-red-400 font-semibold mb-1">Demo Credentials:</p>
                    <p className="text-text-secondary">Email: <strong className="text-white">admin@eventbook.com</strong></p>
                    <p className="text-text-secondary">Password: <strong className="text-white">admin123</strong></p>
                </div>

                <div className="flex justify-center gap-6 text-sm">
                    <Link href="/vendor" className="text-text-secondary hover:text-white transition-all duration-300">Login as Venue Owner →</Link>
                    <Link href="/login" className="text-text-secondary hover:text-white transition-all duration-300">Login as User →</Link>
                </div>
            </motion.div>
        </div>
    );
}
