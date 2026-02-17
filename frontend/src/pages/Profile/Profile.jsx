import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileInfo from './components/ProfileInfo';
import MyBookings from './components/MyBookings';
import { HiUser, HiCalendar, HiHeart, HiCog, HiLogout, HiArrowLeft, HiShieldCheck } from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const sideNavItems = [
    { id: 'profile', label: 'My Profile', icon: <HiUser /> },
    { id: 'bookings', label: 'My Bookings', icon: <HiCalendar /> },
    { id: 'wishlist', label: 'Wishlist', icon: <HiHeart /> },
    { id: 'settings', label: 'Settings', icon: <HiCog /> },
];

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
                if (data.success) {
                    setUser(data.user);
                } else {
                    navigate('/login');
                }
            } catch {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
        } catch { }
        navigate('/');
    };

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="pt-[100px] min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-text-muted text-sm">Loading profile...</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-[100px] min-h-screen pb-20">
                <div className="max-w-[1280px] mx-auto px-6">
                    {/* Page Header */}
                    <motion.div
                        className="flex items-center justify-between mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <Link to="/" className="flex items-center gap-1.5 text-text-muted text-xs mb-2 hover:text-text-secondary transition-colors">
                                <HiArrowLeft /> Back to Home
                            </Link>
                            <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent">
                                My Account
                            </h1>
                        </div>
                    </motion.div>

                    {/* Layout: Sidebar + Content */}
                    <div className="grid grid-cols-[260px_1fr] max-lg:grid-cols-1 gap-6">
                        {/* Sidebar */}
                        <motion.aside
                            className="max-lg:order-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="bg-bg-card border border-border-default rounded-2xl p-4 sticky top-[100px]">
                                {/* User Summary */}
                                <div className="flex items-center gap-3 pb-4 mb-3 border-b border-border-default">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-base">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            user?.name?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-white truncate">{user?.name}</h3>
                                        <p className="text-text-muted text-xs truncate">{user?.email}</p>
                                    </div>
                                </div>

                                {/* Nav Items */}
                                <nav className="flex flex-col gap-1 mb-3">
                                    {sideNavItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-300 border border-transparent ${activeTab === item.id
                                                    ? 'bg-gradient-to-r from-primary/15 to-transparent text-white border-primary/20'
                                                    : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            <span className={`text-lg ${activeTab === item.id ? 'text-primary-light' : ''}`}>{item.icon}</span>
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>

                                <div className="pt-3 border-t border-border-default">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                    >
                                        <HiLogout className="text-lg" /> Logout
                                    </button>
                                </div>
                            </div>
                        </motion.aside>

                        {/* Main Content */}
                        <div className="max-lg:order-1">
                            {activeTab === 'profile' && (
                                <ProfileInfo user={user} onUpdate={handleUserUpdate} />
                            )}

                            {activeTab === 'bookings' && (
                                <MyBookings />
                            )}

                            {activeTab === 'wishlist' && (
                                <motion.div
                                    className="bg-bg-card border border-border-default rounded-2xl p-10 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="text-5xl mb-4">💜</div>
                                    <h3 className="text-xl font-bold text-white mb-2">Your Wishlist</h3>
                                    <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                                        Save your favorite venues to compare and book later. Click the heart icon on any venue to add it here.
                                    </p>
                                    <Link
                                        to="/venues"
                                        className="inline-flex items-center gap-2 px-7 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white shadow-[0_4px_15px_rgba(108,60,225,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(108,60,225,0.5)] transition-all duration-300"
                                    >
                                        <HiHeart /> Explore Venues
                                    </Link>
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div
                                    className="bg-bg-card border border-border-default rounded-2xl overflow-hidden"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="p-6 border-b border-border-default">
                                        <h3 className="text-lg font-semibold text-white">Account Settings</h3>
                                        <p className="text-text-muted text-sm mt-1">Manage your account preferences</p>
                                    </div>

                                    <div className="divide-y divide-border-default">
                                        {/* Notifications */}
                                        <div className="p-6">
                                            <h4 className="text-sm font-semibold text-white mb-4">Notifications</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Email notifications for booking updates', key: 'emailBooking', defaultOn: true },
                                                    { label: 'SMS notifications for booking confirmations', key: 'smsBooking', defaultOn: true },
                                                    { label: 'Promotional offers and deals', key: 'promoOffers', defaultOn: false },
                                                    { label: 'Newsletter and venue recommendations', key: 'newsletter', defaultOn: false },
                                                ].map(item => (
                                                    <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                                                        <span className="text-text-secondary text-sm group-hover:text-white transition-colors">{item.label}</span>
                                                        <div className="relative">
                                                            <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
                                                            <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-primary transition-colors duration-300" />
                                                            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform duration-300" />
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Security */}
                                        <div className="p-6">
                                            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><HiShieldCheck className="text-primary-light" /> Security</h4>
                                            <button className="px-5 py-2.5 bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-sm font-medium hover:text-white hover:border-border-light transition-all duration-300">
                                                Change Password
                                            </button>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="p-6">
                                            <h4 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h4>
                                            <p className="text-text-muted text-xs mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                            <button className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all duration-300">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
