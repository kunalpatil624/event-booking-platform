import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import useWishlist from '../../hooks/useWishlist';
import { useVenueDetail, useReviews } from '../../hooks/useVenues';
import { HiStar, HiLocationMarker, HiUsers, HiPhone, HiChat, HiHeart, HiShare, HiCheck, HiCalendar, HiCurrencyRupee, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const defaultFaqs = [
    { q: 'What is the cancellation policy?', a: 'Free cancellation up to 30 days before the event. 50% refund for cancellations 15-30 days before. No refund within 15 days.' },
    { q: 'Is outside catering allowed?', a: 'We prefer in-house catering for quality control, but outside catering can be arranged with prior approval.' },
    { q: 'What is the advance payment?', a: '20% of the total amount is required as advance at the time of booking. Remaining can be paid before the event.' },
    { q: 'Are there any hidden charges?', a: 'No hidden charges. The quoted price includes venue, basic setup, and mentioned inclusions. Taxes are additional.' },
];

export default function VenueDetail() {
    const { id } = useParams();
    const { venue, loading, error } = useVenueDetail(id);
    const reviews = useReviews(id);

    const [currentImage, setCurrentImage] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [openFaq, setOpenFaq] = useState(null);
    const [likeLoading, setLikeLoading] = useState(false);
    const { isLiked, toggleLike } = useWishlist();

    const handleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        await toggleLike(id);
        setLikeLoading(false);
    };

    if (loading) return (
        <>
            <Navbar />
            <main className="pt-[100px] min-h-screen pb-20">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="animate-pulse">
                        <div className="h-[450px] bg-bg-card rounded-2xl mb-8" />
                        <div className="grid grid-cols-[1fr_380px] max-lg:grid-cols-1 gap-8">
                            <div className="space-y-4">
                                <div className="h-8 bg-bg-card rounded w-1/3" />
                                <div className="h-10 bg-bg-card rounded w-2/3" />
                                <div className="h-4 bg-bg-card rounded w-1/2" />
                            </div>
                            <div className="h-[400px] bg-bg-card rounded-2xl" />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );

    if (error) return (
        <>
            <Navbar />
            <main className="pt-[100px] min-h-screen pb-20">
                <div className="max-w-[1280px] mx-auto px-6 text-center py-20">
                    <h2 className="text-2xl font-bold text-white mb-4">Venue Not Found</h2>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <Link to="/venues" className="inline-flex items-center gap-2 px-7 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white">Browse Venues</Link>
                </div>
            </main>
        </>
    );

    const amenitiesList = [
        { key: 'parking', label: `Parking${venue.amenities?.parkingCapacity ? ` (${venue.amenities.parkingCapacity} cars)` : ''}`, available: venue.amenities?.parking },
        { key: 'ac', label: 'Air Conditioning', available: venue.amenities?.ac },
        { key: 'wifi', label: 'Wi-Fi', available: venue.amenities?.wifi },
        { key: 'dj', label: 'DJ System', available: venue.amenities?.dj },
        { key: 'decoration', label: 'Decoration', available: venue.amenities?.decorationAvailable },
        { key: 'catering', label: 'In-house Catering', available: venue.amenities?.cateringAvailable },
        { key: 'rooms', label: `${venue.amenities?.rooms || 0} Rooms`, available: venue.amenities?.rooms > 0 },
        { key: 'alcohol', label: 'Alcohol Allowed', available: venue.amenities?.alcoholAllowed },
    ].filter(a => a.available);

    const images = venue.images?.length > 0 ? venue.images : [{ url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200' }];
    const faqs = venue.faqs?.length > 0 ? venue.faqs : defaultFaqs;

    return (
        <>
            <Navbar />
            <main className="pt-[100px] min-h-screen pb-20">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
                        <Link to="/venues" className="hover:text-white transition-colors">Venues</Link>
                        <span>/</span>
                        <Link to={`/venues?city=${venue.city}`} className="hover:text-white transition-colors">{venue.city}</Link>
                        <span>/</span>
                        <span className="text-text-secondary">{venue.name}</span>
                    </div>

                    <div className="mb-8">
                        <div className="relative rounded-2xl overflow-hidden h-[450px] max-md:h-[280px]">
                            <img src={images[currentImage]?.url} alt={venue.name} className="w-full h-full object-cover" />
                            {images.length > 1 && (
                                <>
                                    <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg border-none rounded-full text-white text-xl hover:bg-black/70 transition-all duration-300" onClick={() => setCurrentImage(i => i > 0 ? i - 1 : images.length - 1)}><HiChevronLeft /></button>
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg border-none rounded-full text-white text-xl hover:bg-black/70 transition-all duration-300" onClick={() => setCurrentImage(i => i < images.length - 1 ? i + 1 : 0)}><HiChevronRight /></button>
                                </>
                            )}
                            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-lg rounded-full text-white text-sm">{currentImage + 1} / {images.length}</div>
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button key={i} className={`w-20 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === currentImage ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-80'}`} onClick={() => setCurrentImage(i)}>
                                        <img src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-[1fr_380px] max-lg:grid-cols-1 gap-8">
                        <div>
                            <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="flex items-start justify-between gap-4 mb-4 max-md:flex-col">
                                    <div>
                                        <span className="inline-block text-[0.7rem] font-semibold uppercase tracking-wide text-primary-light px-2.5 py-0.5 bg-primary/10 rounded-full mb-2 capitalize">{(venue.venueType || 'venue').replace('-', ' ')}</span>
                                        <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-white mb-2">{venue.name}</h1>
                                        <div className="flex items-center gap-1.5 text-text-secondary text-sm"><HiLocationMarker className="text-accent" /> {venue.address || `${venue.area}, ${venue.city}`}</div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={handleLike}
                                            disabled={likeLoading}
                                            className={`w-10 h-10 flex items-center justify-center border rounded-xl text-lg transition-all duration-300 ${isLiked(id)
                                                ? 'bg-accent/15 border-accent/30 text-accent scale-110 shadow-[0_0_15px_rgba(255,59,48,0.2)]'
                                                : 'bg-white/[0.06] border-border-default text-text-secondary hover:text-accent hover:border-accent/30'}`}
                                        >
                                            <HiHeart className={likeLoading ? 'animate-pulse' : ''} />
                                        </button>
                                        <button className="w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-lg hover:text-primary-light hover:border-primary/30 transition-all duration-300"><HiShare /></button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 flex-wrap">
                                    <div className="flex items-center gap-1.5 text-sm font-semibold"><HiStar className="text-accent-gold text-lg" /><span className="text-white">{venue.rating?.average || 'N/A'}</span><span className="text-text-muted font-normal">({venue.rating?.count || 0} reviews)</span></div>
                                    <div className="flex items-center gap-1.5 text-text-secondary text-sm"><HiUsers /> {venue.capacity?.min || 0}-{venue.capacity?.max || 0} Guests</div>
                                    <div className="flex items-center gap-1.5 text-text-secondary text-sm"><HiCurrencyRupee /> Starting ₹{(venue.startingPrice || 0).toLocaleString('en-IN')}</div>
                                </div>
                            </motion.div>

                            <div className="flex gap-1 border-b border-border-default mb-6 overflow-x-auto">
                                {['overview', ...(venue.packages?.length > 0 ? ['packages'] : []), ...(venue.foodMenu?.length > 0 ? ['menu'] : []), 'reviews', 'faqs'].map(tab => (
                                    <button key={tab} className={`px-5 py-3 text-sm font-medium border-b-2 transition-all duration-300 capitalize whitespace-nowrap ${activeTab === tab ? 'border-primary text-white' : 'border-transparent text-text-muted hover:text-text-secondary'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                                ))}
                            </div>

                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div><h3 className="text-lg font-semibold text-white mb-3">About This Venue</h3><p className="text-text-secondary text-sm leading-relaxed">{venue.description}</p></div>
                                    {amenitiesList.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4">Amenities & Facilities</h3>
                                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                                                {amenitiesList.map(a => (
                                                    <div key={a.key} className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm bg-accent-emerald/[0.06] border-accent-emerald/15 text-white">
                                                        <HiCheck className="text-accent-emerald" /><span>{a.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {venue.occasions?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-3">Perfect For</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {venue.occasions.map(o => (<span key={o} className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary-light text-sm font-medium capitalize">{o}</span>))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'packages' && venue.packages?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Choose Your Package</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {venue.packages.map((pkg, i) => (
                                            <div key={i} className={`relative p-6 bg-bg-card border rounded-2xl cursor-pointer transition-all duration-300 ${selectedPackage === i ? 'border-primary shadow-[0_0_20px_rgba(108,60,225,0.15)]' : 'border-border-default hover:border-border-light'}`} onClick={() => setSelectedPackage(i)}>
                                                <h4 className="text-base font-semibold text-white mb-1">{pkg.name}</h4>
                                                <p className="text-text-muted text-sm mb-3">{pkg.description}</p>
                                                <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">₹{(pkg.price || 0).toLocaleString('en-IN')}</div>
                                                {pkg.includes?.length > 0 && (
                                                    <ul className="space-y-2 mb-4">{pkg.includes.map((item, j) => (<li key={j} className="flex items-center gap-2 text-text-secondary text-sm"><HiCheck className="text-accent-emerald shrink-0" /> {item}</li>))}</ul>
                                                )}
                                                <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedPackage === i ? 'bg-gradient-to-r from-primary to-primary-light text-white' : 'bg-white/[0.06] border border-border-default text-text-secondary hover:text-white hover:border-border-light'}`}>{selectedPackage === i ? 'Selected' : 'Select Package'}</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'menu' && venue.foodMenu?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Food Menu</h3>
                                    {venue.pricePerPlate && <p className="text-primary-light text-sm font-medium mb-5">Price per plate: ₹{venue.pricePerPlate}</p>}
                                    {venue.foodMenu.map((cat, i) => (
                                        <div key={i} className="mb-6">
                                            <h4 className="text-base font-semibold text-white mb-3 pb-2 border-b border-border-default">{cat.category}</h4>
                                            <div className="space-y-2">
                                                {cat.items?.map((item, j) => (
                                                    <div key={j} className="flex items-center justify-between py-2.5 px-4 bg-white/[0.02] rounded-xl">
                                                        <div className="flex items-center gap-2.5"><span>{item.isVeg ? '🟢' : '🔴'}</span><span className="text-text-secondary text-sm">{item.name}</span></div>
                                                        <span className="text-white text-sm font-semibold">₹{item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-white">Guest Reviews</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-extrabold text-white">{venue.rating?.average || 'N/A'}</span>
                                            <div>
                                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <HiStar key={i} className={`text-base ${i < Math.round(venue.rating?.average || 0) ? 'text-accent-gold' : 'text-text-muted opacity-30'}`} />)}</div>
                                                <span className="text-text-muted text-xs">{venue.rating?.count || 0} reviews</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {reviews.length > 0 ? reviews.map((r, i) => (
                                            <div key={r._id || i} className="p-5 bg-bg-card border border-border-default rounded-2xl">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-10 h-10 flex items-center justify-center text-xl bg-primary/10 rounded-full">👤</span>
                                                        <div><h4 className="text-sm font-semibold text-white">{r.user?.name || 'Guest'}</h4><span className="text-text-muted text-xs">{new Date(r.createdAt).toLocaleDateString()}</span></div>
                                                    </div>
                                                    <div className="flex gap-0.5 text-accent-gold">{[...Array(r.rating || 0)].map((_, j) => <HiStar key={j} />)}</div>
                                                </div>
                                                <p className="text-text-secondary text-sm leading-relaxed">{r.comment}</p>
                                            </div>
                                        )) : <p className="text-text-muted text-center py-8">No reviews yet. Be the first to review!</p>}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'faqs' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                                    <div className="space-y-3">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
                                                <button className="w-full flex items-center justify-between p-4 bg-transparent text-left text-white text-sm font-medium hover:bg-white/[0.02] transition-all duration-300" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                                    <span>{faq.q}</span><span className="text-primary-light text-lg ml-4">{openFaq === i ? '−' : '+'}</span>
                                                </button>
                                                {openFaq === i && (<motion.div className="px-4 pb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}><p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p></motion.div>)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="max-lg:order-first">
                            <div className="sticky top-[100px] bg-bg-card border border-border-default rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                <div className="text-center mb-5 pb-5 border-b border-border-default">
                                    <span className="text-text-muted text-xs uppercase tracking-widest">Starting from</span>
                                    <div className="text-[2rem] font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent my-1">₹{(venue.startingPrice || 0).toLocaleString('en-IN')}</div>
                                    {venue.pricePerPlate && <span className="text-text-muted text-sm">+ ₹{venue.pricePerPlate}/plate</span>}
                                </div>
                                <div className="space-y-3 mb-5">
                                    <div><label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Event Date</label><input type="date" className="w-full px-3 py-2.5 bg-bg-secondary border border-border-default rounded-xl text-white text-sm outline-none focus:border-primary transition-all duration-300" /></div>
                                    <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Event Type</label>
                                        <select className="w-full px-3 py-2.5 bg-bg-secondary border border-border-default rounded-xl text-white text-sm outline-none focus:border-primary transition-all duration-300 [&>option]:bg-bg-card">
                                            {(venue.occasions || ['wedding', 'reception', 'engagement', 'birthday', 'corporate']).map(o => <option key={o} className="capitalize">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div><label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Guest Count</label><input type="number" placeholder="No. of guests" min="1" className="w-full px-3 py-2.5 bg-bg-secondary border border-border-default rounded-xl text-white text-sm outline-none placeholder:text-text-muted focus:border-primary transition-all duration-300" /></div>
                                </div>
                                <button className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white shadow-[0_4px_15px_rgba(108,60,225,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(108,60,225,0.5)] transition-all duration-300 mb-4"><HiCalendar /> Check Availability</button>
                                <div className="grid grid-cols-2 gap-2 mb-5">
                                    <button className="flex items-center justify-center gap-2 py-2.5 bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-sm font-medium hover:text-white hover:border-border-light transition-all duration-300"><HiPhone /> Call</button>
                                    <button className="flex items-center justify-center gap-2 py-2.5 bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-sm font-medium hover:text-white hover:border-border-light transition-all duration-300"><HiChat /> Chat</button>
                                </div>
                                <div className="space-y-2.5 pt-4 border-t border-border-default">
                                    {['Instant Confirmation', 'Free Cancellation', 'Best Price Guarantee'].map(t => (<div key={t} className="flex items-center gap-2 text-text-secondary text-xs"><HiCheck className="text-accent-emerald" /> {t}</div>))}
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
