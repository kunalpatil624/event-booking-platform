'use client';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        name: 'Aarti & Rahul',
        event: 'Wedding',
        venue: 'Royal Palace Marriage Garden',
        city: 'Bhopal',
        rating: 5,
        text: 'Finding the perfect wedding venue was so stressful until we found EventBook. Booked our dream garden in just 2 days! The virtual tour feature was incredibly helpful.',
        avatar: '👩‍❤️‍👨'
    },
    {
        name: 'Vikram Patel',
        event: 'Corporate Event',
        venue: 'Grand Imperial Banquet',
        city: 'Indore',
        rating: 5,
        text: 'Organized our company annual meet for 500 people. The filter system helped us find exactly what we needed. Smooth booking process and great venue!',
        avatar: '👨‍💼'
    },
    {
        name: 'Sneha Sharma',
        event: 'Engagement',
        venue: 'Sunset Garden Resort',
        city: 'Gwalior',
        rating: 4,
        text: 'Beautiful venue at an amazing price! The price comparison feature saved us ₹50,000 compared to other platforms. Highly recommend EventBook!',
        avatar: '👩'
    },
    {
        name: 'Rajesh & Priya',
        event: 'Reception',
        venue: 'Heritage Hotel & Banquets',
        city: 'Ujjain',
        rating: 5,
        text: 'The entire process from searching to booking took less than 30 minutes. The venue was exactly as shown in the photos. Our guests were truly impressed!',
        avatar: '💑'
    }
];

export default function Testimonials() {
    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <span className="subtitle">Happy Customers</span>
                    <h2>What People Say</h2>
                    <p>Real stories from real celebrations</p>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, si) => (
                                    <HiStar key={si} className={si < t.rating ? styles.starFilled : styles.starEmpty} />
                                ))}
                            </div>
                            <p className={styles.text}>&ldquo;{t.text}&rdquo;</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>{t.avatar}</div>
                                <div>
                                    <h4 className={styles.name}>{t.name}</h4>
                                    <p className={styles.meta}>{t.event} • {t.venue}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
