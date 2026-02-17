'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './CTASection.module.css';

export default function CTASection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.bgOrb1} />
                    <div className={styles.bgOrb2} />
                    <div className={styles.content}>
                        <h2 className={styles.title}>Ready to Find Your Dream Venue?</h2>
                        <p className={styles.desc}>
                            Join thousands of happy customers who found their perfect celebration space through EventBook.
                            Start browsing now — its free!
                        </p>
                        <div className={styles.actions}>
                            <Link href="/venues" className="btn btn-primary btn-lg">
                                Explore Venues
                            </Link>
                            <Link href="/login" className="btn btn-secondary btn-lg">
                                List Your Venue
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
