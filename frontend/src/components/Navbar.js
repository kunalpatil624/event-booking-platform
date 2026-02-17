'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUser, HiHeart, HiCalendar, HiSearch, HiOfficeBuilding, HiShieldCheck } from 'react-icons/hi';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="8" fill="url(#grad)" />
                            <path d="M8 16L16 8L24 16L16 24L8 16Z" fill="white" fillOpacity="0.9" />
                            <path d="M12 16L16 12L20 16L16 20L12 16Z" fill="url(#grad)" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                                    <stop stopColor="#6C3CE1" />
                                    <stop offset="1" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className={styles.logoText}>
                        Event<span className={styles.logoHighlight}>Book</span>
                    </span>
                </Link>

                <div className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/venues" className={styles.navLink}>Venues</Link>
                    <Link href="/venues?featured=true" className={styles.navLink}>Featured</Link>
                    <Link href="/vendor" className={styles.navLink}>List Venue</Link>
                    <Link href="/about" className={styles.navLink}>About</Link>
                </div>

                <div className={styles.navActions}>
                    <Link href="/venues" className={styles.searchBtn}>
                        <HiSearch />
                    </Link>
                    <Link href="/wishlist" className={styles.iconBtn}>
                        <HiHeart />
                    </Link>
                    <Link href="/dashboard" className={styles.iconBtn}>
                        <HiCalendar />
                    </Link>
                    <Link href="/login" className={`btn btn-primary btn-sm ${styles.loginBtn}`}>
                        <HiUser /> Login
                    </Link>
                </div>

                <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <HiX /> : <HiMenu />}
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link href="/venues" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Venues</Link>
                        <Link href="/venues?featured=true" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Featured</Link>
                        <Link href="/vendor" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>List Your Venue</Link>
                        <Link href="/about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
                        <Link href="/login" className={`btn btn-primary ${styles.mobileLoginBtn}`} onClick={() => setMenuOpen(false)}>
                            <HiUser /> Login / Sign Up
                        </Link>
                        <Link href="/vendor" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                            <HiOfficeBuilding /> Venue Owner
                        </Link>
                        <Link href="/admin" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                            <HiShieldCheck /> Admin
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
