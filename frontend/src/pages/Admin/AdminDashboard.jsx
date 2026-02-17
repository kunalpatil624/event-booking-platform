import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiHome, HiOfficeBuilding, HiUsers, HiCalendar, HiCurrencyRupee,
    HiChartBar, HiCog, HiLogout, HiCheckCircle, HiXCircle,
    HiTrendingUp, HiEye, HiSearch, HiBell, HiMenu, HiX,
    HiStar, HiShieldCheck
} from 'react-icons/hi';

const demoStats = [
    { label: 'Total Venues', value: '128', icon: <HiOfficeBuilding />, change: '+12 this month', color: '#8B5CF6' },
    { label: 'Total Bookings', value: '1,847', icon: <HiCalendar />, change: '+86 this week', color: '#06B6D4' },
    { label: 'Revenue', value: '₹24.5L', icon: <HiCurrencyRupee />, change: '+18% from last month', color: '#10B981' },
    { label: 'Active Users', value: '3,420', icon: <HiUsers />, change: '+245 new users', color: '#F5A623' },
];

const pendingVenues = [
    { id: 1, name: 'Sunshine Marriage Garden', city: 'Bhopal', area: 'Ayodhya Bypass', owner: 'Amit Verma', type: 'marriage-garden', submitted: '2026-02-14', images: 8 },
    { id: 2, name: 'Crystal Banquet Hall', city: 'Indore', area: 'AB Road', owner: 'Suresh Patel', type: 'banquet', submitted: '2026-02-15', images: 12 },
    { id: 3, name: 'Green Leaf Resort', city: 'Jabalpur', area: 'Dumna Road', owner: 'Ravi Tiwari', type: 'resort', submitted: '2026-02-16', images: 15 },
];

const recentBookings = [
    { id: 'EVB-K8F2-A1B3', user: 'Priya Sharma', venue: 'Royal Palace Marriage Garden', city: 'Bhopal', date: '2026-03-15', amount: '₹3,50,000', status: 'confirmed' },
    { id: 'EVB-L9G3-C4D5', user: 'Rohit Kumar', venue: 'Lakeside Resort', city: 'Bhopal', date: '2026-03-20', amount: '₹5,00,000', status: 'pending' },
    { id: 'EVB-M1H4-E6F7', user: 'Sneha Gupta', venue: 'Grand Imperial Banquet', city: 'Indore', date: '2026-02-28', amount: '₹2,50,000', status: 'confirmed' },
    { id: 'EVB-N2I5-G8H9', user: 'Vikram Joshi', venue: 'Heritage Hotel', city: 'Ujjain', date: '2026-04-05', amount: '₹4,80,000', status: 'pending' },
    { id: 'EVB-O3J6-I0K1', user: 'Aarti Patel', venue: 'Sunset Garden Resort', city: 'Gwalior', date: '2026-03-10', amount: '₹1,80,000', status: 'cancelled' },
];

const topVenues = [
    { name: 'Royal Palace Marriage Garden', city: 'Bhopal', bookings: 48, revenue: '₹72L', rating: 4.5 },
    { name: 'Lakeside Resort & Convention', city: 'Bhopal', bookings: 36, revenue: '₹54L', rating: 4.8 },
    { name: 'Grand Imperial Banquet', city: 'Indore', bookings: 52, revenue: '₹39L', rating: 4.3 },
    { name: 'Heritage Hotel & Banquets', city: 'Ujjain', bookings: 28, revenue: '₹21L', rating: 4.6 },
];

