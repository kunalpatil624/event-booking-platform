import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/HomePage/Home';
import Login from './pages/Auth/Login';
import Venues from './pages/Venues/Venues';
import VenueDetail from './pages/Venues/VenueDetail';
import VendorLogin from './pages/Vendor/VendorLogin';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import AddVenue from './pages/Vendor/AddVenue';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Profile from './pages/Profile/Profile';

function App() {
    return (
        <>
            <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' } }} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/venues" element={<Venues />} />
                <Route path="/venues/:id" element={<VenueDetail />} />
                <Route path="/vendor" element={<VendorLogin />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/add-venue" element={<AddVenue />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}

export default App;
