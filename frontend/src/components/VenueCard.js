'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiStar, HiLocationMarker, HiUsers, HiHeart } from 'react-icons/hi';
import styles from './VenueCard.module.css';

export default function VenueCard({ venue, index = 0 }) {
    const mainImage = venue.images?.find(img => img.isMain)?.url || venue.images?.[0]?.url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800';

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/venues/${venue._id || venue.id || 'demo'}`} className={styles.link}>
                <div className={styles.imageWrapper}>
                    <img src={mainImage} alt={venue.name} className={styles.image} loading="lazy" />
                    <div className={styles.overlay} />
                    <button className={styles.wishlistBtn} onClick={(e) => { e.preventDefault(); }}>
                        <HiHeart />
                    </button>
                    {venue.featured && (
                        <span className={styles.featuredBadge}>★ Featured</span>
                    )}
                    <div className={styles.priceBadge}>
                        ₹{(venue.startingPrice || 0).toLocaleString('en-IN')}
                    </div>
                </div>

                <div className={styles.info}>
                    <div className={styles.ratingRow}>
                        <div className={styles.rating}>
                            <HiStar className={styles.starIcon} />
                            <span>{venue.rating?.average || 4.0}</span>
                            <span className={styles.ratingCount}>({venue.rating?.count || 0})</span>
                        </div>
                        <span className={styles.venueType}>{(venue.venueType || 'venue').replace('-', ' ')}</span>
                    </div>

                    <h3 className={styles.name}>{venue.name}</h3>

                    <div className={styles.location}>
                        <HiLocationMarker />
                        <span>{venue.area}, {venue.city}</span>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.capacity}>
                            <HiUsers />
                            <span>{venue.capacity?.min || 100}-{venue.capacity?.max || 500} Guests</span>
                        </div>
                    </div>

                    <div className={styles.amenitiesTags}>
                        {venue.amenities?.parking && <span className={styles.tag}>Parking</span>}
                        {venue.amenities?.ac && <span className={styles.tag}>AC</span>}
                        {venue.amenities?.cateringAvailable && <span className={styles.tag}>Catering</span>}
                        {venue.amenities?.decorationAvailable && <span className={styles.tag}>Decor</span>}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
