'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HiStar, HiLocationMarker, HiUsers, HiPhone, HiChat, HiHeart, HiShare, HiCheck, HiCalendar, HiCurrencyRupee, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import styles from './venueDetail.module.css';

const venueData = {
    id: '1',
    name: 'Royal Palace Marriage Garden',
    description: 'A grand marriage garden with lush green lawns, elegant indoor hall, and breathtaking decor options. Perfect for large-scale weddings and receptions with capacity for up to 2000 guests. Our venue features stunning architecture, premium facilities, and a dedicated team to make your celebration unforgettable. Located in the heart of MP Nagar, easily accessible from all parts of the city.',
    city: 'Bhopal',
    area: 'MP Nagar',
    address: '123, MP Nagar Zone-II, Bhopal, MP 462011',
    capacity: { min: 200, max: 2000 },
    startingPrice: 150000,
    pricePerPlate: 800,
    venueType: 'marriage-garden',
    occasions: ['wedding', 'reception', 'engagement'],
    rating: { average: 4.5, count: 128 },
    featured: true,
    images: [
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200', isMain: true },
        { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200' },
        { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200' },
        { url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200' },
        { url: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=1200' },
    ],
    amenities: {
        parking: true, parkingCapacity: 200, ac: true, wifi: true, dj: true,
        decorationAvailable: true, cateringAvailable: true, rooms: 10,
        changingRooms: true, stage: true, generator: true
    },
    packages: [
        { name: 'Venue Only', description: 'Just the venue with basic setup', price: 150000, includes: ['Venue', 'Basic Lighting', 'Chairs & Tables', 'Parking'] },
        { name: 'Venue + Food', description: 'Venue with full catering service', price: 350000, includes: ['Venue', 'Catering (Veg)', 'Basic Decoration', 'Parking', 'DJ'] },
        { name: 'Premium Package', description: 'Complete wedding solution', price: 600000, includes: ['Venue', 'Premium Catering', 'Full Decoration', 'DJ', 'Photography', 'Rooms', 'Valet Parking'] }
    ],
    foodMenu: [
        { category: 'Starters', items: [{ name: 'Paneer Tikka', price: 250, isVeg: true }, { name: 'Hara Bhara Kabab', price: 200, isVeg: true }] },
        { category: 'Main Course', items: [{ name: 'Dal Makhani', price: 300, isVeg: true }, { name: 'Shahi Paneer', price: 350, isVeg: true }] },
        { category: 'Desserts', items: [{ name: 'Gulab Jamun', price: 150, isVeg: true }, { name: 'Rasgulla', price: 150, isVeg: true }] },
    ],
    reviews: [
        { user: 'Aarti M.', rating: 5, comment: 'Absolutely stunning venue! Our wedding was magical. The staff went above and beyond to make everything perfect.', date: '2026-01-15', avatar: '👩' },
        { user: 'Rahul S.', rating: 4, comment: 'Great location and beautiful garden. The catering was excellent. Only minor issue was parking management during peak time.', date: '2026-01-10', avatar: '👨' },
        { user: 'Priya K.', rating: 5, comment: 'Perfect venue for our engagement ceremony. The decoration team did an amazing job. Will definitely book again for the wedding!', date: '2025-12-28', avatar: '👩' },
    ],
    faqs: [
        { q: 'What is the cancellation policy?', a: 'Free cancellation up to 30 days before the event. 50% refund for cancellations 15-30 days before. No refund within 15 days.' },
        { q: 'Is outside catering allowed?', a: 'We prefer in-house catering for quality control, but outside catering can be arranged with prior approval.' },
        { q: 'What is the advance payment?', a: '20% of the total amount is required as advance at the time of booking. Remaining can be paid before the event.' },
        { q: 'Are there any hidden charges?', a: 'No hidden charges. The quoted price includes venue, basic setup, and mentioned inclusions. Taxes are additional.' },
    ]
};

export default function VenueDetailPage() {
    const { id } = useParams();
    const venue = venueData;
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [openFaq, setOpenFaq] = useState(null);

    const amenitiesList = [
        { key: 'parking', label: `Parking (${venue.amenities.parkingCapacity} cars)`, available: venue.amenities.parking },
        { key: 'ac', label: 'Air Conditioning', available: venue.amenities.ac },
        { key: 'wifi', label: 'Wi-Fi', available: venue.amenities.wifi },
        { key: 'dj', label: 'DJ System', available: venue.amenities.dj },
        { key: 'decoration', label: 'Decoration', available: venue.amenities.decorationAvailable },
        { key: 'catering', label: 'In-house Catering', available: venue.amenities.cateringAvailable },
        { key: 'rooms', label: `${venue.amenities.rooms} Rooms`, available: venue.amenities.rooms > 0 },
        { key: 'changing', label: 'Changing Rooms', available: venue.amenities.changingRooms },
        { key: 'stage', label: 'Stage', available: venue.amenities.stage },
        { key: 'generator', label: 'Power Backup', available: venue.amenities.generator },
    ];

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className="container">
                    {/* Breadcrumb */}
                    <div className={styles.breadcrumb}>
                        <Link href="/venues">Venues</Link>
                        <span>/</span>
                        <Link href={`/venues?city=${venue.city}`}>{venue.city}</Link>
                        <span>/</span>
                        <span className={styles.current}>{venue.name}</span>
                    </div>

                    {/* Image Gallery */}
                    <div className={styles.gallery}>
                        <div className={styles.mainImage}>
                            <img src={venue.images[currentImage]?.url} alt={venue.name} />
                            <button className={`${styles.galleryNav} ${styles.prevBtn}`} onClick={() => setCurrentImage(i => i > 0 ? i - 1 : venue.images.length - 1)}>
                                <HiChevronLeft />
                            </button>
                            <button className={`${styles.galleryNav} ${styles.nextBtn}`} onClick={() => setCurrentImage(i => i < venue.images.length - 1 ? i + 1 : 0)}>
                                <HiChevronRight />
                            </button>
                            <div className={styles.imageCounter}>{currentImage + 1} / {venue.images.length}</div>
                        </div>
                        <div className={styles.thumbnails}>
                            {venue.images.map((img, i) => (
                                <button key={i} className={`${styles.thumb} ${i === currentImage ? styles.activeThumb : ''}`} onClick={() => setCurrentImage(i)}>
                                    <img src={img.url} alt={`View ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.layout}>
                        {/* Left Content */}
                        <div className={styles.leftContent}>
                            {/* Header */}
                            <motion.div className={styles.venueHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className={styles.headerTop}>
                                    <div>
                                        <span className={styles.typeBadge}>{venue.venueType.replace('-', ' ')}</span>
                                        <h1 className={styles.venueName}>{venue.name}</h1>
                                        <div className={styles.venueLocation}>
                                            <HiLocationMarker /> {venue.address}
                                        </div>
                                    </div>
                                    <div className={styles.headerActions}>
                                        <button className={styles.actionBtn}><HiHeart /></button>
                                        <button className={styles.actionBtn}><HiShare /></button>
                                    </div>
                                </div>
                                <div className={styles.headerMeta}>
                                    <div className={styles.ratingBig}>
                                        <HiStar className={styles.starBig} />
                                        <span className={styles.ratingValue}>{venue.rating.average}</span>
                                        <span className={styles.ratingCount}>({venue.rating.count} reviews)</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <HiUsers /> {venue.capacity.min}-{venue.capacity.max} Guests
                                    </div>
                                    <div className={styles.metaItem}>
                                        <HiCurrencyRupee /> Starting ₹{venue.startingPrice.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Tabs */}
                            <div className={styles.tabs}>
                                {['overview', 'packages', 'menu', 'reviews', 'faqs'].map(tab => (
                                    <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`} onClick={() => setActiveTab(tab)}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'overview' && (
                                <div className={styles.tabContent}>
                                    <div className={styles.aboutSection}>
                                        <h3>About This Venue</h3>
                                        <p>{venue.description}</p>
                                    </div>
                                    <div className={styles.amenitiesSection}>
                                        <h3>Amenities & Facilities</h3>
                                        <div className={styles.amenitiesGrid}>
                                            {amenitiesList.map(a => (
                                                <div key={a.key} className={`${styles.amenityItem} ${a.available ? '' : styles.unavailable}`}>
                                                    <HiCheck className={styles.amenityIcon} />
                                                    <span>{a.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.occasionsSection}>
                                        <h3>Perfect For</h3>
                                        <div className={styles.occasionTags}>
                                            {venue.occasions.map(o => (
                                                <span key={o} className={styles.occasionTag}>{o}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'packages' && (
                                <div className={styles.tabContent}>
                                    <h3>Choose Your Package</h3>
                                    <div className={styles.packagesGrid}>
                                        {venue.packages.map((pkg, i) => (
                                            <div key={i} className={`${styles.packageCard} ${selectedPackage === i ? styles.selectedPkg : ''}`} onClick={() => setSelectedPackage(i)}>
                                                {i === 2 && <div className={styles.popularTag}>Most Popular</div>}
                                                <h4>{pkg.name}</h4>
                                                <p className={styles.pkgDesc}>{pkg.description}</p>
                                                <div className={styles.pkgPrice}>₹{pkg.price.toLocaleString('en-IN')}</div>
                                                <ul className={styles.pkgIncludes}>
                                                    {pkg.includes.map((item, j) => (
                                                        <li key={j}><HiCheck /> {item}</li>
                                                    ))}
                                                </ul>
                                                <button className={`btn ${selectedPackage === i ? 'btn-primary' : 'btn-secondary'}`}>
                                                    {selectedPackage === i ? 'Selected' : 'Select Package'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'menu' && (
                                <div className={styles.tabContent}>
                                    <h3>Food Menu</h3>
                                    <p className={styles.menuNote}>Price per plate: ₹{venue.pricePerPlate}</p>
                                    {venue.foodMenu.map((cat, i) => (
                                        <div key={i} className={styles.menuCategory}>
                                            <h4>{cat.category}</h4>
                                            <div className={styles.menuItems}>
                                                {cat.items.map((item, j) => (
                                                    <div key={j} className={styles.menuItem}>
                                                        <div className={styles.menuItemInfo}>
                                                            <span className={`${styles.vegBadge} ${item.isVeg ? styles.veg : styles.nonVeg}`}>{item.isVeg ? '🟢' : '🔴'}</span>
                                                            <span>{item.name}</span>
                                                        </div>
                                                        <span className={styles.menuPrice}>₹{item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className={styles.tabContent}>
                                    <div className={styles.reviewsHeader}>
                                        <h3>Guest Reviews</h3>
                                        <div className={styles.overallRating}>
                                            <span className={styles.bigRating}>{venue.rating.average}</span>
                                            <div>
                                                <div className={styles.starsRow}>
                                                    {[...Array(5)].map((_, i) => <HiStar key={i} className={i < Math.round(venue.rating.average) ? styles.starFill : styles.starOff} />)}
                                                </div>
                                                <span className={styles.reviewTotal}>{venue.rating.count} reviews</span>
                                            </div>
                                        </div>
                                    </div>
                                    {venue.reviews.map((r, i) => (
                                        <div key={i} className={styles.reviewCard}>
                                            <div className={styles.reviewUser}>
                                                <span className={styles.reviewAvatar}>{r.avatar}</span>
                                                <div>
                                                    <h4>{r.user}</h4>
                                                    <span className={styles.reviewDate}>{r.date}</span>
                                                </div>
                                                <div className={styles.reviewStars}>
                                                    {[...Array(r.rating)].map((_, j) => <HiStar key={j} />)}
                                                </div>
                                            </div>
                                            <p className={styles.reviewText}>{r.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'faqs' && (
                                <div className={styles.tabContent}>
                                    <h3>Frequently Asked Questions</h3>
                                    {venue.faqs.map((faq, i) => (
                                        <div key={i} className={styles.faqItem}>
                                            <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                                <span>{faq.q}</span>
                                                <span className={styles.faqToggle}>{openFaq === i ? '−' : '+'}</span>
                                            </button>
                                            {openFaq === i && (
                                                <motion.div className={styles.faqAnswer} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                                    <p>{faq.a}</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar - Booking Card */}
                        <div className={styles.sidebar}>
                            <div className={styles.bookingCard}>
                                <div className={styles.priceHeader}>
                                    <span className={styles.startingFrom}>Starting from</span>
                                    <div className={styles.priceAmount}>
                                        ₹{venue.startingPrice.toLocaleString('en-IN')}
                                    </div>
                                    <span className={styles.pricePerPlate}>+ ₹{venue.pricePerPlate}/plate</span>
                                </div>

                                <div className={styles.bookingForm}>
                                    <div className={styles.formGroup}>
                                        <label>Event Date</label>
                                        <input type="date" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Event Type</label>
                                        <select>
                                            <option>Wedding</option>
                                            <option>Reception</option>
                                            <option>Engagement</option>
                                            <option>Birthday</option>
                                            <option>Corporate</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Guest Count</label>
                                        <input type="number" placeholder="No. of guests" min="1" />
                                    </div>
                                </div>

                                <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                    <HiCalendar /> Check Availability
                                </button>

                                <div className={styles.contactActions}>
                                    <button className={styles.contactBtn}>
                                        <HiPhone /> Call Manager
                                    </button>
                                    <button className={styles.contactBtn}>
                                        <HiChat /> Chat
                                    </button>
                                </div>

                                <div className={styles.trustBadges}>
                                    <div className={styles.trustItem}>
                                        <HiCheck /> Instant Confirmation
                                    </div>
                                    <div className={styles.trustItem}>
                                        <HiCheck /> Free Cancellation
                                    </div>
                                    <div className={styles.trustItem}>
                                        <HiCheck /> Best Price Guarantee
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
