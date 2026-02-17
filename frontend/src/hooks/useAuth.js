import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function useAuth() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
            if (data.success) {
                setUser(data.user);
                return data.user;
            }
            setUser(null);
            return null;
        } catch {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = useCallback(async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
        } catch { /* ignore */ }
        setUser(null);
        navigate('/');
    }, [navigate]);

    const login = async (payload) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, payload, { withCredentials: true });
            if (data.success) {
                setUser(data.user);
                return data;
            }
        } catch (error) {
            throw error;
        }
    };

    const register = async (payload) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, payload, { withCredentials: true });
            if (data.success) {
                setUser(data.user);
                return data;
            }
        } catch (error) {
            throw error;
        }
    };

    const updateProfile = async (formData) => {
        try {
            const { data } = await axios.put(`${API_URL}/auth/profile`, formData, { withCredentials: true });
            if (data.success) {
                setUser(data.user);
                toast.success('Profile updated successfully');
                return data;
            }
        } catch (error) {
            console.error('Update profile failed:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
            throw error;
        }
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const isVendor = user?.role === 'vendor';

    return { user, setUser, loading, isAuthenticated, isAdmin, isVendor, logout, login, register, updateProfile, fetchUser };
}
