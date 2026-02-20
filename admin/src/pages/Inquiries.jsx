import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, User, Home, Check, Clock, Loader2,
    Filter, Search, Mail, Phone, Calendar, ChevronDown,
    ArrowUpRight, AlertCircle, ExternalLink, RefreshCcw, X
} from "lucide-react";
import { toast } from "sonner";
import { backendurl } from "../config/constants";
import { cn, formatDate } from "../lib/utils";

const STATUS_CONFIG = {
    new: { label: "New Lead", className: "bg-blue-50 text-blue-700 border border-blue-200" },
    contacted: { label: "Contacted", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    closed: { label: "Closed", className: "bg-slate-50 text-slate-700 border border-slate-200" },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || { label: status, className: "bg-gray-100 text-gray-700" };
    return (
        <span className={cn("px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-widest", config.className)}>
            {config.label}
        </span>
    );
};

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backendurl} /api/inquiries / all`, {
                headers: { Authorization: `Bearer ${token} ` },
            });
            if (response.data.success) {
                setInquiries(response.data.inquiries);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching inquiries:", error);
            toast.error("Failed to load inquiries");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id);
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `${backendurl} /api/inquiries / ${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success(`Inquiry marked as ${newStatus}`);
                setInquiries(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Status update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const filteredInquiries = inquiries.filter((item) => {
        const propertyTitle = item.property?.title || "";
        const buyerName = item.buyerName || "";
        const sellerName = item.seller?.name || "Admin/System";

        const matchesSearch =
            !searchTerm ||
            propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sellerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === "all" || item.status === filter;

        return matchesSearch && matchesFilter;
    });

    const counts = {
        all: inquiries.length,
        new: inquiries.filter((a) => a.status === "new").length,
        contacted: inquiries.filter((a) => a.status === "contacted").length,
        closed: inquiries.filter((a) => a.status === "closed").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FAF8F4]">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#D4755B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#5A5856] font-medium">Loading marketplace leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#FAF8F4] font-manrope">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-bold text-[#1C1B1A] flex items-center gap-3">
                            <div className="p-2 bg-[#D4755B] rounded-xl shadow-lg shadow-terracotta/20">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            Global Inquiries
                        </h1>
                        <p className="text-[#5A5856] mt-1 ml-12">Monitor and manage every lead across the Merobhumi marketplace</p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchInquiries}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#E6D5C3] text-sm font-bold text-[#5A5856] hover:bg-[#F5F1E8] transition-all self-start md:self-center"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Refresh
                    </motion.button>
                </div>

                {/* Filter Bar */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 border border-[#E6D5C3] shadow-card mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F4] p-1.5 rounded-2xl border border-[#F5F1E8]">
                            {["all", "new", "contacted", "closed"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                                        filter === s
                                            ? "bg-[#1C1B1A] text-white shadow-lg shadow-black/10"
                                            : "text-[#9CA3AF] hover:text-[#1C1B1A] hover:bg-white"
                                    )}
                                >
                                    {s}
                                    <span className={cn(
                                        "ml-2 px-1.5 py-0.5 rounded-md text-[10px]",
                                        filter === s ? "bg-white/20" : "bg-[#E6D5C3]/50"
                                    )}>
                                        {counts[s]}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <input
                                type="text"
                                placeholder="Search leads, property or contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#FAF8F4] border border-[#E6D5C3] rounded-2xl text-sm outline-none focus:border-[#D4755B] focus:ring-4 focus:ring-[#D4755B]/10 transition-all font-medium"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Desktop Table */}
                <div className="bg-white rounded-[2rem] border border-[#E6D5C3] shadow-card overflow-hidden hidden xl:block">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#1C1B1A]">
                                {["Property", "Buyer Details", "Owned By", "Message", "Status", "Actions"].map((h) => (
                                    <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F1E8]">
                            <AnimatePresence mode="popLayout">
                                {filteredInquiries.map((item) => (
                                    <motion.tr
                                        layout
                                        key={item._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="hover:bg-[#FAF8F4] group transition-all duration-200"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#1C1B1A] line-clamp-1 group-hover:text-[#D4755B] transition-colors">{item.property?.title || 'Unknown Property'}</span>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-[#9CA3AF]">
                                                    <Home className="w-3 h-3" />
                                                    {item.property?.location || 'Nepal'}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center">
                                                        <User className="w-3 h-3 text-blue-500" />
                                                    </div>
                                                    <span className="text-sm font-bold text-[#1C1B1A]">{item.buyerName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-[#5A5856]">
                                                    <Mail className="w-3 h-3 text-[#9CA3AF]" />
                                                    {item.buyerEmail}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-[#5A5856]">
                                                    <Phone className="w-3 h-3 text-[#9CA3AF]" />
                                                    {item.buyerPhone}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-emerald-50 rounded-md flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                    </div>
                                                    <span className="text-sm font-bold text-[#1C1B1A]">{item.seller?.name || 'Admin'}</span>
                                                </div>
                                                <span className="text-[10px] text-[#9CA3AF] mt-1 italic">{item.seller?.email || 'System Owned'}</span>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="max-w-[200px]">
                                                <p className="text-xs text-[#5A5856] italic line-clamp-2 leading-relaxed font-medium">"{item.message}"</p>
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] uppercase font-black tracking-widest text-[#9CA3AF]">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <StatusBadge status={item.status} />
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {updatingId === item._id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-[#D4755B]" />
                                                ) : (
                                                    <>
                                                        {item.status === 'new' && (
                                                            <button
                                                                onClick={() => handleStatusChange(item._id, 'contacted')}
                                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                                title="Mark as Contacted"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {item.status !== 'closed' && (
                                                            <button
                                                                onClick={() => handleStatusChange(item._id, 'closed')}
                                                                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                                title="Close Lead"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                <a
                                                    href={`mailto:${item.buyerEmail}`}
                                                    className="p-2 bg-[#F5F1E8] text-[#5A5856] rounded-lg hover:bg-[#D4755B] hover:text-white transition-all shadow-sm"
                                                    title="Email Buyer"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mobile / Tablet Cards */}
                <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredInquiries.map((item) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-3xl border border-[#E6D5C3] shadow-card relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <StatusBadge status={item.status} />
                                <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{formatDate(item.createdAt)}</span>
                            </div>

                            <h3 className="text-lg font-black text-[#1C1B1A] mb-1 line-clamp-1">{item.property?.title || 'Unknown Property'}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-[#5A5856] font-bold mb-4">
                                <Home className="w-3.5 h-3.5 text-[#D4755B]" />
                                {item.property?.location}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-[#1C1B1A]">{item.buyerName}</div>
                                        <div className="text-xs font-semibold text-[#9CA3AF]">{item.buyerEmail}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#F5F1E8] mb-6">
                                <p className="text-xs italic text-[#5A5856] font-medium leading-relaxed">"{item.message}"</p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <a href={`mailto:${item.buyerEmail}`} className="flex-1 bg-[#1C1B1A] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-center hover:bg-[#D4755B] transition-all">Reply via Email</a>
                                <button className="px-5 py-3 border border-[#E6D5C3] rounded-xl text-[#5A5856] hover:bg-[#F5F1E8] transition-all">
                                    <Phone className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredInquiries.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-[#F5F1E8] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <MessageSquare className="w-10 h-10 text-[#E6D5C3]" />
                        </div>
                        <h3 className="text-xl font-black text-[#1C1B1A] mb-2 uppercase tracking-tight">No leads found</h3>
                        <p className="text-[#9CA3AF] max-w-sm mx-auto font-medium">There are no inquiries matching your current criteria. Check back later or adjust your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inquiries;
