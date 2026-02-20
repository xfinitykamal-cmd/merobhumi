import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import { propertiesAPI, inquiryAPI } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

// Stitch Profile Components
import StitchProfileHeader from '../components/profile/StitchProfileHeader';
import StitchProfileSidebar from '../components/profile/StitchProfileSidebar';
import StitchProfileActivity from '../components/profile/StitchProfileActivity';
import StitchEditProfileModal from '../components/profile/StitchEditProfileModal';
import StitchDeleteConfirmModal from '../components/profile/StitchDeleteConfirmModal';
import StitchFooter from '../components/home/StitchFooter';
import { cn } from '../lib/utils';

export default function ProfilePage() {
    const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [listings, setListings] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [sentInquiries, setSentInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Personal Profile');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, listingId: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const { updateUser } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/signin', { state: { returnTo: location.pathname }, replace: true });
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [listingRes, inquiryRes, sentRes] = await Promise.all([
                    propertiesAPI.getMyListings(),
                    inquiryAPI.getMyLeads(),
                    inquiryAPI.getMySentInquiries()
                ]);

                if (listingRes.data.success) {
                    setListings(listingRes.data.property);
                }
                if (inquiryRes.data.success) {
                    setInquiries(inquiryRes.data.leads);
                }
                if (sentRes.data.success) {
                    setSentInquiries(sentRes.data.inquiries);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated) fetchDashboardData();
    }, [isAuthenticated, authLoading, navigate, location]);

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, listingId: id });
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await propertiesAPI.remove(deleteModal.listingId);
            if (response.data.success) {
                setListings(prev => prev.filter(p => p._id !== deleteModal.listingId));
                // Toast is handled by sonner usually, but let's be sure
                // import { toast } from 'sonner'; is needed
                setDeleteModal({ isOpen: false, listingId: '' });
            }
        } catch (err) {
            console.error('Delete Error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stitch-bg-light dark:bg-stitch-bg-dark">
                <div className="w-12 h-12 border-4 border-stitch-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stitch-bg-light dark:bg-stitch-bg-dark font-stitch-display">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-4 py-8">
                {/* Profile Summary Header */}
                <StitchProfileHeader
                    user={{
                        name: user?.name || 'User',
                        email: user?.email || '',
                        phone: (user as any)?.phone,
                        location: (user as any)?.location || 'Kathmandu, Nepal'
                    }}
                    onEdit={() => setIsEditModalOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <StitchProfileSidebar
                        onLogout={logout}
                        activeTab={activeTab}
                        onNavigate={setActiveTab}
                    />

                    {/* Mobile Navigation Tabs */}
                    <div className="lg:hidden col-span-1 mb-6 overflow-x-auto hide-scrollbar -mx-4 px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-20 z-10">
                        <div className="flex gap-4">
                            {[
                                { id: 'Personal Profile', icon: 'person' },
                                { id: 'My Listings', icon: 'other_houses' },
                                { id: 'Received Leads', icon: 'contact_mail' },
                                { id: 'Sent Inquiries', icon: 'send' },
                                { id: 'Favorites', icon: 'favorite' },
                                { id: 'Account Settings', icon: 'settings' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all",
                                        activeTab === tab.id
                                            ? "bg-stitch-primary text-white shadow-lg shadow-stitch-primary/20"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                    {tab.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content / Tabs */}
                    <StitchProfileActivity
                        myListings={listings}
                        receivedInquiries={inquiries}
                        sentInquiries={sentInquiries}
                        activeView={activeTab}
                        onDeleteListing={handleDeleteClick}
                    />
                </div>
            </main>

            <StitchEditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={{
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: (user as any)?.phone,
                    location: (user as any)?.location
                }}
                onUpdate={updateUser}
            />

            <StitchDeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, listingId: '' })}
                onConfirm={handleConfirmDelete}
                title="Delete Listing?"
                message="Are you sure you want to remove this property? This action cannot be undone."
                isDeleting={isDeleting}
            />

            <StitchFooter />
        </div>
    );
}
