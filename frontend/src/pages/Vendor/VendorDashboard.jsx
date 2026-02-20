import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { useMyVenues, useVendorReviews } from '../../hooks/useVenues';
import { useVendorBookings } from '../../hooks/useBookings';
import {
    HiHome, HiOfficeBuilding, HiCalendar, HiCurrencyRupee,
    HiChatAlt2, HiStar, HiCog, HiLogout, HiPlus, HiPencil,
    HiTrendingUp, HiEye, HiBell, HiMenu, HiX,
    HiCheck, HiClock, HiXCircle, HiPhotograph, HiClipboardList,
    HiUser, HiLockClosed, HiMail, HiPhone, HiSave
} from 'react-icons/hi';

const navItems = [
    { icon: <HiHome />, label: 'Dashboard', id: 'dashboard' },
    { icon: <HiOfficeBuilding />, label: 'My Venues', id: 'venues' },
    { icon: <HiCalendar />, label: 'Bookings', id: 'bookings' },
    { icon: <HiCurrencyRupee />, label: 'Earnings', id: 'earnings' },
    { icon: <HiChatAlt2 />, label: 'Reviews', id: 'reviews' },
    { icon: <HiClipboardList />, label: 'Enquiries', id: 'enquiries' },
    { icon: <HiCog />, label: 'Settings', id: 'settings' },
];

