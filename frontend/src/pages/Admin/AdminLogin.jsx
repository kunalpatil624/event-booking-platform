import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiLockClosed, HiMail } from 'react-icons/hi';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login({ email, password });

            if (data && data.success) {
                if (data.user.role === 'admin') {
                    toast.success(`Welcome back, Admin!`);
                    navigate('/admin/dashboard');
                } else {
                    toast.error('Unauthorized. This portal is for Admins only.');
                    await logout();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-bg-card border border-border-default rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Admin Portal</h1>
                    <p className="text-text-muted">Sign in to manage the platform</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary">Email Address</label>
                        <div className="relative">
                            <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-border-default rounded-xl text-white outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-border-default rounded-xl text-white outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-text-muted relative z-10">
                    <p>Protected Area. Unauthorized access is prohibited.</p>
                </div>
            </motion.div>
        </div>
    );
}
