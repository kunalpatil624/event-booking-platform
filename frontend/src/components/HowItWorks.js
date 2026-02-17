'use client';
import { motion } from 'framer-motion';
import { HiSearch, HiCalendar, HiCreditCard, HiSparkles } from 'react-icons/hi';
import styles from './HowItWorks.module.css';

const steps = [
    {
        icon: <HiSearch />,
        step: '01',
        title: 'Search & Discover',
        description: 'Browse 500+ venues, filter by city, budget, capacity, and amenities to find your perfect match.',
        color: '#8B5CF6'
    },
    {
        icon: <HiCalendar />,
        step: '02',
        title: 'Check & Compare',
        description: 'View detailed photos, virtual tours, compare prices, read reviews, and check real-time availability.',
        color: '#06B6D4'
    },
    {
        icon: <HiCreditCard />,
        step: '03',
        title: 'Book & Pay',
        description: 'Select your package, choose your date, and pay securely online with just 20% advance payment.',
        color: '#10B981'
    },
    {
        icon: <HiSparkles />,
        step: '04',
        title: 'Celebrate!',
        description: 'Get instant confirmation, venue contact details, and enjoy your perfectly planned celebration.',
        color: '#F5A623'
    }
];

export default function HowItWorks() {
    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <span className="subtitle">Simple Process</span>
                    <h2>How It Works</h2>
                    <p>Book your dream venue in 4 easy steps</p>
                </div>

                <div className={styles.grid}>
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            className={styles.card}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                        >
                            <div className={styles.stepNumber} style={{ color: step.color }}>
                                {step.step}
                            </div>
                            <div className={styles.iconWrapper} style={{ '--step-color': step.color }}>
                                {step.icon}
                            </div>
                            <h3 className={styles.title}>{step.title}</h3>
                            <p className={styles.desc}>{step.description}</p>
                            {i < steps.length - 1 && <div className={styles.connector} />}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
