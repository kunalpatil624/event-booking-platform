'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import VenueCard from '@/components/VenueCard';
import Footer from '@/components/Footer';
import { HiFilter, HiX, HiSearch, HiAdjustments, HiSortDescending } from 'react-icons/hi';
import styles from './venues.module.css';

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
        city: searchParams.get('city') || '',
        venueType: searchParams.get('venueType') || '',
        occasion: searchParams.get('occasion') || '',
        minPrice: '',
        maxPrice: '',
        minCapacity: searchParams.get('minCapacity') || '',
        parking: false,
        ac: false,
        catering: false,
        decoration: false,
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
            <main className={styles.main}>
                <div className="container">
                    {/* Page Header */}
                    <motion.div className={styles.pageHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className={styles.pageTitle}>
                            {searchParams.get('featured') === 'true' ? 'Featured Venues' : filters.city ? `Venues in ${filters.city}` : 'All Venues'}
                        </h1>
                        <p className={styles.pageSubtitle}>{filteredVenues.length} venues found</p>
                    </motion.div>

                    {/* Search & Filter Bar */}
                    <div className={styles.toolbar}>
                        <div className={styles.searchBar}>
                            <HiSearch className={styles.searchIcon} />
                            <input type="text" placeholder="Search venues by name or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
                        </div>
                        <div className={styles.toolbarActions}>
                            <div className={styles.sortWrapper}>
                                <HiSortDescending />
                                <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.sortSelect}>
                                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                            <button className={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
                                <HiAdjustments /> Filters
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <motion.div className={styles.filtersPanel} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <div className={styles.filtersGrid}>
                                <div className={styles.filterGroup}>
                                    <label>City</label>
                                    <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value === 'All Cities' ? '' : e.target.value })}>
                                        {cities.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Venue Type</label>
                                    <select value={filters.venueType} onChange={(e) => setFilters({ ...filters, venueType: e.target.value === 'All Types' ? '' : e.target.value })}>
                                        {venueTypes.map(t => <option key={t} value={t === 'All Types' ? '' : t}>{t === 'All Types' ? t : t.replace('-', ' ')}</option>)}
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Min Budget</label>
                                    <input type="number" placeholder="₹ Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Max Budget</label>
                                    <input type="number" placeholder="₹ Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Min Guests</label>
                                    <input type="number" placeholder="Guests" value={filters.minCapacity} onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })} />
                                </div>
                            </div>
                            <div className={styles.amenityFilters}>
                                <label className={styles.checkbox}><input type="checkbox" checked={filters.parking} onChange={(e) => setFilters({ ...filters, parking: e.target.checked })} /> Parking</label>
                                <label className={styles.checkbox}><input type="checkbox" checked={filters.ac} onChange={(e) => setFilters({ ...filters, ac: e.target.checked })} /> AC</label>
                                <label className={styles.checkbox}><input type="checkbox" checked={filters.catering} onChange={(e) => setFilters({ ...filters, catering: e.target.checked })} /> Catering</label>
                                <label className={styles.checkbox}><input type="checkbox" checked={filters.decoration} onChange={(e) => setFilters({ ...filters, decoration: e.target.checked })} /> Decoration</label>
                                <button className={styles.clearBtn} onClick={clearFilters}><HiX /> Clear All</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Results Grid */}
                    {filteredVenues.length > 0 ? (
                        <div className="grid-venues">
                            {filteredVenues.map((venue, i) => (
                                <VenueCard key={venue.id} venue={venue} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            <h3>No venues found</h3>
                            <p>Try adjusting your filters or search query</p>
                            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
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
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />}>
            <VenueListingContent />
        </Suspense>
    );
}
