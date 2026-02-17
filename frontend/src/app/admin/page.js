'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiShieldCheck, HiArrowLeft } from 'react-icons/hi';
import styles from './admin.module.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Demo login check
        if (formData.email === 'admin@eventbook.com' && formData.password === 'admin123') {
            localStorage.setItem('adminToken', 'demo-admin-token');
            localStorage.setItem('adminUser', JSON.stringify({ name: 'Admin', email: formData.email, role: 'admin' }));
            router.push('/admin/dashboard');
        } else {
            setError('Invalid admin credentials');
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
                className={styles.card}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.iconWrapper}>
                    <HiShieldCheck />
                </div>

                <h1 className={styles.title}>Admin Panel</h1>
                <p className={styles.subtitle}>Sign in to access the admin dashboard</p>

                {error && (
                    <motion.div className={styles.errorBox} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputField}>
                        <HiMail className={styles.inputIcon} />
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.inputField}>
                        <HiLockClosed className={styles.inputIcon} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <HiEyeOff /> : <HiEye />}
                        </button>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? (
                            <span className={styles.spinner} />
                        ) : (
                            <>
                                <HiShieldCheck /> Sign In as Admin
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.demoCredentials}>
                    <p className={styles.demoLabel}>Demo Credentials:</p>
                    <p>Email: <strong>admin@eventbook.com</strong></p>
                    <p>Password: <strong>admin123</strong></p>
                </div>

                <div className={styles.otherLinks}>
                    <Link href="/vendor" className={styles.linkBtn}>Login as Venue Owner →</Link>
                    <Link href="/login" className={styles.linkBtn}>Login as User →</Link>
                </div>
            </motion.div>
        </div>
    );
}
