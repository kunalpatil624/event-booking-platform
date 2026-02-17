'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HiSearch, HiLocationMarker, HiCalendar, HiUsers, HiSparkles } from 'react-icons/hi';
import styles from './Hero.module.css';

const cities = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna'];
const occasions = ['Wedding', 'Reception', 'Engagement', 'Birthday', 'Corporate', 'Conference', 'Party', 'Anniversary'];

export default function Hero() {
    const router = useRouter();
    const [city, setCity] = useState('');
    const [occasion, setOccasion] = useState('');
    const [guests, setGuests] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (occasion) params.set('occasion', occasion.toLowerCase());
        if (guests) params.set('minCapacity', guests);
        router.push(`/venues?${params.toString()}`);
    };

    const stats = [
        { value: '500+', label: 'Venues' },
        { value: '10K+', label: 'Events' },
        { value: '4.8', label: 'Rating' },
        { value: '50+', label: 'Cities' },
    ];

    return (
        <section className={styles.hero}>
            {/* Background Elements */}
            <div className={styles.bgElements}>
                <div className={styles.gradientOrb1} />
                <div className={styles.gradientOrb2} />
                <div className={styles.gradientOrb3} />
                <div className={styles.gridPattern} />
            </div>

            <div className={`container ${styles.content}`}>
                <motion.div
                    className={styles.badge}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <HiSparkles className={styles.badgeIcon} />
                    <span>#1 Event Venue Booking Platform in MP</span>
                </motion.div>

                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    Find Your
                    <span className={styles.gradient}> Perfect Venue</span>
                    <br />
                    For Every Celebration
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    Discover 500+ stunning marriage gardens, banquet halls, resorts &amp; event
                    spaces across Madhya Pradesh. Compare, book &amp; celebrate!
                </motion.p>

                {/* Search Box */}
                <motion.form
                    className={styles.searchBox}
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                >
                    <div className={styles.searchField}>
                        <HiLocationMarker className={styles.fieldIcon} />
                        <select value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="">Select City</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.searchField}>
                        <HiCalendar className={styles.fieldIcon} />
                        <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                            <option value="">Occasion</option>
                            {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.searchField}>
                        <HiUsers className={styles.fieldIcon} />
                        <input
                            type="number"
                            placeholder="Guest Count"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            min="1"
                        />
                    </div>

                    <button type="submit" className={styles.searchButton}>
                        <HiSearch />
                        <span>Search</span>
                    </button>
                </motion.form>

                {/* Stats */}
                <motion.div
                    className={styles.stats}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    {stats.map((stat, i) => (
                        <div key={i} className={styles.statItem}>
                            <span className={styles.statValue}>{stat.value}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
