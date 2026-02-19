import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User as UserIcon, Settings, Clock,
    CheckCircle, XCircle, Home, MapPin,
    ChevronRight, LayoutDashboard, CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageTransition from '../components/common/PageTransition';
import { propertiesAPI } from '../services/api';
import { formatPrice } from '../lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/signin', { state: { returnTo: location.pathname }, replace: true });
            return;
        }

        const fetchMyListings = async () => {
            try {
                const response = await propertiesAPI.getMyListings();
                if (response.data.success) {
                    setListings(response.data.property);
                }
            } catch (err) {
                console.error('Error fetching listings:', err);
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated) fetchMyListings();
    }, [isAuthenticated, authLoading, navigate, location]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
                <div className="w-12 h-12 border-4 border-[#D4755B] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100"><CheckCircle size={12} /> Approved</span>;
            case 'rejected':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <PageTransition className="min-h-screen bg-[#FAF8F4]">
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl border border-[#E6D5C3] p-8 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-[#D4755B] rounded-2xl flex items-center justify-center text-white mb-4">
                                    <UserIcon size={32} />
                                </div>
                                <h2 className="font-fraunces text-xl font-bold text-[#1C1B1A]">{user?.name}</h2>
                                <p className="font-manrope text-[#9CA3AF] text-sm mb-6">{user?.email}</p>

                                <div className="w-full space-y-2">
                                    <button className="w-full flex items-center justify-between p-3 bg-[#D4755B] text-white rounded-xl text-sm font-bold shadow-md">
                                        <span className="flex items-center gap-2"><LayoutDashboard size={18} /> My Listings</span>
                                        <ChevronRight size={16} />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 text-[#5A5856] hover:bg-[#F5F1E8] rounded-xl text-sm font-bold transition-all">
                                        <span className="flex items-center gap-2"><CreditCard size={18} /> Subscriptions</span>
                                        <ChevronRight size={16} />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 text-[#5A5856] hover:bg-[#F5F1E8] rounded-xl text-sm font-bold transition-all">
                                        <span className="flex items-center gap-2"><Settings size={18} /> Settings</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Summary Card */}
                        <div className="bg-[#1C1B1A] rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-1">Active Plan</h3>
                                {(user as any)?.activeSubscription?.plan ? (
                                    <>
                                        <div className="text-xl font-bold mb-4">Pro Partner</div>
                                        <div className="space-y-2 text-xs text-[#E6D5C3]">
                                            <p>Used: 2 / 10 Listings</p>
                                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-[#D4755B] h-full" style={{ width: '20%' }} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium text-[#E6D5C3]">No active subscription</p>
                                        <Link to="/post-property" className="block text-center py-2 bg-[#D4755B] rounded-lg text-xs font-bold uppercase tracking-wider">Upgrade Now</Link>
                                    </div>
                                )}
                            </div>
                            <div className="absolute -right-8 -bottom-8 bg-[#D4755B]/10 w-32 h-32 rounded-full blur-2xl" />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="font-fraunces text-3xl font-bold text-[#1C1B1A]">My Property Listings</h1>
                            <Link
                                to="/post-property"
                                className="px-6 py-2 bg-[#D4755B] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                            >
                                + Add New
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-[#E6D5C3]">
                                <div className="w-10 h-10 border-4 border-[#D4755B] border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-[#9CA3AF] text-sm font-medium">Fetching your listings...</p>
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-[#E6D5C3] text-center p-8">
                                <div className="w-16 h-16 bg-[#F5F1E8] rounded-2xl flex items-center justify-center text-[#9CA3AF] mb-4">
                                    <Home size={32} />
                                </div>
                                <h3 className="font-bold text-[#1C1B1A] mb-2">No listings yet</h3>
                                <p className="text-sm text-[#9CA3AF] mb-6">You haven't posted any properties for sale or rent yet.</p>
                                <Link to="/post-property" className="px-8 py-3 bg-[#1C1B1A] text-white rounded-xl font-bold">Start Listing</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {listings.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-4 rounded-3xl border border-[#E6D5C3] hover:border-[#D4755B] transition-all flex flex-col sm:flex-row items-center gap-6"
                                    >
                                        <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-[#F5F1E8] flex-shrink-0">
                                            <img src={item.image?.[0]} className="w-full h-full object-cover" alt={item.title} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <StatusBadge status={item.status} />
                                                <span className="text-[#D4755B] font-bold text-lg">{formatPrice(item.price)}</span>
                                            </div>
                                            <h3 className="font-bold text-[#1C1B1A] text-lg truncate mb-1">{item.title}</h3>
                                            <p className="text-[#9CA3AF] text-sm flex items-center gap-1 mb-4">
                                                <MapPin size={14} /> {item.location}
                                            </p>

                                            <div className="flex gap-4">
                                                <Link to={`/property/${item._id}`} className="text-xs font-bold text-[#D4755B] hover:underline uppercase tracking-wider">Preview</Link>
                                                <button className="text-xs font-bold text-[#5A5856] hover:underline uppercase tracking-wider">Edit</button>
                                                <button className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wider">Delete</button>
                                            </div>
                                        </div>

                                        <div className="hidden sm:flex flex-col items-end gap-2 pr-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Views</span>
                                            <span className="text-xl font-fraunces font-bold text-[#1C1B1A]">0</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <Footer />
        </PageTransition>
    );
}
