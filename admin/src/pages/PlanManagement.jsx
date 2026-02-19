import { useState, useEffect } from "react";
import {
    Plus, Edit3, Trash2, ShieldCheck,
    Coins, Layout, Clock, Info, Save, X
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../config/constants";

const PlanManagement = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        listingLimit: "",
        featuredLimit: "0",
        durationDays: "30",
        description: ""
    });

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendurl}/api/plans/all`);
            if (response.data.success) {
                setPlans(response.data.plans);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
            toast.error("Failed to fetch plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                price: plan.price.toString(),
                listingLimit: plan.listingLimit.toString(),
                featuredLimit: plan.featuredLimit.toString(),
                durationDays: plan.durationDays.toString(),
                description: plan.description || ""
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: "",
                price: "",
                listingLimit: "",
                featuredLimit: "0",
                durationDays: "30",
                description: ""
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = editingPlan
                ? `${backendurl}/api/plans/update/${editingPlan._id}`
                : `${backendurl}/api/plans/add`;

            const method = editingPlan ? 'put' : 'post';

            const response = await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(editingPlan ? "Plan updated" : "Plan created");
                setShowModal(false);
                fetchPlans();
            }
        } catch (error) {
            console.error("Error saving plan:", error);
            toast.error("Failed to save plan");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this plan?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${backendurl}/api/plans/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Plan deleted");
                fetchPlans();
            }
        } catch (error) {
            toast.error("Failed to delete plan");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FAF8F4]">
                <div className="w-12 h-12 border-3 border-[#D4755B] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#FAF8F4]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1C1B1A] mb-1">Plan Management</h1>
                        <p className="text-[#5A5856] text-sm">Define subscription costs and listing limits</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#D4755B] text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-terracotta"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Plan
                    </button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan._id}
                            layout
                            className="bg-white p-6 rounded-2xl border border-[#E6D5C3] shadow-sm hover:shadow-card transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#FAF8F4] rounded-xl text-[#D4755B]">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleOpenModal(plan)} className="p-2 text-[#5A5856] hover:bg-[#FAF8F4] rounded-lg transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(plan._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#1C1B1A] mb-1">{plan.name}</h3>
                            <div className="text-3xl font-black text-[#D4755B] mb-4">
                                Rs. {plan.price.toLocaleString()}
                                <span className="text-xs text-[#9CA3AF] font-medium ml-1">/ {plan.durationDays} days</span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-[#F5F1E8]">
                                <div className="flex items-center gap-3 text-sm text-[#5A5856]">
                                    <Layout className="w-4 h-4 text-[#D4755B]" />
                                    <span>{plan.listingLimit} Property Listings</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#5A5856]">
                                    <Coins className="w-4 h-4 text-[#D4755B]" />
                                    <span>{plan.featuredLimit} Featured Slots</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#5A5856]">
                                    <Clock className="w-4 h-4 text-[#D4755B]" />
                                    <span>{plan.durationDays} Days Duration</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Create/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <form onSubmit={handleSubmit}>
                                    <div className="p-6 border-b border-[#F5F1E8] flex justify-between items-center bg-[#FAF8F4]">
                                        <h2 className="text-xl font-bold text-[#1C1B1A]">
                                            {editingPlan ? "Edit Plan" : "Create New Plan"}
                                        </h2>
                                        <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-lg transition-colors">
                                            <X className="w-5 h-5 text-[#9CA3AF]" />
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#1C1B1A] uppercase mb-1.5 ml-1">Plan Name</label>
                                            <input
                                                required type="text" value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl text-sm focus:border-[#D4755B] outline-none"
                                                placeholder="e.g. Professional Plan"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#1C1B1A] uppercase mb-1.5 ml-1">Price (Rs.)</label>
                                                <input
                                                    required type="number" value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl text-sm focus:border-[#D4755B] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#1C1B1A] uppercase mb-1.5 ml-1">Duration (Days)</label>
                                                <input
                                                    required type="number" value={formData.durationDays}
                                                    onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl text-sm focus:border-[#D4755B] outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#1C1B1A] uppercase mb-1.5 ml-1">Listing Limit</label>
                                                <input
                                                    required type="number" value={formData.listingLimit}
                                                    onChange={e => setFormData({ ...formData, listingLimit: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl text-sm focus:border-[#D4755B] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#1C1B1A] uppercase mb-1.5 ml-1">Featured Limit</label>
                                                <input
                                                    required type="number" value={formData.featuredLimit}
                                                    onChange={e => setFormData({ ...formData, featuredLimit: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl text-sm focus:border-[#D4755B] outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#1C1B1A] uppercase mb-1.5 ml-1">Description</label>
                                            <textarea
                                                value={formData.description} rows={3}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl text-sm focus:border-[#D4755B] outline-none resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-[#FAF8F4] border-t border-[#F5F1E8] flex gap-3">
                                        <button
                                            type="button" onClick={() => setShowModal(false)}
                                            className="flex-1 px-5 py-2.5 border border-[#E6D5C3] text-[#5A5856] rounded-xl text-sm font-bold hover:bg-white transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4755B] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-terracotta transition-all"
                                        >
                                            <Save className="w-4 h-4" />
                                            {editingPlan ? "Update Plan" : "Create Plan"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PlanManagement;
