'use client';
import { motion } from 'framer-motion';
import VenueCard from './VenueCard';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';

const demoVenues = [
    {
        id: '1', name: 'Royal Palace Marriage Garden', city: 'Bhopal', area: 'MP Nagar',
        startingPrice: 150000, capacity: { min: 200, max: 2000 }, venueType: 'marriage-garden',
        rating: { average: 4.5, count: 128 }, featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', isMain: true }],
        amenities: { parking: true, ac: true, cateringAvailable: true, decorationAvailable: true }
    },
    {
        id: '2', name: 'Lakeside Resort & Convention', city: 'Bhopal', area: 'Shamla Hills',
        startingPrice: 200000, capacity: { min: 100, max: 1500 }, venueType: 'resort',
        rating: { average: 4.8, count: 89 }, featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', isMain: true }],
        amenities: { parking: true, ac: true, cateringAvailable: true, decorationAvailable: true }
    },
    {
        id: '3', name: 'Grand Imperial Banquet', city: 'Indore', area: 'Vijay Nagar',
        startingPrice: 100000, capacity: { min: 100, max: 800 }, venueType: 'banquet',
        rating: { average: 4.3, count: 215 }, featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800', isMain: true }],
        amenities: { parking: true, ac: true, cateringAvailable: true }
    },
    {
        id: '4', name: 'Heritage Hotel & Banquets', city: 'Ujjain', area: 'Freeganj',
        startingPrice: 80000, capacity: { min: 50, max: 600 }, venueType: 'hotel',
        rating: { average: 4.6, count: 74 }, featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', isMain: true }],
        amenities: { parking: true, ac: true, cateringAvailable: true, decorationAvailable: true }
    },
    {
        id: '5', name: 'Maharaja Convention Center', city: 'Jabalpur', area: 'Wright Town',
        startingPrice: 180000, capacity: { min: 300, max: 3000 }, venueType: 'community-hall',
        rating: { average: 4.0, count: 156 }, featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1431540015160-0400cf056e0e?w=800', isMain: true }],
        amenities: { parking: true, ac: true, cateringAvailable: true }
    },
    {
        id: '6', name: 'Green Valley Farmhouse', city: 'Indore', area: 'Rau',
        startingPrice: 50000, capacity: { min: 50, max: 500 }, venueType: 'farmhouse',
        rating: { average: 4.1, count: 67 },
        images: [{ url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800', isMain: true }],
        amenities: { parking: true, cateringAvailable: true, decorationAvailable: true }
    },
];

export default function FeaturedVenues() {
    return (
        <section className="py-20 max-md:py-12 bg-bg-primary">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="flex items-end justify-between mb-10 gap-6 max-md:flex-col max-md:items-start">
                    <div>
                        <span className="block text-primary-light text-sm font-semibold uppercase tracking-[0.15em] mb-2">Popular Choices</span>
                        <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent mb-2">Featured Venues</h2>
                        <p className="text-text-secondary text-[0.95rem]">Handpicked premium venues loved by thousands of happy customers</p>
                    </div>
                    <Link href="/venues?featured=true" className="inline-flex items-center gap-2 px-7 py-3 text-[0.95rem] font-semibold rounded-xl bg-white/[0.08] text-white border border-border-light backdrop-blur-lg hover:bg-white/[0.14] hover:border-primary-light hover:-translate-y-0.5 transition-all duration-300">
                        View All <HiArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1 gap-6">
                    {demoVenues.map((venue, i) => (
                        <VenueCard key={venue.id} venue={venue} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
