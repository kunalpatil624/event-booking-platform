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
import styles from './vendorDashboard.module.css';

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
        if (!token) {
            router.push('/vendor');
            return;
        }
        if (user) setVendorUser(JSON.parse(user));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorUser');
        router.push('/vendor');
    };

    const getStatusStyle = (status) => {
        if (status === 'confirmed' || status === 'approved') return styles.statusConfirmed;
        if (status === 'pending') return styles.statusPending;
        if (status === 'cancelled' || status === 'rejected') return styles.statusCancelled;
        return '';
    };

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>
                        Event<span>Book</span>
                    </Link>
                    <span className={styles.vendorBadge}>Vendor</span>
                    <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
                        <HiX />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`${styles.navItem} ${activeNav === item.id ? styles.activeNavItem : ''}`}
                            onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            <HiOfficeBuilding />
                        </div>
                        <div>
                            <p className={styles.userName}>{vendorUser?.name || 'Venue Owner'}</p>
                            <p className={styles.userRole}>Venue Partner</p>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <HiLogout /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Top Bar */}
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
                            <HiMenu />
                        </button>
                        <h1 className={styles.pageTitle}>
                            {navItems.find(n => n.id === activeNav)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div className={styles.topbarRight}>
                        <button className={styles.addVenueBtn}>
                            <HiPlus /> Add New Venue
                        </button>
                        <button className={styles.notifBtn}>
                            <HiBell />
                            <span className={styles.notifDot} />
                        </button>
                    </div>
                </header>

                <div className={styles.content}>
                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        {demoStats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className={styles.statCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={styles.statIcon} style={{ '--stat-color': stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{stat.value}</span>
                                    <span className={styles.statLabel}>{stat.label}</span>
                                    <span className={styles.statChange}>
                                        <HiTrendingUp /> {stat.change}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* My Venues */}
                    <motion.div
                        className={styles.panel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={styles.panelHeader}>
                            <h2>My Venues</h2>
                            <button className={styles.addBtn}><HiPlus /> Add Venue</button>
                        </div>
                        <div className={styles.venuesGrid}>
                            {myVenues.map((venue) => (
                                <div key={venue.id} className={styles.venueCard}>
                                    <div className={styles.venueCardHeader}>
                                        <div>
                                            <h3>{venue.name}</h3>
                                            <p>{venue.city} • {venue.area} • {venue.type}</p>
                                        </div>
                                        <span className={`${styles.statusBadge} ${getStatusStyle(venue.status)}`}>
                                            {venue.status}
                                        </span>
                                    </div>
                                    <div className={styles.venueStats}>
                                        <div className={styles.venueStat}>
                                            <span className={styles.venueStatValue}>{venue.bookings}</span>
                                            <span className={styles.venueStatLabel}>Bookings</span>
                                        </div>
                                        <div className={styles.venueStat}>
                                            <span className={styles.venueStatValue}>{venue.rating || '-'}</span>
                                            <span className={styles.venueStatLabel}>Rating</span>
                                        </div>
                                        <div className={styles.venueStat}>
                                            <span className={styles.venueStatValue}>{venue.revenue}</span>
                                            <span className={styles.venueStatLabel}>Revenue</span>
                                        </div>
                                        <div className={styles.venueStat}>
                                            <span className={styles.venueStatValue}>{venue.images}</span>
                                            <span className={styles.venueStatLabel}>Photos</span>
                                        </div>
                                    </div>
                                    <div className={styles.venueActions}>
                                        <button className={styles.editBtn}><HiPencil /> Edit</button>
                                        <button className={styles.photosBtn}><HiPhotograph /> Photos</button>
                                        <button className={styles.viewBookingsBtn}><HiCalendar /> Bookings</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className={styles.gridRow}>
                        {/* Upcoming Bookings */}
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className={styles.panelHeader}>
                                <h2>Upcoming Bookings</h2>
                                <span className={styles.countBadge}>{upcomingBookings.length}</span>
                            </div>
                            <div className={styles.panelBody}>
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className={styles.bookingItem}>
                                        <div className={styles.bookingTop}>
                                            <div className={styles.bookingMain}>
                                                <h4>{booking.customer}</h4>
                                                <p>{booking.event} • {booking.venue}</p>
                                                <p className={styles.bookingMeta}>
                                                    📅 {booking.date} • 👥 {booking.guests} guests • 📦 {booking.package}
                                                </p>
                                            </div>
                                            <div className={styles.bookingRight}>
                                                <span className={styles.bookingAmount}>{booking.amount}</span>
                                                <span className={styles.advancePaid}>Advance: {booking.advance}</span>
                                                <span className={`${styles.statusBadge} ${getStatusStyle(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                        {booking.status === 'pending' && (
                                            <div className={styles.bookingActions}>
                                                <button className={styles.acceptBtn}><HiCheck /> Accept</button>
                                                <button className={styles.declineBtn}><HiXCircle /> Decline</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Reviews */}
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className={styles.panelHeader}>
                                <h2>Recent Reviews</h2>
                            </div>
                            <div className={styles.panelBody}>
                                {recentReviews.map((review, i) => (
                                    <div key={i} className={styles.reviewItem}>
                                        <div className={styles.reviewHeader}>
                                            <span className={styles.reviewAvatar}>{review.avatar}</span>
                                            <div>
                                                <h4>{review.user}</h4>
                                                <p>{review.venue} • {review.date}</p>
                                            </div>
                                            <div className={styles.reviewStars}>
                                                {[...Array(review.rating)].map((_, j) => (
                                                    <HiStar key={j} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className={styles.reviewComment}>&ldquo;{review.comment}&rdquo;</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
        </div>
    );
}
