import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { HiArrowLeft, HiOfficeBuilding, HiLocationMarker, HiCurrencyRupee, HiUsers, HiPhotograph, HiCheck, HiPlus, HiTrash, HiX } from 'react-icons/hi';
import { useVenueActions } from '../../hooks/useVenues';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const venueTypes = ['banquet', 'lawn', 'resort', 'hotel', 'farmhouse', 'community-hall', 'marriage-garden'];
const occasionsList = ['wedding', 'reception', 'engagement', 'birthday', 'corporate', 'conference', 'party', 'anniversary', 'other'];

const emptyFormData = {
    name: '',
    description: '',
    venueType: 'banquet',
    occasions: [],
    city: '',
    area: '',
    address: '',
    capacity: { min: 50, max: 500 },
    startingPrice: '',
    pricePerPlate: '',
    amenities: {
        parking: false,
        ac: false,
        wifi: false,
        dj: false,
        cateringAvailable: false,
        decorationAvailable: false,
        alcoholAllowed: false,
        rooms: 0
    },
    images: [],
    packages: [],
    foodMenu: []
};

export default function AddVenue() {
    const navigate = useNavigate();
    const { id: venueId } = useParams();
    const isEditMode = Boolean(venueId);
    const { createVenue, updateVenue, uploadImages } = useVenueActions();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetchingVenue, setFetchingVenue] = useState(false);
    const [formData, setFormData] = useState({ ...emptyFormData });

    // Fetch venue data when editing
    useEffect(() => {
        if (isEditMode && venueId) {
            const fetchVenue = async () => {
                setFetchingVenue(true);
                try {
                    const { data } = await axios.get(`${API_URL}/venues/${venueId}`, { withCredentials: true });
                    if (data.success && data.venue) {
                        const v = data.venue;
                        setFormData({
                            name: v.name || '',
                            description: v.description || '',
                            venueType: v.venueType || 'banquet',
                            occasions: v.occasions || [],
                            city: v.city || '',
                            area: v.area || '',
                            address: v.address || '',
                            capacity: {
                                min: v.capacity?.min || 50,
                                max: v.capacity?.max || 500
                            },
                            startingPrice: v.startingPrice || '',
                            pricePerPlate: v.pricePerPlate || '',
                            amenities: {
                                parking: v.amenities?.parking || false,
                                ac: v.amenities?.ac || false,
                                wifi: v.amenities?.wifi || false,
                                dj: v.amenities?.dj || false,
                                cateringAvailable: v.amenities?.cateringAvailable || false,
                                decorationAvailable: v.amenities?.decorationAvailable || false,
                                alcoholAllowed: v.amenities?.alcoholAllowed || false,
                                rooms: v.amenities?.rooms || 0
                            },
                            images: v.images?.map(img => typeof img === 'string' ? img : img.url) || [],
                            packages: v.packages?.map(p => ({
                                name: p.name || '',
                                price: p.price || '',
                                description: p.description || '',
                                includes: Array.isArray(p.includes) ? p.includes.join(', ') : (p.includes || '')
                            })) || [],
                            foodMenu: v.foodMenu || []
                        });
                    }
                } catch (err) {
                    toast.error('Failed to load venue details');
                    navigate('/vendor/dashboard');
                } finally {
                    setFetchingVenue(false);
                }
            };
            fetchVenue();
        }
    }, [isEditMode, venueId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Package Handlers
    const addPackage = () => {
        setFormData(prev => ({
            ...prev,
            packages: [...prev.packages, { name: '', price: '', description: '', includes: '' }]
        }));
    };

    const updatePackage = (index, field, value) => {
        const newPackages = [...formData.packages];
        newPackages[index][field] = value;
        setFormData(prev => ({ ...prev, packages: newPackages }));
    };

    const removePackage = (index) => {
        setFormData(prev => ({
            ...prev,
            packages: prev.packages.filter((_, i) => i !== index)
        }));
    };

    // Food Menu Handlers
    const addMenuCategory = () => {
        setFormData(prev => ({
            ...prev,
            foodMenu: [...prev.foodMenu, { category: '', items: [] }]
        }));
    };

    const updateMenuCategory = (index, value) => {
        const newMenu = [...formData.foodMenu];
        newMenu[index].category = value;
        setFormData(prev => ({ ...prev, foodMenu: newMenu }));
    };

    const addMenuItem = (catIndex) => {
        const newMenu = [...formData.foodMenu];
        newMenu[catIndex].items.push({ name: '', price: '', isVeg: true });
        setFormData(prev => ({ ...prev, foodMenu: newMenu }));
    };

    const updateMenuItem = (catIndex, itemIndex, field, value) => {
        const newMenu = [...formData.foodMenu];
        newMenu[catIndex].items[itemIndex][field] = value;
        setFormData(prev => ({ ...prev, foodMenu: newMenu }));
    };

    const removeMenuItem = (catIndex, itemIndex) => {
        const newMenu = [...formData.foodMenu];
        newMenu[catIndex].items = newMenu[catIndex].items.filter((_, i) => i !== itemIndex);
        setFormData(prev => ({ ...prev, foodMenu: newMenu }));
    };

    const removeMenuCategory = (index) => {
        setFormData(prev => ({
            ...prev,
            foodMenu: prev.foodMenu.filter((_, i) => i !== index)
        }));
    };

    const handleArrayToggle = (item, arrayName) => {
        setFormData(prev => {
            const array = prev[arrayName];
            return {
                ...prev,
                [arrayName]: array.includes(item)
                    ? array.filter(i => i !== item)
                    : [...array, item]
            };
        });
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const data = await uploadImages(files);

            if (data && data.success) {
                const newUrls = data.images.map(img => img.url);
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...newUrls]
                }));
                toast.success('Images uploaded successfully');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Format data for backend
            const payload = {
                ...formData,
                images: formData.images.filter(url => url && url.trim() !== '').map((url, i) => ({ url, isMain: i === 0 })),
                startingPrice: Number(formData.startingPrice),
                pricePerPlate: Number(formData.pricePerPlate) || 0,
                capacity: {
                    min: Number(formData.capacity.min),
                    max: Number(formData.capacity.max)
                },
                amenities: {
                    ...formData.amenities,
                    rooms: Number(formData.amenities.rooms)
                },
                packages: formData.packages.map(p => ({
                    ...p,
                    price: Number(p.price),
                    includes: typeof p.includes === 'string' ? p.includes.split(',').map(s => s.trim()).filter(Boolean) : p.includes
                })),
                foodMenu: formData.foodMenu.map(cat => ({
                    ...cat,
                    items: cat.items.map(item => ({
                        ...item,
                        price: Number(item.price)
                    }))
                }))
            };

            let data;
            if (isEditMode) {
                data = await updateVenue(venueId, payload);
            } else {
                data = await createVenue(payload);
            }

            if (data && data.success) {
                toast.success(isEditMode ? 'Venue updated successfully!' : 'Venue listed successfully!');
                navigate('/vendor/dashboard');
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(isEditMode ? 'Failed to update venue' : 'Failed to list venue');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full px-4 py-3 bg-white/[0.03] border border-border-default rounded-xl text-white text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(108,60,225,0.15)] transition-all";
    const labelCls = "block text-sm font-medium text-text-muted mb-2";

    if (fetchingVenue) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted">Loading venue details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary pb-20 pt-10">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/vendor/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors">
                    <HiArrowLeft /> Back to Dashboard
                </Link>

                <div className="bg-bg-card border border-border-default rounded-2xl overflow-hidden">
                    <div className={`p-8 border-b border-border-default bg-gradient-to-r ${isEditMode ? 'from-accent-emerald/10 to-transparent' : 'from-primary/10 to-transparent'}`}>
                        <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Venue' : 'List Your Venue'}</h1>
                        <p className="text-text-muted mt-1">{isEditMode ? 'Update your venue details below' : 'Fill in the details to start accepting bookings'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Basic Info */}
                        <div className="space-y-6 mb-8">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm">1</span>
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
                                <div className="col-span-2">
                                    <label className={labelCls}>Venue Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. Royal Palace Garden" required />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelCls}>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputCls} min-h-[100px]`} placeholder="Describe your venue..." required />
                                </div>
                                <div>
                                    <label className={labelCls}>Venue Type</label>
                                    <select name="venueType" value={formData.venueType} onChange={handleChange} className={inputCls} required>
                                        {venueTypes.map(t => <option key={t} value={t} className="bg-bg-card">{t.replace('-', ' ').toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>Suitable for Occasions</label>
                                <div className="flex flex-wrap gap-3">
                                    {occasionsList.map(occ => (
                                        <button
                                            key={occ}
                                            type="button"
                                            onClick={() => handleArrayToggle(occ, 'occasions')}
                                            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${formData.occasions.includes(occ)
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-transparent text-text-secondary border-border-default hover:border-text-muted'
                                                }`}
                                        >
                                            {occ.charAt(0).toUpperCase() + occ.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-6 mb-8 pt-8 border-t border-border-default">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm">2</span>
                                Location
                            </h3>
                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
                                <div><label className={labelCls}>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className={inputCls} required /></div>
                                <div><label className={labelCls}>Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className={inputCls} required /></div>
                                <div className="col-span-2"><label className={labelCls}>Full Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className={inputCls} required /></div>
                            </div>
                        </div>

                        {/* Pricing & Capacity */}
                        <div className="space-y-6 mb-8 pt-8 border-t border-border-default">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm">3</span>
                                Pricing & Capacity
                            </h3>
                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
                                <div><label className={labelCls}>Starting Price (₹)</label><input type="number" name="startingPrice" value={formData.startingPrice} onChange={handleChange} className={inputCls} required /></div>
                                <div><label className={labelCls}>Price Per Plate (₹)</label><input type="number" name="pricePerPlate" value={formData.pricePerPlate} onChange={handleChange} className={inputCls} /></div>
                                <div><label className={labelCls}>Min Capacity</label><input type="number" name="capacity.min" value={formData.capacity.min} onChange={handleChange} className={inputCls} required /></div>
                                <div><label className={labelCls}>Max Capacity</label><input type="number" name="capacity.max" value={formData.capacity.max} onChange={handleChange} className={inputCls} required /></div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-6 mb-8 pt-8 border-t border-border-default">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm">4</span>
                                Amenities
                            </h3>
                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                                {Object.keys(formData.amenities).map(key => {
                                    if (key === 'rooms') return null;
                                    return (
                                        <label key={key} className="flex items-center gap-3 p-4 bg-white/[0.03] border border-border-default rounded-xl cursor-pointer hover:bg-white/[0.06] transition-all">
                                            <input
                                                type="checkbox"
                                                name={`amenities.${key}`}
                                                checked={formData.amenities[key]}
                                                onChange={handleChange}
                                                className="w-5 h-5 accent-primary rounded"
                                            />
                                            <span className="text-white text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </label>
                                    );
                                })}
                                <div><label className={labelCls}>Number of Rooms</label><input type="number" name="amenities.rooms" value={formData.amenities.rooms} onChange={handleChange} className={inputCls} /></div>
                            </div>
                        </div>

                        {/* Packages */}
                        <div className="space-y-6 mb-8 pt-8 border-t border-border-default">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm">5</span>
                                Packages & Pricing
                            </h3>
                            <div className="space-y-4">
                                {formData.packages.map((pkg, index) => (
                                    <div key={index} className="p-4 bg-white/[0.03] border border-border-default rounded-xl space-y-3 relative">
                                        <button type="button" onClick={() => removePackage(index)} className="absolute top-2 right-2 text-text-muted hover:text-red-400"><HiTrash /></button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" value={pkg.name} onChange={(e) => updatePackage(index, 'name', e.target.value)} placeholder="Package Name" className={inputCls} required />
                                            <input type="number" value={pkg.price} onChange={(e) => updatePackage(index, 'price', e.target.value)} placeholder="Price (₹)" className={inputCls} required />
                                        </div>
                                        <input type="text" value={pkg.description} onChange={(e) => updatePackage(index, 'description', e.target.value)} placeholder="Short Description" className={inputCls} />
                                        <input type="text" value={pkg.includes} onChange={(e) => updatePackage(index, 'includes', e.target.value)} placeholder="Includes (comma separated, e.g. Decor, Food, DJ)" className={inputCls} />
                                    </div>
                                ))}
                                <button type="button" onClick={addPackage} className="flex items-center gap-2 text-primary-light text-sm font-medium hover:text-white transition-colors">
                                    <HiPlus /> Add Package
                                </button>
                            </div>
                        </div>

                        {/* Food Menu */}
                        <div className="space-y-6 mb-8 pt-8 border-t border-border-default">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm">6</span>
                                Food Menu
                            </h3>
                            <div className="space-y-6">
                                {formData.foodMenu.map((cat, i) => (
                                    <div key={i} className="p-5 bg-white/[0.03] border border-border-default rounded-xl relative">
                                        <button type="button" onClick={() => removeMenuCategory(i)} className="absolute top-3 right-3 text-text-muted hover:text-red-400"><HiTrash /></button>
                                        <input type="text" value={cat.category} onChange={(e) => updateMenuCategory(i, e.target.value)} placeholder="Menu Category (e.g. Starters, Main Course)" className={`${inputCls} mb-4 font-bold`} required />

                                        <div className="space-y-3 pl-4 border-l-2 border-border-default">
                                            {cat.items.map((item, j) => (
                                                <div key={j} className="flex gap-2 items-center">
                                                    <input type="text" value={item.name} onChange={(e) => updateMenuItem(i, j, 'name', e.target.value)} placeholder="Item Name" className="flex-1 px-3 py-2 bg-white/5 border border-border-default rounded-lg text-white text-sm outline-none" required />
                                                    <input type="number" value={item.price} onChange={(e) => updateMenuItem(i, j, 'price', e.target.value)} placeholder="Price" className="w-20 px-3 py-2 bg-white/5 border border-border-default rounded-lg text-white text-sm outline-none" />
                                                    <select value={item.isVeg} onChange={(e) => updateMenuItem(i, j, 'isVeg', e.target.value === 'true')} className="px-2 py-2 bg-white/5 border border-border-default rounded-lg text-white text-xs outline-none">
                                                        <option value="true">Veg</option>
                                                        <option value="false">Non-Veg</option>
                                                    </select>
                                                    <button type="button" onClick={() => removeMenuItem(i, j)} className="text-text-muted hover:text-red-400"><HiX /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addMenuItem(i)} className="text-xs text-primary-light hover:text-white flex items-center gap-1">+ Add Item</button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addMenuCategory} className="flex items-center gap-2 text-primary-light text-sm font-medium hover:text-white transition-colors">
                                    <HiPlus /> Add Menu Category
                                </button>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-6 mb-8 pt-8 border-t border-border-default">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm">7</span>
                                Photos
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-border-default rounded-xl cursor-pointer hover:bg-white/10 transition-all text-white text-sm font-medium">
                                        <HiPhotograph className="text-lg" />
                                        <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                    <span className="text-text-muted text-xs">Supported: JPG, PNG, WEBP (Max 5MB)</span>
                                </div>

                                {formData.images.filter(url => url).length > 0 && (
                                    <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-4 mt-4">
                                        {formData.images.filter(url => url).map((url, index) => (
                                            <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-border-default bg-black/20">
                                                <img src={url} alt={`Venue ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <HiTrash />
                                                </button>
                                                {index === 0 && <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded uppercase">Cover</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border-default flex gap-4 justify-end">
                            <Link to="/vendor/dashboard" className="px-6 py-3 rounded-xl border border-border-default text-text-secondary font-medium hover:text-white hover:border-white/20 transition-all">Cancel</Link>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className={`px-8 py-3 rounded-xl text-white font-semibold hover:-translate-y-0.5 transition-all disabled:opacity-50 ${isEditMode
                                    ? 'bg-gradient-to-r from-accent-emerald to-teal-500 shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)]'
                                    : 'bg-gradient-to-r from-primary to-primary-light shadow-[0_4px_15px_rgba(108,60,225,0.4)] hover:shadow-[0_6px_25px_rgba(108,60,225,0.5)]'
                                    }`}
                            >
                                {loading
                                    ? (isEditMode ? 'Updating Venue...' : 'Listing Venue...')
                                    : (isEditMode ? 'Update Venue' : 'List Venue')
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
