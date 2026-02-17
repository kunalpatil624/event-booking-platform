'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiOfficeBuilding, HiHome, HiGlobe, HiSparkles, HiCake, HiStar } from 'react-icons/hi';
import styles from './Categories.module.css';

const categories = [
    { icon: <HiSparkles />, label: 'Marriage Gardens', type: 'marriage-garden', color: '#FF6B6B', count: '120+' },
    { icon: <HiOfficeBuilding />, label: 'Banquet Halls', type: 'banquet', color: '#8B5CF6', count: '85+' },
    { icon: <HiGlobe />, label: 'Resorts', type: 'resort', color: '#06B6D4', count: '45+' },
    { icon: <HiHome />, label: 'Farmhouses', type: 'farmhouse', color: '#10B981', count: '60+' },
    { icon: <HiStar />, label: 'Hotels', type: 'hotel', color: '#F5A623', count: '90+' },
    { icon: <HiCake />, label: 'Party Lawns', type: 'lawn', color: '#EC4899', count: '75+' },
];

export default function Categories() {
    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <span className="subtitle">Browse Categories</span>
                    <h2>Find The Perfect Venue Type</h2>
                    <p>Choose from a variety of venue types for your special occasion</p>
                </div>

                <div className={styles.grid}>
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.type}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Link href={`/venues?venueType=${cat.type}`} className={styles.card}>
                                <div className={styles.iconWrapper} style={{ '--cat-color': cat.color }}>
                                    {cat.icon}
                                </div>
                                <h3 className={styles.label}>{cat.label}</h3>
                                <span className={styles.count}>{cat.count} Venues</span>
                                <div className={styles.glow} style={{ background: cat.color }} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
