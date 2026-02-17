'use client';
import Link from 'next/link';
import { HiLocationMarker, HiMail, HiPhone } from 'react-icons/hi';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <h3 className={styles.logo}>
                            Event<span>Book</span>
                        </h3>
                        <p className={styles.tagline}>
                            Madhya Pradesh's #1 Event Venue Booking Platform. Discover, compare, and book your dream venue for every celebration.
                        </p>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <HiLocationMarker />
                                <span>Bhopal, Madhya Pradesh</span>
                            </div>
                            <div className={styles.contactItem}>
                                <HiMail />
                                <span>hello@eventbook.in</span>
                            </div>
                            <div className={styles.contactItem}>
                                <HiPhone />
                                <span>+91 98765 43210</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Quick Links</h4>
                        <Link href="/venues">All Venues</Link>
                        <Link href="/venues?featured=true">Featured</Link>
                        <Link href="/venues?venueType=marriage-garden">Marriage Gardens</Link>
                        <Link href="/venues?venueType=banquet">Banquet Halls</Link>
                        <Link href="/venues?venueType=resort">Resorts</Link>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Cities</h4>
                        <Link href="/venues?city=Bhopal">Bhopal</Link>
                        <Link href="/venues?city=Indore">Indore</Link>
                        <Link href="/venues?city=Jabalpur">Jabalpur</Link>
                        <Link href="/venues?city=Gwalior">Gwalior</Link>
                        <Link href="/venues?city=Ujjain">Ujjain</Link>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Support</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/faq">FAQs</Link>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2026 EventBook. All rights reserved.</p>
                    <p>Made with ❤️ in Madhya Pradesh</p>
                </div>
            </div>
        </footer>
    );
}
