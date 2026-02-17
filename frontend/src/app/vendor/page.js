'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiOfficeBuilding, HiArrowLeft, HiUser, HiPhone } from 'react-icons/hi';
import styles from './vendor.module.css';

export default function VendorLoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (isLogin) {
            // Demo login check
            if (formData.email === 'vendor@eventbook.com' && formData.password === 'vendor123') {
                localStorage.setItem('vendorToken', 'demo-vendor-token');
                localStorage.setItem('vendorUser', JSON.stringify({ name: 'Rajesh Sharma', email: formData.email, role: 'vendor' }));
                router.push('/vendor/dashboard');
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } else {
            // Demo register
            localStorage.setItem('vendorToken', 'demo-vendor-token');
            localStorage.setItem('vendorUser', JSON.stringify({ name: formData.name, email: formData.email, role: 'vendor' }));
            router.push('/vendor/dashboard');
        }
        setLoading(false);
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
                {/* Left Panel */}
                <div className={styles.leftPanel}>
                    <div className={styles.brandSection}>
                        <h1 className={styles.brandName}>Event<span>Book</span></h1>
                        <p className={styles.brandTagline}>Venue Owner Portal</p>
                    </div>
                    <div className={styles.benefits}>
                        <h3>Why list your venue?</h3>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>📈</span>
                            <div>
                                <h4>Increase Bookings</h4>
                                <p>Get discovered by 50,000+ monthly visitors looking for venues</p>
                            </div>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>💰</span>
                            <div>
                                <h4>Zero Listing Fee</h4>
                                <p>List your venue for free. Pay only a small commission on bookings</p>
                            </div>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>📊</span>
                            <div>
                                <h4>Dashboard & Analytics</h4>
                                <p>Track bookings, revenue, reviews, and manage your venue easily</p>
                            </div>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>🛡️</span>
                            <div>
                                <h4>Secure Payments</h4>
                                <p>Payments processed securely and transferred directly to your account</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className={styles.rightPanel}>
                    <div className={styles.formHeader}>
                        <div className={styles.iconCircle}>
                            <HiOfficeBuilding />
                        </div>
                        <h2>{isLogin ? 'Venue Owner Login' : 'Register Your Venue'}</h2>
                        <p>{isLogin ? 'Access your venue management dashboard' : 'Join EventBook and start getting bookings'}</p>
                    </div>

                    <div className={styles.tabSwitch}>
                        <button className={`${styles.switchBtn} ${isLogin ? styles.activeSwitch : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>Login</button>
                        <button className={`${styles.switchBtn} ${!isLogin ? styles.activeSwitch : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>Register</button>
                    </div>

                    {error && (
                        <motion.div className={styles.errorBox} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {!isLogin && (
                            <>
                                <div className={styles.inputField}>
                                    <HiUser className={styles.inputIcon} />
                                    <input type="text" placeholder="Full Name / Business Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className={styles.inputField}>
                                    <HiPhone className={styles.inputIcon} />
                                    <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
                                </div>
                            </>
                        )}

                        <div className={styles.inputField}>
                            <HiMail className={styles.inputIcon} />
                            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>

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

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? (
                                <span className={styles.spinner} />
                            ) : (
                                <>
                                    <HiOfficeBuilding /> {isLogin ? 'Sign In' : 'Register as Venue Owner'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.demoCredentials}>
                        <p className={styles.demoLabel}>Demo Credentials:</p>
                        <p>Email: <strong>vendor@eventbook.com</strong></p>
                        <p>Password: <strong>vendor123</strong></p>
                    </div>

                    <div className={styles.otherLinks}>
                        <Link href="/admin">Admin Login →</Link>
                        <Link href="/login">Customer Login →</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