const navItems = [
    { icon: <HiHome />, label: 'Dashboard', id: 'dashboard' },
    { icon: <HiOfficeBuilding />, label: 'Venues', id: 'venues' },
    { icon: <HiCalendar />, label: 'Bookings', id: 'bookings' },
    { icon: <HiUsers />, label: 'Users', id: 'users' },
    { icon: <HiCurrencyRupee />, label: 'Payments', id: 'payments' },
    { icon: <HiChartBar />, label: 'Analytics', id: 'analytics' },
    { icon: <HiCog />, label: 'Settings', id: 'settings' },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');
        if (!token) { navigate('/admin'); return; }
        if (user) setAdminUser(JSON.parse(user));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin');
    };

    const statusCls = (s) => s === 'confirmed' ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/20' : s === 'pending' ? 'bg-accent-gold/15 text-accent-gold border-accent-gold/20' : 'bg-accent/15 text-accent border-accent/20';

    return (
        <div className="flex min-h-screen bg-bg-primary">
            <aside className={`fixed top-0 left-0 h-full w-[260px] bg-bg-secondary border-r border-border-default flex flex-col z-50 transition-transform duration-300 max-lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-5 pb-4 border-b border-border-default flex items-center justify-between">
                    <Link to="/" className="text-xl font-extrabold text-white">Event<span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Book</span></Link>
                    <span className="px-2.5 py-0.5 bg-red-500/15 text-red-400 text-[0.65rem] font-bold rounded-full uppercase tracking-wider">Admin</span>
                    <button className="lg:hidden text-text-muted text-xl" onClick={() => setSidebarOpen(false)}><HiX /></button>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <button key={item.id} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border-none cursor-pointer ${activeNav === item.id ? 'bg-red-500/15 text-red-400' : 'text-text-secondary hover:bg-white/5 hover:text-white bg-transparent'}`} onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}>
                            {item.icon}<span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-border-default">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/15 text-red-400 text-lg"><HiShieldCheck /></div>
                        <div><p className="text-sm font-medium text-white">{adminUser?.name || 'Admin'}</p><p className="text-xs text-text-muted">Super Admin</p></div>
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
                        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-bg-card border border-border-default rounded-xl">
                            <HiSearch className="text-text-muted" />
                            <input type="text" placeholder="Search..." className="bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted w-36" />
                        </div>
                        <button className="relative w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-lg hover:text-white transition-all duration-300"><HiBell /><span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" /></button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
                        {demoStats.map((stat, i) => (
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

                    <div className="grid grid-cols-[1.5fr_1fr] max-lg:grid-cols-1 gap-6">
                        <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="flex items-center justify-between p-5 border-b border-border-default">
                                <h2 className="text-lg font-semibold text-white">Pending Venue Approvals</h2>
                                <span className="w-7 h-7 flex items-center justify-center bg-accent-gold/15 text-accent-gold text-xs font-bold rounded-full">{pendingVenues.length}</span>
                            </div>
                            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                                {pendingVenues.map(v => (
                                    <div key={v.id} className="p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div className="mb-3"><h4 className="text-sm font-semibold text-white">{v.name}</h4><p className="text-text-muted text-xs mt-0.5">{v.city} • {v.area} • {v.type.replace('-', ' ')}</p><p className="text-text-muted text-[0.7rem] mt-1">By {v.owner} • {v.images} images • Submitted {v.submitted}</p></div>
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-border-default rounded-lg text-text-secondary text-xs font-medium hover:text-white transition-all duration-300"><HiEye /> View</button>
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-accent-emerald/10 border border-accent-emerald/20 rounded-lg text-accent-emerald text-xs font-semibold hover:bg-accent-emerald/20 transition-all duration-300"><HiCheckCircle /> Approve</button>
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent text-xs font-semibold hover:bg-accent/20 transition-all duration-300"><HiXCircle /> Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="p-5 border-b border-border-default"><h2 className="text-lg font-semibold text-white">Top Performing Venues</h2></div>
                            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                                {topVenues.map((v, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div className="w-8 h-8 flex items-center justify-center bg-primary/15 text-primary-light text-sm font-bold rounded-lg shrink-0">#{i + 1}</div>
                                        <div className="flex-1 min-w-0"><h4 className="text-sm font-semibold text-white truncate">{v.name}</h4><p className="text-text-muted text-[0.7rem]">{v.city} • {v.bookings} bookings</p></div>
                                        <div className="text-right shrink-0"><span className="block text-sm font-bold text-accent-emerald">{v.revenue}</span><span className="flex items-center gap-0.5 text-accent-gold text-xs justify-end"><HiStar /> {v.rating}</span></div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <div className="flex items-center justify-between p-5 border-b border-border-default">
                            <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
                            <button className="text-primary-light text-sm font-medium hover:text-white transition-colors">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead><tr className="border-b border-border-default">
                                    {['Booking ID', 'Customer', 'Venue', 'City', 'Event Date', 'Amount', 'Status'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-[0.7rem] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody>
                                    {recentBookings.map((b, i) => (
                                        <tr key={i} className="border-b border-border-default last:border-none hover:bg-white/[0.02] transition-colors">
                                            <td className="px-5 py-3.5 text-sm text-primary-light font-mono">{b.id}</td>
                                            <td className="px-5 py-3.5 text-sm text-white">{b.user}</td>
                                            <td className="px-5 py-3.5 text-sm text-text-secondary">{b.venue}</td>
                                            <td className="px-5 py-3.5 text-sm text-text-secondary">{b.city}</td>
                                            <td className="px-5 py-3.5 text-sm text-text-secondary">{b.date}</td>
                                            <td className="px-5 py-3.5 text-sm text-white font-semibold">{b.amount}</td>
                                            <td className="px-5 py-3.5"><span className={`px-2 py-0.5 text-[0.6rem] font-bold rounded-full uppercase tracking-wider border capitalize ${statusCls(b.status)}`}>{b.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </main>

            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        </div>
    );
}
