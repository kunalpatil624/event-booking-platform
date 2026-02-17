'use client';
import Link from 'next/link';
import { HiLocationMarker, HiMail, HiPhone } from 'react-icons/hi';

export default function Footer() {
    return (
        <footer className="bg-bg-secondary border-t border-border-default pt-16">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] max-md:grid-cols-2 gap-10 max-md:gap-8 pb-12">
                    <div className="max-md:col-span-2">
                        <h3 className="text-2xl font-extrabold text-white mb-3">
                            Event<span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Book</span>
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-5">
                            Madhya Pradesh&apos;s #1 Event Venue Booking Platform. Discover, compare, and book your dream venue for every celebration.
                        </p>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2 text-text-muted text-sm">
                                <HiLocationMarker className="text-primary-light text-base shrink-0" />
                                <span>Bhopal, Madhya Pradesh</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-muted text-sm">
                                <HiMail className="text-primary-light text-base shrink-0" />
                                <span>hello@eventbook.in</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-muted text-sm">
                                <HiPhone className="text-primary-light text-base shrink-0" />
                                <span>+91 98765 43210</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <h4 className="text-[0.95rem] font-semibold text-white mb-1.5">Quick Links</h4>
                        <Link href="/venues" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">All Venues</Link>
                        <Link href="/venues?featured=true" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Featured</Link>
                        <Link href="/venues?venueType=marriage-garden" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Marriage Gardens</Link>
                        <Link href="/venues?venueType=banquet" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Banquet Halls</Link>
                        <Link href="/venues?venueType=resort" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Resorts</Link>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <h4 className="text-[0.95rem] font-semibold text-white mb-1.5">Cities</h4>
                        <Link href="/venues?city=Bhopal" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Bhopal</Link>
                        <Link href="/venues?city=Indore" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Indore</Link>
                        <Link href="/venues?city=Jabalpur" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Jabalpur</Link>
                        <Link href="/venues?city=Gwalior" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Gwalior</Link>
                        <Link href="/venues?city=Ujjain" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Ujjain</Link>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <h4 className="text-[0.95rem] font-semibold text-white mb-1.5">Support</h4>
                        <Link href="/about" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">About Us</Link>
                        <Link href="/contact" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Contact</Link>
                        <Link href="/privacy" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Privacy Policy</Link>
                        <Link href="/terms" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">Terms of Service</Link>
                        <Link href="/faq" className="text-text-secondary text-sm hover:text-primary-light hover:pl-1 transition-all duration-300">FAQs</Link>
                    </div>
                </div>

                <div className="flex items-center justify-between max-md:flex-col max-md:gap-2 max-md:text-center py-5 border-t border-border-default text-text-muted text-xs">
                    <p>© 2026 EventBook. All rights reserved.</p>
                    <p>Made with ❤️ in Madhya Pradesh</p>
                </div>
            </div>
        </footer>
    );
}
