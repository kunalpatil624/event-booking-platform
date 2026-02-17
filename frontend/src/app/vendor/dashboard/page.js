'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    HiHome, HiOfficeBuilding, HiCalendar, HiCurrencyRupee,
    HiChatAlt2, HiStar, HiCog, HiLogout, HiPlus, HiPencil,
    HiTrendingUp, HiEye, HiBell, HiMenu, HiX,
    HiCheck, HiClock, HiXCircle, HiPhotograph, HiClipboardList
} from 'react-icons/hi';

const demoStats = [
    { label: 'Total Bookings', value: '86', icon: <HiCalendar />, change: '+12 this month', color: '#10B981' },
    { label: 'Revenue', value: '₹12.4L', icon: <HiCurrencyRupee />, change: '+22% growth', color: '#8B5CF6' },
    { label: 'Avg Rating', value: '4.5', icon: <HiStar />, change: '128 reviews', color: '#F5A623' },
    { label: 'Profile Views', value: '2.1K', icon: <HiEye />, change: '+18% this week', color: '#06B6D4' },
];

const myVenues = [
    { id: 1, name: 'Royal Palace Marriage Garden', city: 'Bhopal', area: 'MP Nagar', type: 'Marriage Garden', status: 'approved', bookings: 48, rating: 4.5, revenue: '₹72L', images: 12 },
    { id: 2, name: 'Paradise Garden & Banquet', city: 'Bhopal', area: 'Kolar Road', type: 'Marriage Garden', status: 'approved', bookings: 32, rating: 4.2, revenue: '₹48L', images: 8 },
    { id: 3, name: 'Palm View Convention Center', city: 'Bhopal', area: 'Hoshangabad Road', type: 'Community Hall', status: 'pending', bookings: 0, rating: 0, revenue: '₹0', images: 6 },
];

const upcomingBookings = [
    { id: 'EVB-K8F2-A1B3', customer: 'Priya Sharma', phone: '+91 98765 XXXXX', venue: 'Royal Palace Marriage Garden', event: 'Wedding', date: '2026-03-15', guests: 800, package: 'Premium Package', amount: '₹6,00,000', advance: '₹1,20,000', status: 'confirmed' },
    { id: 'EVB-L9G3-C4D5', customer: 'Rohit Kumar', phone: '+91 87654 XXXXX', venue: 'Royal Palace Marriage Garden', event: 'Reception', date: '2026-03-20', guests: 500, package: 'Venue + Food', amount: '₹3,50,000', advance: '₹70,000', status: 'pending' },
    { id: 'EVB-P4K7-A2B4', customer: 'Neha Patel', phone: '+91 76543 XXXXX', venue: 'Paradise Garden & Banquet', event: 'Engagement', date: '2026-03-08', guests: 200, package: 'Venue Only', amount: '₹60,000', advance: '₹12,000', status: 'confirmed' },
    { id: 'EVB-Q5L8-C3D6', customer: 'Amit Verma', phone: '+91 65432 XXXXX', venue: 'Paradise Garden & Banquet', event: 'Birthday', date: '2026-04-12', guests: 150, package: 'Venue + Food', amount: '₹1,50,000', advance: '₹30,000', status: 'pending' },
];

