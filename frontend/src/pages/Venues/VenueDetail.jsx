import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { HiStar, HiLocationMarker, HiUsers, HiPhone, HiChat, HiHeart, HiShare, HiCheck, HiCalendar, HiCurrencyRupee, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const venueData = {
    id: '1', name: 'Royal Palace Marriage Garden',
    description: 'A grand marriage garden with lush green lawns, elegant indoor hall, and breathtaking decor options. Perfect for large-scale weddings and receptions with capacity for up to 2000 guests. Our venue features stunning architecture, premium facilities, and a dedicated team to make your celebration unforgettable. Located in the heart of MP Nagar, easily accessible from all parts of the city.',
    city: 'Bhopal', area: 'MP Nagar', address: '123, MP Nagar Zone-II, Bhopal, MP 462011',
    capacity: { min: 200, max: 2000 }, startingPrice: 150000, pricePerPlate: 800,
    venueType: 'marriage-garden', occasions: ['wedding', 'reception', 'engagement'],
    rating: { average: 4.5, count: 128 }, featured: true,
    images: [
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200', isMain: true },
        { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200' },
        { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200' },
        { url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200' },
        { url: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=1200' },
    ],
    amenities: { parking: true, parkingCapacity: 200, ac: true, wifi: true, dj: true, decorationAvailable: true, cateringAvailable: true, rooms: 10, changingRooms: true, stage: true, generator: true },
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

export default function VenueDetail() {
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
                            <img src={venue.images[currentImage]?.url} alt={venue.name} className="w-full h-full object-cover" />
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg border-none rounded-full text-white text-xl hover:bg-black/70 transition-all duration-300" onClick={() => setCurrentImage(i => i > 0 ? i - 1 : venue.images.length - 1)}><HiChevronLeft /></button>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg border-none rounded-full text-white text-xl hover:bg-black/70 transition-all duration-300" onClick={() => setCurrentImage(i => i < venue.images.length - 1 ? i + 1 : 0)}><HiChevronRight /></button>
                            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-lg rounded-full text-white text-sm">{currentImage + 1} / {venue.images.length}</div>
                        </div>
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                            {venue.images.map((img, i) => (
                                <button key={i} className={`w-20 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === currentImage ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-80'}`} onClick={() => setCurrentImage(i)}>
                                    <img src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_380px] max-lg:grid-cols-1 gap-8">
                        <div>
                            <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="flex items-start justify-between gap-4 mb-4 max-md:flex-col">
                                    <div>
                                        <span className="inline-block text-[0.7rem] font-semibold uppercase tracking-wide text-primary-light px-2.5 py-0.5 bg-primary/10 rounded-full mb-2 capitalize">{venue.venueType.replace('-', ' ')}</span>
                                        <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-white mb-2">{venue.name}</h1>
                                        <div className="flex items-center gap-1.5 text-text-secondary text-sm"><HiLocationMarker className="text-accent" /> {venue.address}</div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button className="w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-lg hover:text-accent hover:border-accent/30 transition-all duration-300"><HiHeart /></button>
                                        <button className="w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-border-default rounded-xl text-text-secondary text-lg hover:text-primary-light hover:border-primary/30 transition-all duration-300"><HiShare /></button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 flex-wrap">
                                    <div className="flex items-center gap-1.5 text-sm font-semibold"><HiStar className="text-accent-gold text-lg" /><span className="text-white">{venue.rating.average}</span><span className="text-text-muted font-normal">({venue.rating.count} reviews)</span></div>
                                    <div className="flex items-center gap-1.5 text-text-secondary text-sm"><HiUsers /> {venue.capacity.min}-{venue.capacity.max} Guests</div>
                                    <div className="flex items-center gap-1.5 text-text-secondary text-sm"><HiCurrencyRupee /> Starting ₹{venue.startingPrice.toLocaleString('en-IN')}</div>
                                </div>
                            </motion.div>

                            <div className="flex gap-1 border-b border-border-default mb-6 overflow-x-auto">
                                {['overview', 'packages', 'menu', 'reviews', 'faqs'].map(tab => (
                                    <button key={tab} className={`px-5 py-3 text-sm font-medium border-b-2 transition-all duration-300 capitalize whitespace-nowrap ${activeTab === tab ? 'border-primary text-white' : 'border-transparent text-text-muted hover:text-text-secondary'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                                ))}
                            </div>

                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div><h3 className="text-lg font-semibold text-white mb-3">About This Venue</h3><p className="text-text-secondary text-sm leading-relaxed">{venue.description}</p></div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">Amenities & Facilities</h3>
                                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                                            {amenitiesList.map(a => (
                                                <div key={a.key} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm ${a.available ? 'bg-accent-emerald/[0.06] border-accent-emerald/15 text-white' : 'bg-white/[0.02] border-border-default text-text-muted line-through'}`}>
                                                    <HiCheck className={a.available ? 'text-accent-emerald' : 'text-text-muted'} /><span>{a.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-3">Perfect For</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {venue.occasions.map(o => (<span key={o} className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary-light text-sm font-medium capitalize">{o}</span>))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'packages' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Choose Your Package</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {venue.packages.map((pkg, i) => (
                                            <div key={i} className={`relative p-6 bg-bg-card border rounded-2xl cursor-pointer transition-all duration-300 ${selectedPackage === i ? 'border-primary shadow-[0_0_20px_rgba(108,60,225,0.15)]' : 'border-border-default hover:border-border-light'}`} onClick={() => setSelectedPackage(i)}>
                                                {i === 2 && <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-accent-gold to-[#F7C948] text-bg-card text-xs font-bold rounded-full">Most Popular</div>}
                                                <h4 className="text-base font-semibold text-white mb-1">{pkg.name}</h4>
                                                <p className="text-text-muted text-sm mb-3">{pkg.description}</p>
                                                <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">₹{pkg.price.toLocaleString('en-IN')}</div>
                                                <ul className="space-y-2 mb-4">{pkg.includes.map((item, j) => (<li key={j} className="flex items-center gap-2 text-text-secondary text-sm"><HiCheck className="text-accent-emerald shrink-0" /> {item}</li>))}</ul>
                                                <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedPackage === i ? 'bg-gradient-to-r from-primary to-primary-light text-white' : 'bg-white/[0.06] border border-border-default text-text-secondary hover:text-white hover:border-border-light'}`}>{selectedPackage === i ? 'Selected' : 'Select Package'}</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'menu' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Food Menu</h3>
                                    <p className="text-primary-light text-sm font-medium mb-5">Price per plate: ₹{venue.pricePerPlate}</p>
                                    {venue.foodMenu.map((cat, i) => (
                                        <div key={i} className="mb-6">
                                            <h4 className="text-base font-semibold text-white mb-3 pb-2 border-b border-border-default">{cat.category}</h4>
                                            <div className="space-y-2">
                                                {cat.items.map((item, j) => (
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
                                            <span className="text-3xl font-extrabold text-white">{venue.rating.average}</span>
                                            <div>
                                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <HiStar key={i} className={`text-base ${i < Math.round(venue.rating.average) ? 'text-accent-gold' : 'text-text-muted opacity-30'}`} />)}</div>
                                                <span className="text-text-muted text-xs">{venue.rating.count} reviews</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {venue.reviews.map((r, i) => (
                                            <div key={i} className="p-5 bg-bg-card border border-border-default rounded-2xl">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-10 h-10 flex items-center justify-center text-xl bg-primary/10 rounded-full">{r.avatar}</span>
                                                        <div><h4 className="text-sm font-semibold text-white">{r.user}</h4><span className="text-text-muted text-xs">{r.date}</span></div>
                                                    </div>
                                                    <div className="flex gap-0.5 text-accent-gold">{[...Array(r.rating)].map((_, j) => <HiStar key={j} />)}</div>
                                                </div>
                                                <p className="text-text-secondary text-sm leading-relaxed">{r.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'faqs' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                                    <div className="space-y-3">
                                        {venue.faqs.map((faq, i) => (
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
                                    <div className="text-[2rem] font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent my-1">₹{venue.startingPrice.toLocaleString('en-IN')}</div>
                                    <span className="text-text-muted text-sm">+ ₹{venue.pricePerPlate}/plate</span>
                                </div>
                                <div className="space-y-3 mb-5">
                                    <div><label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Event Date</label><input type="date" className="w-full px-3 py-2.5 bg-bg-secondary border border-border-default rounded-xl text-white text-sm outline-none focus:border-primary transition-all duration-300" /></div>
                                    <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Event Type</label>
                                        <select className="w-full px-3 py-2.5 bg-bg-secondary border border-border-default rounded-xl text-white text-sm outline-none focus:border-primary transition-all duration-300 [&>option]:bg-bg-card"><option>Wedding</option><option>Reception</option><option>Engagement</option><option>Birthday</option><option>Corporate</option></select>
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
