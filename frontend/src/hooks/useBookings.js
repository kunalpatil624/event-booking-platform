import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Fetch user's bookings
export function useMyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/bookings/my`, { withCredentials: true });
            if (data.success) setBookings(data.bookings);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings, loading, refetch: fetchBookings };
}

// Fetch vendor's bookings + update status
export function useVendorBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/bookings/vendor`, { withCredentials: true });
            if (data.success) setBookings(data.bookings);
        } catch (error) {
            console.error('Failed to fetch vendor bookings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const updateStatus = async (id, status) => {
        try {
            const { data } = await axios.put(`${API_URL}/bookings/${id}/status`, { status }, { withCredentials: true });
            if (data.success) {
                toast.success(`Booking ${status}`);
                setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
                return data;
            }
        } catch (error) {
            toast.error('Failed to update booking');
        }
    };

    return { bookings, loading, updateStatus, refetch: fetchBookings };
}
