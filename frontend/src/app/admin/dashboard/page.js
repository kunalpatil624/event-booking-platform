'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    HiHome, HiOfficeBuilding, HiUsers, HiCalendar, HiCurrencyRupee,
    HiChartBar, HiCog, HiLogout, HiCheckCircle, HiXCircle, HiClock,
    HiTrendingUp, HiEye, HiSearch, HiFilter, HiBell, HiMenu, HiX,
    HiStar, HiShieldCheck
} from 'react-icons/hi';
import styles from './adminDashboard.module.css';

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
    const router = useRouter();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');
        if (!token) {
            router.push('/admin');
            return;
        }
        if (user) setAdminUser(JSON.parse(user));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin');
    };

    const getStatusStyle = (status) => {
        if (status === 'confirmed') return styles.statusConfirmed;
        if (status === 'pending') return styles.statusPending;
        if (status === 'cancelled') return styles.statusCancelled;
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
                    <span className={styles.adminBadge}>Admin</span>
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
                            <HiShieldCheck />
                        </div>
                        <div>
                            <p className={styles.userName}>{adminUser?.name || 'Admin'}</p>
                            <p className={styles.userRole}>Super Admin</p>
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
                        <div className={styles.searchBar}>
                            <HiSearch />
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className={styles.notifBtn}>
                            <HiBell />
                            <span className={styles.notifDot} />
                        </button>
                    </div>
                </header>

                <div className={styles.content}>
                    {/* Stats Grid */}
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

                    <div className={styles.gridRow}>
                        {/* Pending Venue Approvals */}
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className={styles.panelHeader}>
                                <h2>Pending Venue Approvals</h2>
                                <span className={styles.countBadge}>{pendingVenues.length}</span>
                            </div>
                            <div className={styles.panelBody}>
                                {pendingVenues.map((venue, i) => (
                                    <div key={venue.id} className={styles.approvalItem}>
                                        <div className={styles.approvalInfo}>
                                            <h4>{venue.name}</h4>
                                            <p>{venue.city} • {venue.area} • {venue.type.replace('-', ' ')}</p>
                                            <p className={styles.approvalMeta}>
                                                By {venue.owner} • {venue.images} images • Submitted {venue.submitted}
                                            </p>
                                        </div>
                                        <div className={styles.approvalActions}>
                                            <button className={styles.viewBtn}><HiEye /> View</button>
                                            <button className={styles.approveBtn}><HiCheckCircle /> Approve</button>
                                            <button className={styles.rejectBtn}><HiXCircle /> Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Top Performing Venues */}
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className={styles.panelHeader}>
                                <h2>Top Performing Venues</h2>
                            </div>
                            <div className={styles.panelBody}>
                                {topVenues.map((venue, i) => (
                                    <div key={i} className={styles.topVenueItem}>
                                        <div className={styles.topRank}>#{i + 1}</div>
                                        <div className={styles.topVenueInfo}>
                                            <h4>{venue.name}</h4>
                                            <p>{venue.city} • {venue.bookings} bookings</p>
                                        </div>
                                        <div className={styles.topStats}>
                                            <span className={styles.topRevenue}>{venue.revenue}</span>
                                            <span className={styles.topRating}><HiStar /> {venue.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Recent Bookings Table */}
                    <motion.div
                        className={styles.panel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className={styles.panelHeader}>
                            <h2>Recent Bookings</h2>
                            <button className={styles.viewAllBtn}>View All</button>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Customer</th>
                                        <th>Venue</th>
                                        <th>City</th>
                                        <th>Event Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking, i) => (
                                        <tr key={i}>
                                            <td className={styles.bookingId}>{booking.id}</td>
                                            <td>{booking.user}</td>
                                            <td>{booking.venue}</td>
                                            <td>{booking.city}</td>
                                            <td>{booking.date}</td>
                                            <td className={styles.amount}>{booking.amount}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${getStatusStyle(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Mobile Overlay */}
            {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
        </div>
    );
}