const recentReviews = [
    { user: 'Aarti M.', venue: 'Royal Palace Marriage Garden', rating: 5, comment: 'Absolutely stunning venue! Our wedding was magical.', date: '2026-02-15', avatar: '👩' },
    { user: 'Rahul S.', venue: 'Royal Palace Marriage Garden', rating: 4, comment: 'Great location and beautiful garden. The catering was excellent.', date: '2026-02-10', avatar: '👨' },
    { user: 'Pooja K.', venue: 'Paradise Garden & Banquet', rating: 5, comment: 'Perfect for our small engagement ceremony. Very cooperative staff.', date: '2026-02-08', avatar: '👩' },
];

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
    const router = useRouter();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [vendorUser, setVendorUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('vendorToken');
        const user = localStorage.getItem('vendorUser');
        if (!token) { router.push('/vendor'); return; }
        if (user) setVendorUser(JSON.parse(user));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorUser');
        router.push('/vendor');
    };

    const statusCls = (s) => s === 'confirmed' || s === 'approved' ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/20' : s === 'pending' ? 'bg-accent-gold/15 text-accent-gold border-accent-gold/20' : 'bg-accent/15 text-accent border-accent/20';

    return (
        <div className="flex min-h-screen bg-bg-primary">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-[260px] bg-bg-secondary border-r border-border-default flex flex-col z-50 transition-transform duration-300 max-lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-5 pb-4 border-b border-border-default flex items-center justify-between">
                    <Link href="/" className="text-xl font-extrabold text-white">Event<span className="bg-gradient-to-r from-accent-emerald to-teal-500 bg-clip-text text-transparent">Book</span></Link>
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

            {/* Main */}
            <main className="flex-1 lg:ml-[260px]">
                <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-bg-primary/85 backdrop-blur-xl border-b border-border-default">
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden text-white text-xl" onClick={() => setSidebarOpen(true)}><HiMenu /></button>
                        <h1 className="text-xl font-bold text-white">{navItems.find(n => n.id === activeNav)?.label || 'Dashboard'}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-emerald to-teal-500 text-white text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-300"><HiPlus /> Add New Venue</button>
                        <button className="relative w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-lg hover:text-white transition-all duration-300"><HiBell /><span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" /></button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Stats */}
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

                    {/* My Venues */}
                    <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="flex items-center justify-between p-5 border-b border-border-default">
                            <h2 className="text-lg font-semibold text-white">My Venues</h2>
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-sm font-medium hover:text-white transition-all duration-300"><HiPlus /> Add Venue</button>
                        </div>
                        <div className="p-5 grid gap-4">
                            {myVenues.map(venue => (
                                <div key={venue.id} className="p-5 bg-white/[0.02] border border-border-default rounded-xl">
                                    <div className="flex items-start justify-between mb-3 max-sm:flex-col max-sm:gap-2">
                                        <div><h3 className="text-base font-semibold text-white">{venue.name}</h3><p className="text-text-muted text-xs mt-0.5">{venue.city} • {venue.area} • {venue.type}</p></div>
                                        <span className={`px-2.5 py-0.5 text-[0.65rem] font-bold rounded-full uppercase tracking-wider border capitalize ${statusCls(venue.status)}`}>{venue.status}</span>
                                    </div>
                                    <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-3 mb-4">
                                        {[{ v: venue.bookings, l: 'Bookings' }, { v: venue.rating || '-', l: 'Rating' }, { v: venue.revenue, l: 'Revenue' }, { v: venue.images, l: 'Photos' }].map(s => (
                                            <div key={s.l} className="text-center p-2 bg-bg-secondary rounded-lg"><span className="block text-base font-bold text-white">{s.v}</span><span className="text-[0.65rem] text-text-muted">{s.l}</span></div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border-default rounded-lg text-text-secondary text-xs font-medium hover:text-white hover:border-border-light transition-all duration-300"><HiPencil /> Edit</button>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border-default rounded-lg text-text-secondary text-xs font-medium hover:text-white hover:border-border-light transition-all duration-300"><HiPhotograph /> Photos</button>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border-default rounded-lg text-text-secondary text-xs font-medium hover:text-white hover:border-border-light transition-all duration-300"><HiCalendar /> Bookings</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-[1.5fr_1fr] max-lg:grid-cols-1 gap-6">
                        {/* Upcoming Bookings */}
                        <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="flex items-center justify-between p-5 border-b border-border-default">
                                <h2 className="text-lg font-semibold text-white">Upcoming Bookings</h2>
                                <span className="w-7 h-7 flex items-center justify-center bg-primary/15 text-primary-light text-xs font-bold rounded-full">{upcomingBookings.length}</span>
                            </div>
                            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                                {upcomingBookings.map(b => (
                                    <div key={b.id} className="p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div className="flex justify-between gap-3 mb-2 max-sm:flex-col">
                                            <div><h4 className="text-sm font-semibold text-white">{b.customer}</h4><p className="text-text-muted text-xs mt-0.5">{b.event} • {b.venue}</p><p className="text-text-muted text-[0.7rem] mt-1">📅 {b.date} • 👥 {b.guests} guests • 📦 {b.package}</p></div>
                                            <div className="text-right max-sm:text-left"><span className="block text-base font-bold text-white">{b.amount}</span><span className="text-text-muted text-[0.7rem]">Advance: {b.advance}</span><br /><span className={`inline-block mt-1 px-2 py-0.5 text-[0.6rem] font-bold rounded-full uppercase tracking-wider border capitalize ${statusCls(b.status)}`}>{b.status}</span></div>
                                        </div>
                                        {b.status === 'pending' && (
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-border-default">
                                                <button className="flex items-center gap-1 px-3 py-1.5 bg-accent-emerald/10 border border-accent-emerald/20 rounded-lg text-accent-emerald text-xs font-semibold hover:bg-accent-emerald/20 transition-all duration-300"><HiCheck /> Accept</button>
                                                <button className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent text-xs font-semibold hover:bg-accent/20 transition-all duration-300"><HiXCircle /> Decline</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Reviews */}
                        <motion.div className="bg-bg-card border border-border-default rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <div className="p-5 border-b border-border-default"><h2 className="text-lg font-semibold text-white">Recent Reviews</h2></div>
                            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                                {recentReviews.map((r, i) => (
                                    <div key={i} className="p-4 bg-white/[0.02] border border-border-default rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-full text-lg">{r.avatar}</span>
                                                <div><h4 className="text-sm font-semibold text-white">{r.user}</h4><p className="text-text-muted text-[0.7rem]">{r.venue} • {r.date}</p></div>
                                            </div>
                                            <div className="flex gap-0.5 text-accent-gold">{[...Array(r.rating)].map((_, j) => <HiStar key={j} />)}</div>
                                        </div>
                                        <p className="text-text-secondary text-sm italic">&ldquo;{r.comment}&rdquo;</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        </div>
    );
}
