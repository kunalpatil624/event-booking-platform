import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { useMyVenues } from '../../hooks/useVenues';
import { useVendorBookings } from '../../hooks/useBookings';
import {
    HiHome, HiOfficeBuilding, HiCalendar, HiCurrencyRupee,
    HiChatAlt2, HiStar, HiCog, HiLogout, HiPlus, HiPencil,
    HiTrendingUp, HiEye, HiBell, HiMenu, HiX,
    HiCheck, HiClock, HiXCircle, HiPhotograph, HiClipboardList
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
    const { user: vendorUser, loading: authLoading, logout } = useAuth();
    const { venues: myVenues, loading: venuesLoading } = useMyVenues();
    const { bookings, loading: bookingsLoading, updateStatus } = useVendorBookings();

    const [activeNav, setActiveNav] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState([
        { label: 'Total Bookings', value: '0', icon: <HiCalendar />, change: '', color: '#10B981' },
        { label: 'Revenue', value: '₹0', icon: <HiCurrencyRupee />, change: '', color: '#8B5CF6' },
        { label: 'Total Venues', value: '0', icon: <HiOfficeBuilding />, change: '', color: '#F5A623' },
        { label: 'Pending Requests', value: '0', icon: <HiClipboardList />, change: '', color: '#06B6D4' },
    ]);

    const loading = venuesLoading || bookingsLoading;

    // Redirect if not vendor/admin
    useEffect(() => {
        if (!authLoading && (!vendorUser || (vendorUser.role !== 'vendor' && vendorUser.role !== 'admin'))) {
            navigate('/vendor');
        }
    }, [authLoading, vendorUser, navigate]);

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



    const statusCls = (s) => s === 'confirmed' || s === 'approved' ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/20' : s === 'pending' ? 'bg-accent-gold/15 text-accent-gold border-accent-gold/20' : 'bg-accent/15 text-accent border-accent/20';

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

                    {/* Venues Section */}
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

                    {/* Bookings Section */}
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
                                        </div>
                                    )) : <p className="text-text-muted text-center py-4">No bookings received yet.</p>}
                                </div>
                            </motion.div>
                        </div>
                    ) : null}
                </div>
            </main>

            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        </div>
    );
}
