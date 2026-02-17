'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff, HiArrowLeft } from 'react-icons/hi';
import styles from './login.module.css';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isLogin ? 'Login' : 'Register', formData);
    };

    return (
        <div className={styles.page}>
            <div className={styles.bgElements}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
                <div className={styles.gridPattern} />
            </div>

            <Link href="/" className={styles.backBtn}>
                <HiArrowLeft /> Back to Home
            </Link>

            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.leftPanel}>
                    <div className={styles.brandSection}>
                        <h1 className={styles.brandName}>Event<span>Book</span></h1>
                        <p className={styles.brandTagline}>Find & Book Perfect Event Venues</p>
                    </div>
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>🏰</span>
                            <div>
                                <h4>500+ Premium Venues</h4>
                                <p>Curated selection across MP</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>💰</span>
                            <div>
                                <h4>Best Price Guarantee</h4>
                                <p>Transparent pricing, no hidden charges</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>📅</span>
                            <div>
                                <h4>Instant Booking</h4>
                                <p>Real-time availability & confirmation</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>⭐</span>
                            <div>
                                <h4>Verified Reviews</h4>
                                <p>10,000+ genuine customer reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.formHeader}>
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Login to your account to manage bookings' : 'Join EventBook to start booking venues'}</p>
                    </div>

                    <div className={styles.tabSwitch}>
                        <button className={`${styles.switchBtn} ${isLogin ? styles.activeSwitch : ''}`} onClick={() => setIsLogin(true)}>Login</button>
                        <button className={`${styles.switchBtn} ${!isLogin ? styles.activeSwitch : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {!isLogin && (
                            <div className={styles.inputField}>
                                <HiUser className={styles.inputIcon} />
                                <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                        )}

                        <div className={styles.inputField}>
                            <HiMail className={styles.inputIcon} />
                            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>

                        {!isLogin && (
                            <div className={styles.inputField}>
                                <HiPhone className={styles.inputIcon} />
                                <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                            </div>
                        )}

                        <div className={styles.inputField}>
                            <HiLockClosed className={styles.inputIcon} />
                            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>

                        {isLogin && (
                            <div className={styles.options}>
                                <label className={styles.remember}><input type="checkbox" /> Remember me</label>
                                <Link href="/forgot-password" className={styles.forgot}>Forgot password?</Link>
                            </div>
                        )}

                        <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`}>
                            {isLogin ? 'Login' : 'Create Account'}
                        </button>

                        <div className={styles.dividerRow}>
                            <div className={styles.dividerLine} />
                            <span>or continue with</span>
                            <div className={styles.dividerLine} />
                        </div>

                        <button type="button" className={styles.googleBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Continue with Google
                        </button>
                    </form>

                    <p className={styles.switchText}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button className={styles.switchLink} onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>

                    <div className={styles.dividerRow}>
                        <div className={styles.dividerLine} />
                        <span>other portals</span>
                        <div className={styles.dividerLine} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Link href="/vendor" style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 500 }}>🏢 Venue Owner Login</Link>
                        <Link href="/admin" style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 500 }}>🛡️ Admin Login</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