export default function VendorDashboard() {
    const navigate = useNavigate();
    const { user: vendorUser, loading: authLoading, logout, updateProfile } = useAuth();
    const { venues: myVenues, loading: venuesLoading } = useMyVenues();
    const { bookings, loading: bookingsLoading, updateStatus } = useVendorBookings();
    const { reviews, loading: reviewsLoading } = useVendorReviews();

    const [activeNav, setActiveNav] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState([
        { label: 'Total Bookings', value: '0', icon: <HiCalendar />, change: '', color: '#10B981' },
        { label: 'Revenue', value: '₹0', icon: <HiCurrencyRupee />, change: '', color: '#8B5CF6' },
        { label: 'Total Venues', value: '0', icon: <HiOfficeBuilding />, change: '', color: '#F5A623' },
        { label: 'Pending Requests', value: '0', icon: <HiClipboardList />, change: '', color: '#06B6D4' },
    ]);

    // Settings state
    const [settingsForm, setSettingsForm] = useState({ name: '', mobile: '' });
    const [settingsLoading, setSettingsLoading] = useState(false);

    const loading = venuesLoading || bookingsLoading;

    // Redirect if not vendor/admin
    useEffect(() => {
        if (!authLoading && (!vendorUser || (vendorUser.role !== 'vendor' && vendorUser.role !== 'admin'))) {
            navigate('/vendor');
        }
    }, [authLoading, vendorUser, navigate]);

    // Init settings form
    useEffect(() => {
        if (vendorUser) {
            setSettingsForm({ name: vendorUser.name || '', mobile: vendorUser.mobile || '' });
        }
    }, [vendorUser]);

    useEffect(() => {
        if (!loading) {
            calculateStats(bookings, myVenues);
        }
    }, [bookings, myVenues, loading]);

    const calculateStats = (bookingsList, venuesList) => {
        const totalBookings = bookingsList.length;
        const totalRevenue = bookingsList.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
        const pending = bookingsList.filter(b => b.status === 'pending').length;

        setStats([
            { label: 'Total Bookings', value: totalBookings.toString(), icon: <HiCalendar />, change: 'lifetime', color: '#10B981' },
            { label: 'Revenue', value: `₹${(totalRevenue / 100000).toFixed(2)}L`, icon: <HiCurrencyRupee />, change: 'lifetime', color: '#8B5CF6' },
            { label: 'Total Venues', value: venuesList?.length.toString() || '0', icon: <HiOfficeBuilding />, change: 'active', color: '#F5A623' },
            { label: 'Pending Requests', value: pending.toString(), icon: <HiClipboardList />, change: 'needs action', color: '#06B6D4' },
        ]);
    };

    const handleLogout = () => {
        logout();
    };

    const handleSettingsSave = async () => {
        setSettingsLoading(true);
        try {
            await updateProfile(settingsForm);
        } catch (error) {
            // Error handled in hook
        } finally {
            setSettingsLoading(false);
        }
    };

    // Earnings calculations
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
    const pendingRevenue = pendingBookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);

    // Monthly earnings breakdown
    const monthlyEarnings = {};
    confirmedBookings.forEach(b => {
        const month = new Date(b.createdAt || b.eventDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
        monthlyEarnings[month] = (monthlyEarnings[month] || 0) + (b.pricing?.totalAmount || 0);
    });

    // Reviews stats
    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
    }));

    const statusCls = (s) => s === 'confirmed' || s === 'approved' || s === 'completed' ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/20' : s === 'pending' ? 'bg-accent-gold/15 text-accent-gold border-accent-gold/20' : 'bg-accent/15 text-accent border-accent/20';

    if (loading) return <div className="flex items-center justify-center h-screen bg-bg-primary text-white">Loading Dashboard...</div>;

    return (
        <div className="flex min-h-screen bg-bg-primary">
            <aside className={`fixed top-0 left-0 h-full w-[260px] bg-bg-secondary border-r border-border-default flex flex-col z-50 transition-transform duration-300 max-lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-5 pb-4 border-b border-border-default flex items-center justify-between">
                    <Link to="/" className="text-xl font-extrabold text-white">Event<span className="bg-gradient-to-r from-accent-emerald to-teal-500 bg-clip-text text-transparent">Book</span></Link>
                    <span className="px-2.5 py-0.5 bg-accent-emerald/15 text-accent-emerald text-[0.65rem] font-bold rounded-full uppercase tracking-wider">Vendor</span>
                    <button className="lg:hidden text-text-muted text-xl" onClick={() => setSidebarOpen(false)}><HiX /></button>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <button key={item.id} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border-none cursor-pointer ${activeNav === item.id ? 'bg-accent-emerald/15 text-accent-emerald' : 'text-text-secondary hover:bg-white/5 hover:text-white bg-transparent'}`} onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}>
                            {item.icon}<span>{item.label}</span>
                            {item.id === 'reviews' && reviews.length > 0 && (
                                <span className="ml-auto px-2 py-0.5 bg-accent-gold/20 text-accent-gold text-[10px] font-bold rounded-full">{reviews.length}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-border-default">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-accent-emerald/15 text-accent-emerald text-lg"><HiOfficeBuilding /></div>
                        <div><p className="text-sm font-medium text-white">{vendorUser?.name || 'Venue Owner'}</p><p className="text-xs text-text-muted">Venue Partner</p></div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 border border-border-default rounded-xl text-text-secondary text-sm hover:text-accent hover:border-accent/20 transition-all duration-300" onClick={handleLogout}><HiLogout /> Logout</button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-[260px]">
                <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-bg-primary/85 backdrop-blur-xl border-b border-border-default">
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden text-white text-xl" onClick={() => setSidebarOpen(true)}><HiMenu /></button>
                        <h1 className="text-xl font-bold text-white">{navItems.find(n => n.id === activeNav)?.label || 'Dashboard'}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/vendor/add-venue" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-emerald to-teal-500 text-white text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-300"><HiPlus /> Add New Venue</Link>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div key={i} className="flex items-center gap-4 p-5 bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <div className="w-12 h-12 flex items-center justify-center rounded-[14px] text-xl" style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}>{stat.icon}</div>
                                <div>
                                    <span className="text-2xl font-extrabold text-white block">{stat.value}</span>
                                    <span className="text-text-muted text-xs">{stat.label}</span>
                                    <span className="flex items-center gap-1 text-accent-emerald text-[0.7rem] mt-0.5"><HiTrendingUp /> {stat.change}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ============ VENUES SECTION ============ */}
                    {activeNav === 'venues' || activeNav === 'dashboard' ? (
                        <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="flex items-center justify-between p-5 border-b border-border-default">
                                <h2 className="text-lg font-semibold text-white">My Venues</h2>
                                <Link to="/vendor/add-venue" className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-sm font-medium hover:text-white transition-all duration-300"><HiPlus /> Add Venue</Link>
                            </div>
                            <div className="p-5 grid gap-4">
                                {myVenues.length > 0 ? myVenues.map(venue => (
                                    <div key={venue._id} className="p-5 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div className="flex items-start justify-between mb-3 max-sm:flex-col max-sm:gap-2">
                                            <div>
                                                <h3 className="text-base font-semibold text-white">{venue.name}</h3>
                                                <p className="text-text-muted text-xs mt-0.5">{venue.city} • {venue.area} • {venue.venueType}</p>
                                            </div>
                                            <span className={`px-2.5 py-0.5 text-[0.65rem] font-bold rounded-full uppercase tracking-wider border capitalize ${venue.isApproved ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/20' : 'bg-accent-gold/15 text-accent-gold border-accent-gold/20'}`}>
                                                {venue.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-3 mb-4">
                                            <div className="text-center p-2 bg-bg-secondary rounded-lg"><span className="block text-base font-bold text-white">{venue.rating?.average || '-'}</span><span className="text-[0.65rem] text-text-muted">Rating</span></div>
                                            <div className="text-center p-2 bg-bg-secondary rounded-lg"><span className="block text-base font-bold text-white">₹{venue.startingPrice?.toLocaleString('en-IN') || 0}</span><span className="text-[0.65rem] text-text-muted">Price</span></div>
                                            <div className="text-center p-2 bg-bg-secondary rounded-lg"><span className="block text-base font-bold text-white">{venue.images?.length || 0}</span><span className="text-[0.65rem] text-text-muted">Photos</span></div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border-default rounded-lg text-text-secondary text-xs font-medium hover:text-white hover:border-border-light transition-all duration-300"><HiPencil /> Edit</button>
                                        </div>
                                    </div>
                                )) : <p className="text-text-muted text-center py-4">No venues found. Add your first venue!</p>}
                            </div>
                        </motion.div>
                    ) : null}

                    {/* ============ BOOKINGS SECTION ============ */}
                    {activeNav === 'bookings' || activeNav === 'dashboard' ? (
                        <div className="grid grid-cols-[1.5fr_1fr] max-lg:grid-cols-1 gap-6">
                            <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <div className="flex items-center justify-between p-5 border-b border-border-default">
                                    <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
                                    <span className="w-7 h-7 flex items-center justify-center bg-primary/15 text-primary-light text-xs font-bold rounded-full">{bookings.length}</span>
                                </div>
                                <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                                    {bookings.length > 0 ? bookings.map(b => (
                                        <div key={b._id} className="p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                            <div className="flex justify-between gap-3 mb-2 max-sm:flex-col">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white">{b.user?.name}</h4>
                                                    <p className="text-text-muted text-xs mt-0.5 capitalize">{b.eventType} • {b.venue?.name}</p>
                                                    <p className="text-text-muted text-[0.7rem] mt-1">📅 {new Date(b.eventDate).toLocaleDateString()} • 👥 {b.guestCount} guests</p>
                                                </div>
                                                <div className="text-right max-sm:text-left">
                                                    <span className="block text-base font-bold text-white">₹{b.pricing?.totalAmount?.toLocaleString('en-IN')}</span>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 text-[0.6rem] font-bold rounded-full uppercase tracking-wider border capitalize ${statusCls(b.status)}`}>{b.status}</span>
                                                </div>
                                            </div>
                                            {b.status === 'pending' && (
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-border-default">
                                                    <button onClick={() => updateStatus(b._id, 'confirmed')} className="flex items-center gap-1 px-3 py-1.5 bg-accent-emerald/10 border border-accent-emerald/20 rounded-lg text-accent-emerald text-xs font-semibold hover:bg-accent-emerald/20 transition-all duration-300"><HiCheck /> Accept</button>
                                                    <button onClick={() => updateStatus(b._id, 'cancelled')} className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent text-xs font-semibold hover:bg-accent/20 transition-all duration-300"><HiXCircle /> Decline</button>
                                                </div>
                                            )}
                                            {b.status === 'confirmed' && (
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-border-default">
                                                    <button onClick={() => updateStatus(b._id, 'completed')} className="flex items-center gap-1 px-3 py-1.5 bg-accent-emerald/10 border border-accent-emerald/20 rounded-lg text-accent-emerald text-xs font-semibold hover:bg-accent-emerald/20 transition-all duration-300"><HiCheck /> Mark Completed</button>
                                                    <button onClick={() => { if (window.confirm('Cancel this booking? If paid, a refund will be initiated.')) updateStatus(b._id, 'cancelled'); }} className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent text-xs font-semibold hover:bg-accent/20 transition-all duration-300"><HiXCircle /> Cancel</button>
                                                </div>
                                            )}
                                        </div>
                                    )) : <p className="text-text-muted text-center py-4">No bookings received yet.</p>}
                                </div>
                            </motion.div>
                        </div>
                    ) : null}

                    {/* ============ EARNINGS SECTION ============ */}
                    {activeNav === 'earnings' && (
                        <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            {/* Revenue Overview Cards */}
                            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
                                <div className="p-6 bg-bg-card border border-border-default rounded-2xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-emerald/15 text-accent-emerald text-lg"><HiCurrencyRupee /></div>
                                        <span className="text-text-muted text-sm">Total Revenue</span>
                                    </div>
                                    <span className="text-3xl font-extrabold text-white">₹{totalRevenue.toLocaleString('en-IN')}</span>
                                    <p className="text-accent-emerald text-xs mt-1 flex items-center gap-1"><HiTrendingUp /> From {confirmedBookings.length} confirmed bookings</p>
                                </div>
                                <div className="p-6 bg-bg-card border border-border-default rounded-2xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold text-lg"><HiClock /></div>
                                        <span className="text-text-muted text-sm">Pending Revenue</span>
                                    </div>
                                    <span className="text-3xl font-extrabold text-white">₹{pendingRevenue.toLocaleString('en-IN')}</span>
                                    <p className="text-accent-gold text-xs mt-1">{pendingBookings.length} bookings awaiting confirmation</p>
                                </div>
                                <div className="p-6 bg-bg-card border border-border-default rounded-2xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/15 text-accent text-lg"><HiXCircle /></div>
                                        <span className="text-text-muted text-sm">Cancelled</span>
                                    </div>
                                    <span className="text-3xl font-extrabold text-white">{cancelledBookings.length}</span>
                                    <p className="text-text-muted text-xs mt-1">Cancelled bookings</p>
                                </div>
                            </div>

                            {/* Monthly Breakdown */}
                            <div className="bg-bg-card border border-border-default rounded-2xl">
                                <div className="p-5 border-b border-border-default">
                                    <h2 className="text-lg font-semibold text-white">Monthly Earnings</h2>
                                </div>
                                <div className="p-5">
                                    {Object.keys(monthlyEarnings).length > 0 ? (
                                        <div className="space-y-3">
                                            {Object.entries(monthlyEarnings).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([month, amount]) => (
                                                <div key={month} className="flex items-center justify-between p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/15 text-primary-light text-sm font-bold">{month.split(' ')[0].slice(0, 3)}</div>
                                                        <span className="text-white font-medium">{month}</span>
                                                    </div>
                                                    <span className="text-accent-emerald font-bold text-lg">₹{amount.toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-text-muted text-center py-8">No earnings data yet. Start accepting bookings!</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="bg-bg-card border border-border-default rounded-2xl">
                                <div className="p-5 border-b border-border-default">
                                    <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                                </div>
                                <div className="divide-y divide-border-default max-h-[400px] overflow-y-auto">
                                    {confirmedBookings.length > 0 ? confirmedBookings.slice(0, 15).map(b => (
                                        <div key={b._id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-accent-emerald/15 flex items-center justify-center text-accent-emerald text-sm"><HiCheck /></div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{b.user?.name}</p>
                                                    <p className="text-text-muted text-xs capitalize">{b.eventType} • {b.venue?.name} • {new Date(b.eventDate).toLocaleDateString('en-IN')}</p>
                                                </div>
                                            </div>
                                            <span className="text-accent-emerald font-bold">+₹{b.pricing?.totalAmount?.toLocaleString('en-IN')}</span>
                                        </div>
                                    )) : (
                                        <p className="text-text-muted text-center py-8">No transactions yet.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ============ REVIEWS SECTION ============ */}
                    {activeNav === 'reviews' && (
                        <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            {/* Reviews Summary */}
                            <div className="grid grid-cols-[1fr_2fr] max-lg:grid-cols-1 gap-6">
                                <div className="bg-bg-card border border-border-default rounded-2xl p-6 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-extrabold text-white mb-1">{avgRating}</span>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <HiStar key={star} className={`text-lg ${star <= Math.round(avgRating) ? 'text-accent-gold' : 'text-white/10'}`} />
                                        ))}
                                    </div>
                                    <p className="text-text-muted text-sm">{reviews.length} total reviews</p>

                                    <div className="w-full mt-6 space-y-2">
                                        {ratingDistribution.map(({ star, count, percentage }) => (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-text-muted text-xs w-3">{star}</span>
                                                <HiStar className="text-accent-gold text-xs" />
                                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-accent-gold rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                                                </div>
                                                <span className="text-text-muted text-xs w-8 text-right">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-bg-card border border-border-default rounded-2xl">
                                    <div className="p-5 border-b border-border-default">
                                        <h2 className="text-lg font-semibold text-white">All Reviews</h2>
                                    </div>
                                    <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                                        {reviewsLoading ? (
                                            <p className="text-text-muted text-center py-4">Loading reviews...</p>
                                        ) : reviews.length > 0 ? reviews.map(review => (
                                            <div key={review._id} className="p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-primary/15 text-primary-light flex items-center justify-center font-bold text-sm">
                                                            {review.user?.avatar ? (
                                                                <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover rounded-full" />
                                                            ) : (
                                                                review.user?.name?.charAt(0).toUpperCase() || 'U'
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{review.user?.name}</p>
                                                            <p className="text-text-muted text-xs">{review.venue?.name} • {new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <HiStar key={star} className={`text-sm ${star <= review.rating ? 'text-accent-gold' : 'text-white/10'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.title && <h4 className="text-white text-sm font-semibold mt-2">{review.title}</h4>}
                                                {review.comment && <p className="text-text-secondary text-sm mt-1 leading-relaxed">{review.comment}</p>}
                                                {review.eventType && (
                                                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-primary/10 text-primary-light border border-primary/20 rounded-full text-[0.65rem] capitalize">{review.eventType}</span>
                                                )}
                                            </div>
                                        )) : (
                                            <div className="text-center py-8">
                                                <HiStar className="text-4xl text-white/10 mx-auto mb-3" />
                                                <p className="text-text-muted">No reviews yet.</p>
                                                <p className="text-text-muted text-xs mt-1">Reviews will appear here once customers review your venues.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ============ ENQUIRIES SECTION ============ */}
                    {activeNav === 'enquiries' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="bg-bg-card border border-border-default rounded-2xl p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-light/10 flex items-center justify-center">
                                    <HiClipboardList className="text-3xl text-primary-light" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Enquiries Coming Soon</h2>
                                <p className="text-text-secondary max-w-md mx-auto mb-6">
                                    We're building a powerful enquiry management system where you'll be able to receive, respond to, and track customer enquiries for your venues.
                                </p>
                                <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 max-w-lg mx-auto">
                                    {[
                                        { icon: '💬', label: 'Direct Messages', desc: 'Chat with potential customers' },
                                        { icon: '📋', label: 'Quote Requests', desc: 'Send custom price quotes' },
                                        { icon: '📊', label: 'Lead Tracking', desc: 'Track conversion rates' },
                                    ].map((feature, i) => (
                                        <div key={i} className="p-4 bg-white/[0.03] border border-border-default rounded-xl">
                                            <span className="text-2xl block mb-2">{feature.icon}</span>
                                            <h4 className="text-white text-sm font-semibold mb-1">{feature.label}</h4>
                                            <p className="text-text-muted text-xs">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ============ SETTINGS SECTION ============ */}
                    {activeNav === 'settings' && (
                        <motion.div className="space-y-6 max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            {/* Profile Settings */}
                            <div className="bg-bg-card border border-border-default rounded-2xl">
                                <div className="p-5 border-b border-border-default">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2"><HiUser className="text-primary-light" /> Profile Settings</h2>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                                            <HiUser className="text-sm" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settingsForm.name}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/[0.03] border border-border-default rounded-xl text-white text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(108,60,225,0.15)] transition-all"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                                            <HiMail className="text-sm" /> Email Address
                                        </label>
                                        <div className="w-full px-4 py-3 bg-white/[0.02] border border-border-default rounded-xl text-text-secondary text-sm">
                                            {vendorUser?.email || '—'}
                                            <span className="text-text-muted text-xs ml-2">(cannot change)</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                                            <HiPhone className="text-sm" /> Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={settingsForm.mobile}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, mobile: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/[0.03] border border-border-default rounded-xl text-white text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(108,60,225,0.15)] transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={handleSettingsSave}
                                            disabled={settingsLoading}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-emerald to-teal-500 text-white text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
                                        >
                                            <HiSave /> {settingsLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="bg-bg-card border border-border-default rounded-2xl">
                                <div className="p-5 border-b border-border-default">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2"><HiLockClosed className="text-primary-light" /> Account Information</h2>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div>
                                            <p className="text-white text-sm font-medium">Account Role</p>
                                            <p className="text-text-muted text-xs capitalize">{vendorUser?.role || 'vendor'}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-accent-emerald/15 text-accent-emerald text-xs font-bold rounded-full uppercase">{vendorUser?.role}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div>
                                            <p className="text-white text-sm font-medium">Member Since</p>
                                            <p className="text-text-muted text-xs">
                                                {vendorUser?.createdAt ? new Date(vendorUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div>
                                            <p className="text-white text-sm font-medium">Active Venues</p>
                                            <p className="text-text-muted text-xs">{myVenues.length} venues listed</p>
                                        </div>
                                        <span className="text-white font-bold text-lg">{myVenues.length}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        </div>
    );
}
