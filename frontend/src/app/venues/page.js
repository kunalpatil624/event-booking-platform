'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import VenueCard from '@/components/VenueCard';
import Footer from '@/components/Footer';
import { HiFilter, HiX, HiSearch, HiAdjustments, HiSortDescending } from 'react-icons/hi';

const allVenues = [
    { id: '1', name: 'Royal Palace Marriage Garden', city: 'Bhopal', area: 'MP Nagar', startingPrice: 150000, capacity: { min: 200, max: 2000 }, venueType: 'marriage-garden', occasions: ['wedding', 'reception', 'engagement'], rating: { average: 4.5, count: 128 }, featured: true, images: [{ url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', isMain: true }], amenities: { parking: true, ac: true, cateringAvailable: true, decorationAvailable: true } },
    { id: '2', name: 'Lakeside Resort & Convention', city: 'Bhopal', area: 'Shamla Hills', startingPrice: 200000, capacity: { min: 100, max: 1500 }, venueType: 'resort', occasions: ['wedding', 'reception', 'corporate'], rating: { average: 4.8, count: 89 }, featured: true, images: [{ url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', isMain: true }], amenities: { parking: true, ac: true, cateringAvailable: true, decorationAvailable: true } },
    { id: '3', name: 'Grand Imperial Banquet', city: 'Indore', area: 'Vijay Nagar', startingPrice: 100000, capacity: { min: 100, max: 800 }, venueType: 'banquet', occasions: ['wedding', 'reception', 'engagement', 'birthday', 'corporate'], rating: { average: 4.3, count: 215 }, featured: true, images: [{ url: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800', isMain: true }], amenities: { parking: true, ac: true, cateringAvailable: true } },
    { id: '4', name: 'Green Valley Farmhouse', city: 'Indore', area: 'Rau', startingPrice: 50000, capacity: { min: 50, max: 500 }, venueType: 'farmhouse', occasions: ['wedding', 'birthday', 'party', 'anniversary'], rating: { average: 4.1, count: 67 }, images: [{ url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800', isMain: true }], amenities: { parking: true, cateringAvailable: true, decorationAvailable: true } },
    { id: '5', name: 'Maharaja Convention Center', city: 'Jabalpur', area: 'Wright Town', startingPrice: 180000, capacity: { min: 300, max: 3000 }, venueType: 'community-hall', occasions: ['wedding', 'reception', 'conference', 'corporate'], rating: { average: 4.0, count: 156 }, featured: true, images: [{ url: 'https://images.unsplash.com/photo-1431540015160-0400cf056e0e?w=800', isMain: true }], amenities: { parking: true, ac: true, cateringAvailable: true } },
    { id: '6', name: 'Sunset Garden Resort', city: 'Gwalior', area: 'City Center', startingPrice: 75000, capacity: { min: 100, max: 700 }, venueType: 'lawn', occasions: ['wedding', 'engagement', 'birthday', 'party'], rating: { average: 4.4, count: 93 }, images: [{ url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', isMain: true }], amenities: { parking: true, cateringAvailable: true, decorationAvailable: true } },
    { id: '7', name: 'Heritage Hotel & Banquets', city: 'Ujjain', area: 'Freeganj', startingPrice: 80000, capacity: { min: 50, max: 600 }, venueType: 'hotel', occasions: ['wedding', 'reception', 'engagement', 'corporate'], rating: { average: 4.6, count: 74 }, featured: true, images: [{ url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', isMain: true }], amenities: { parking: true, ac: true, cateringAvailable: true, decorationAvailable: true } },
    { id: '8', name: 'Paradise Garden & Banquet', city: 'Bhopal', area: 'Kolar Road', startingPrice: 60000, capacity: { min: 100, max: 1000 }, venueType: 'marriage-garden', occasions: ['wedding', 'reception', 'engagement', 'birthday'], rating: { average: 4.2, count: 342 }, images: [{ url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800', isMain: true }], amenities: { parking: true, ac: true, cateringAvailable: true, decorationAvailable: true } },
];

const cities = ['All Cities', 'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'];
const venueTypes = ['All Types', 'marriage-garden', 'banquet', 'resort', 'farmhouse', 'hotel', 'lawn', 'community-hall'];
const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
];

function VenueListingContent() {
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '', venueType: searchParams.get('venueType') || '', occasion: searchParams.get('occasion') || '',
        minPrice: '', maxPrice: '', minCapacity: searchParams.get('minCapacity') || '', parking: false, ac: false, catering: false, decoration: false,
    });
    const [sort, setSort] = useState('popular');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVenues = allVenues
        .filter(v => {
            if (filters.city && v.city !== filters.city) return false;
            if (filters.venueType && v.venueType !== filters.venueType) return false;
            if (filters.occasion && !v.occasions?.includes(filters.occasion)) return false;
            if (filters.minPrice && v.startingPrice < Number(filters.minPrice)) return false;
            if (filters.maxPrice && v.startingPrice > Number(filters.maxPrice)) return false;
            if (filters.minCapacity && v.capacity.max < Number(filters.minCapacity)) return false;
            if (filters.parking && !v.amenities.parking) return false;
            if (filters.ac && !v.amenities.ac) return false;
            if (filters.catering && !v.amenities.cateringAvailable) return false;
            if (filters.decoration && !v.amenities.decorationAvailable) return false;
            if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase()) && !v.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (searchParams.get('featured') === 'true' && !v.featured) return false;
            return true;
        })
        .sort((a, b) => {
            if (sort === 'price-low') return a.startingPrice - b.startingPrice;
            if (sort === 'price-high') return b.startingPrice - a.startingPrice;
            if (sort === 'rating') return b.rating.average - a.rating.average;
            return b.rating.count - a.rating.count;
        });

    const clearFilters = () => {
        setFilters({ city: '', venueType: '', occasion: '', minPrice: '', maxPrice: '', minCapacity: '', parking: false, ac: false, catering: false, decoration: false });
        setSearchQuery('');
    };

    return (
        <>
            <Navbar />
            <main className="pt-[100px] min-h-screen pb-20">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent mb-2">
                            {searchParams.get('featured') === 'true' ? 'Featured Venues' : filters.city ? `Venues in ${filters.city}` : 'All Venues'}
                        </h1>
                        <p className="text-text-secondary text-[0.95rem]">{filteredVenues.length} venues found</p>
                    </motion.div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-4 mb-6 flex-wrap max-md:flex-col max-md:items-stretch">
                        <div className="flex-1 min-w-[250px] flex items-center gap-2.5 px-4 py-2.5 bg-bg-card border border-border-default rounded-xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.15)]">
                            <HiSearch className="text-text-muted text-lg shrink-0" />
                            <input type="text" placeholder="Search venues by name or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-text-muted" />
                        </div>
                        <div className="flex items-center gap-3 max-md:justify-between">
                            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-bg-card border border-border-default rounded-xl text-text-secondary text-sm">
                                <HiSortDescending />
                                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-none text-white text-sm cursor-pointer outline-none [&>option]:bg-bg-card">
                                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                            <button className="flex items-center gap-2 px-[18px] py-2.5 bg-bg-card border border-border-default rounded-xl text-text-secondary text-sm font-medium cursor-pointer hover:border-primary hover:text-white transition-all duration-300" onClick={() => setShowFilters(!showFilters)}>
                                <HiAdjustments /> Filters
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <motion.div className="bg-bg-card border border-border-default rounded-2xl p-6 mb-6 overflow-hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] max-md:grid-cols-2 gap-4 mb-4">
                                {[
                                    { label: 'City', type: 'select', value: filters.city, options: cities, onChange: (v) => setFilters({ ...filters, city: v === 'All Cities' ? '' : v }) },
                                    { label: 'Venue Type', type: 'select', value: filters.venueType, options: venueTypes, onChange: (v) => setFilters({ ...filters, venueType: v === 'All Types' ? '' : v }) },
                                ].map(f => (
                                    <div key={f.label}>
                                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">{f.label}</label>
                                        <select value={f.value} onChange={(e) => f.onChange(e.target.value)} className="w-full px-3 py-2.5 bg-bg-secondary border border-border-default rounded-lg text-white text-sm outline-none [&>option]:bg-bg-card [&>option]:capitalize">
                                            {f.options.map(o => <option key={o} value={o === 'All Cities' || o === 'All Types' ? '' : o}>{o === 'All Types' ? o : o.replace('-', ' ')}</option>)}
                                        </select>
                                    </div>
                                ))}
                                {[
                                    { label: 'Min Budget', placeholder: '₹ Min', value: filters.minPrice, key: 'minPrice' },
                                    { label: 'Max Budget', placeholder: '₹ Max', value: filters.maxPrice, key: 'maxPrice' },
                                    { label: 'Min Guests', placeholder: 'Guests', value: filters.minCapacity, key: 'minCapacity' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">{f.label}</label>
                                        <input type="number" placeholder={f.placeholder} value={f.value} onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })} className="w-full px-3 py-2.5 bg-bg-secondary border border-border-default rounded-lg text-white text-sm outline-none placeholder:text-text-muted" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-5 flex-wrap pt-4 border-t border-border-default">
                                {['parking', 'ac', 'catering', 'decoration'].map(key => (
                                    <label key={key} className="flex items-center gap-1.5 text-text-secondary text-sm cursor-pointer hover:text-white transition-all duration-300">
                                        <input type="checkbox" checked={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })} className="w-4 h-4 accent-primary cursor-pointer" /> {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                ))}
                                <button className="flex items-center gap-1 px-3.5 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent text-xs font-medium ml-auto hover:bg-accent/20 transition-all duration-300" onClick={clearFilters}>
                                    <HiX /> Clear All
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Results */}
                    {filteredVenues.length > 0 ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1 gap-6">
                            {filteredVenues.map((venue, i) => (
                                <VenueCard key={venue.id} venue={venue} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-white mb-2">No venues found</h3>
                            <p className="text-text-secondary mb-6">Try adjusting your filters or search query</p>
                            <button className="inline-flex items-center gap-2 px-7 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white shadow-[0_4px_15px_rgba(108,60,225,0.4)]" onClick={clearFilters}>Clear Filters</button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default function VenuesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
            <VenueListingContent />
        </Suspense>
    );
}
