import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, MapPin, Maximize, Upload,
    CheckCircle2, ChevronRight, ChevronLeft,
    Smartphone, IndianRupee, Bed, Bath,
    Info, ShieldCheck, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageTransition from '../components/common/PageTransition';
import { useAuth } from '../contexts/AuthContext';
import { propertiesAPI, adminAPI, plansAPI } from '../services/api';
import axios from 'axios';
import { backendurl } from '../config/constants';
import PaymentModal from '../components/common/PaymentModal';
import PropertyMapSelector from '../components/properties/PropertyMapSelector';

const steps = [
    { id: 1, title: 'Category', icon: Home },
    { id: 2, title: 'Details', icon: Info },
    { id: 3, title: 'Photos', icon: Upload },
    { id: 4, title: 'Plan', icon: Zap },
];

const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa', 'Land'];
const AVAILABILITY_TYPES = ['sale', 'rent'];

export default function PostPropertyPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [formData, setFormData] = useState<{
        title: string;
        type: string;
        availability: string;
        price: string;
        location: string;
        description: string;
        beds: string;
        baths: string;
        sqft: string;
        phone: string;
        googleMapLink: string;
        amenities: string[];
        images: File[];
        coordinates: { lat: number; lng: number } | null;
    }>({
        title: '',
        type: 'House',
        availability: 'sale',
        price: '',
        location: '',
        description: '',
        beds: '',
        baths: '',
        sqft: '',
        phone: '',
        googleMapLink: '',
        amenities: [],
        images: [],
        coordinates: null
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast.error('Please sign in to post a property');
            navigate('/signin', { state: { returnTo: location.pathname }, replace: true });
            return;
        }

        const fetchPlans = async () => {
            try {
                const response = await plansAPI.getAll();
                if (response.data.success) {
                    setPlans(response.data.plans);
                }
            } catch (err) {
                console.error('Error fetching plans:', err);
            }
        };
        if (isAuthenticated) fetchPlans();
    }, [isAuthenticated, authLoading, navigate, location]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
                <div className="w-12 h-12 border-4 border-[#D4755B] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 4) {
            toast.error('Maximum 4 images allowed');
            return;
        }
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const removeImage = (index: number) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleInitialSubmit = () => {
        if (!selectedPlan) {
            toast.error('Please select a plan to continue');
            setCurrentStep(4);
            return;
        }

        if (selectedPlan.price > 0) {
            setIsPaymentModalOpen(true);
        } else {
            executeSubmission();
        }
    };

    const validateForm = () => {
        const requiredFields = ['title', 'location', 'price', 'type', 'availability', 'description', 'phone'];
        for (const field of requiredFields) {
            if (!formData[field as keyof typeof formData]) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }

        if (formData.images.length === 0) {
            toast.error('At least one image is required');
            return false;
        }

        const numericFields = ['price', 'beds', 'baths', 'sqft'];
        for (const field of numericFields) {
            const val = formData[field as keyof typeof formData];
            if (val === undefined || val === null || val === '') {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }

        return true;
    };

    const executeSubmission = async () => {
        if (!selectedPlan) {
            toast.error('Please select a plan');
            return;
        }

        if (!validateForm()) return;

        setLoading(true);
        try {
            // 1. Subscribe to plan
            await plansAPI.subscribe(selectedPlan._id);

            // 2. Upload property
            const data = new FormData();

            console.log('Submitting property with formData:', formData);

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') {
                    (value as File[]).forEach((img, i) => data.append(`image${i + 1}`, img));
                } else if (key === 'amenities') {
                    (value as string[]).forEach((a, i) => data.append(`amenities[${i}]`, a));
                } else if (key === 'coordinates') {
                    if (value) data.append('coordinates', JSON.stringify(value));
                } else {
                    data.append(key, String(value ?? ''));
                }
            });

            // Ensure numeric defaults if still missing (fallback)
            ['beds', 'baths', 'sqft'].forEach(field => {
                if (!data.has(field)) data.append(field, '0');
            });

            const response = await propertiesAPI.add(data);

            if (response.data.success) {
                toast.success('Property submitted for approval!');
                navigate('/profile');
            }
        } catch (error: any) {
            console.error('Error submitting:', error);
            const errMsg = error.response?.data?.message || 'Submission failed';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition className="min-h-screen bg-[#FAF8F4]">
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-[#1C1B1A] mb-4">
                            Sell or Rent Your Property
                        </h1>
                        <p className="font-manrope text-[#5A5856] text-lg">
                            Reach thousands of potential buyers in Nepal.
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex justify-between mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#E6D5C3] -translate-y-1/2 z-0" />
                        {steps.map((step) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= step.id ? 'bg-[#D4755B] text-white' : 'bg-[#FAF8F4] border-2 border-[#E6D5C3] text-[#9CA3AF]'
                                    }`}>
                                    <step.icon size={20} />
                                </div>
                                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${currentStep >= step.id ? 'text-[#D4755B]' : 'text-[#9CA3AF]'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-xl overflow-hidden min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="p-8 md:p-12"
                                >
                                    <h2 className="text-2xl font-bold text-[#1C1B1A] mb-8">What are you listing?</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-[#1C1B1A] uppercase tracking-wider">Property Type</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {PROPERTY_TYPES.map(type => (
                                                    <button
                                                        key={type} onClick={() => setFormData({ ...formData, type })}
                                                        className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${formData.type === type ? 'border-[#D4755B] bg-[#D4755B]/5 text-[#D4755B]' : 'border-[#E6D5C3] text-[#5A5856] hover:border-[#D4755B]/50'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-[#1C1B1A] uppercase tracking-wider">I want to...</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {AVAILABILITY_TYPES.map(type => (
                                                    <button
                                                        key={type} onClick={() => setFormData({ ...formData, availability: type })}
                                                        className={`p-4 rounded-xl border-2 transition-all font-bold text-sm capitalize ${formData.availability === type ? 'border-[#D4755B] bg-[#D4755B]/5 text-[#D4755B]' : 'border-[#E6D5C3] text-[#5A5856] hover:border-[#D4755B]/50'
                                                            }`}
                                                    >
                                                        {type === 'sale' ? 'Sell' : type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="p-8 md:p-12 space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-[#1C1B1A] mb-4">Property Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#1C1B1A]">Property Title</label>
                                            <input
                                                name="title" value={formData.title} onChange={handleInputChange}
                                                className="w-full p-4 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none focus:border-[#D4755B]"
                                                placeholder="e.g. Modern Villa in Baneshwor"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#1C1B1A]">Price (NPR)</label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                                                <input
                                                    name="price" value={formData.price} onChange={handleInputChange} type="number"
                                                    className="w-full p-4 pl-12 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none focus:border-[#D4755B]"
                                                    placeholder="50,000,000"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#1C1B1A]">Location</label>
                                            <input
                                                name="location" value={formData.location} onChange={handleInputChange}
                                                className="w-full p-4 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none focus:border-[#D4755B] mb-2"
                                                placeholder="e.g. Kathmandu, Nepal"
                                            />
                                            <PropertyMapSelector
                                                onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, coordinates: { lat, lng } }))}
                                                initialLocation={formData.coordinates || undefined}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#1C1B1A]">Contact Phone</label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                                                <input
                                                    name="phone" value={formData.phone} onChange={handleInputChange}
                                                    className="w-full p-4 pl-12 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none focus:border-[#D4755B]"
                                                    placeholder="98XXXXXXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1C1B1A]">Beds</label>
                                            <input name="beds" value={formData.beds} onChange={handleInputChange} type="number" className="w-full p-4 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none" placeholder="3" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1C1B1A]">Baths</label>
                                            <input name="baths" value={formData.baths} onChange={handleInputChange} type="number" className="w-full p-4 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none" placeholder="2" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1C1B1A]">Sqft</label>
                                            <input name="sqft" value={formData.sqft} onChange={handleInputChange} type="number" className="w-full p-4 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none" placeholder="1200" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="p-8 md:p-12 space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-[#1C1B1A] mb-4">Upload Photos</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {previewUrls.map((url, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E6D5C3]">
                                                <img src={url} className="w-full h-full object-cover" alt="Preview" />
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <ChevronLeft className="rotate-45" size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {previewUrls.length < 4 && (
                                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-[#E6D5C3] rounded-2xl bg-[#FAF8F4] cursor-pointer hover:border-[#D4755B] transition-all">
                                                <Upload className="text-[#9CA3AF] mb-2" size={24} />
                                                <span className="text-xs font-bold text-[#9CA3AF]">Add Photo</span>
                                                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#1C1B1A]">Property Description</label>
                                        <textarea
                                            name="description" value={formData.description} onChange={handleInputChange} rows={5}
                                            className="w-full p-4 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl outline-none focus:border-[#D4755B] resize-none"
                                            placeholder="Tell buyers more about your property..."
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 4 && (
                                <motion.div
                                    key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="p-8 md:p-12 space-y-8"
                                >
                                    <h2 className="text-2xl font-bold text-[#1C1B1A] mb-4">Choose Your Plan</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {plans.map(plan => (
                                            <div
                                                key={plan._id}
                                                onClick={() => setSelectedPlan(plan)}
                                                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${selectedPlan?._id === plan._id ? 'border-[#D4755B] bg-[#D4755B]/5 ring-4 ring-[#D4755B]/10' : 'border-[#E6D5C3] hover:border-[#D4755B]/30'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-xl font-bold text-[#1C1B1A]">{plan.name}</h3>
                                                    <div className={`p-2 rounded-lg ${selectedPlan?._id === plan._id ? 'bg-[#D4755B] text-white' : 'bg-[#FAF8F4] text-[#9CA3AF]'}`}>
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-black text-[#D4755B] mb-6">
                                                    Rs. {plan.price.toLocaleString()}
                                                    <span className="text-xs text-[#9CA3AF] font-medium ml-1">/ {plan.durationDays} days</span>
                                                </div>
                                                <ul className="space-y-3">
                                                    <li className="flex items-center gap-3 text-sm font-medium text-[#5A5856]">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        {plan.listingLimit} Property Listings
                                                    </li>
                                                    <li className="flex items-center gap-3 text-sm font-medium text-[#5A5856]">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        {plan.featuredLimit} Featured Slots
                                                    </li>
                                                    <li className="flex items-center gap-3 text-sm font-medium text-[#5A5856]">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        Validity: {plan.durationDays} Days
                                                    </li>
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer Buttons */}
                        <div className="p-8 bg-[#FAF8F4] border-t border-[#E6D5C3] flex justify-between gap-4">
                            <button
                                onClick={prevStep} disabled={currentStep === 1 || loading}
                                className="flex items-center gap-2 px-8 py-3 bg-white border border-[#E6D5C3] text-[#1C1B1A] rounded-xl font-bold hover:bg-[#F5F1E8] transition-all disabled:opacity-50"
                            >
                                <ChevronLeft size={20} />
                                Back
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-10 py-3 bg-[#1C1B1A] text-white rounded-xl font-bold hover:bg-[#D4755B] transition-all shadow-lg overflow-hidden"
                                >
                                    Next Step
                                    <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleInitialSubmit} disabled={loading}
                                    className="flex items-center gap-2 px-10 py-3 bg-[#D4755B] text-white rounded-xl font-bold hover:bg-[#C05E44] transition-all shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Property'}
                                    <CheckCircle2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                planName={selectedPlan?.name}
                amount={selectedPlan?.price}
                onSuccess={executeSubmission}
            />

            <Footer />
        </PageTransition>
    );
}
