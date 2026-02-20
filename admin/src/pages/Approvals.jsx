import { useState, useEffect } from "react";
import {
    CheckCircle2, XCircle, Search, Home, MapPin,
    Building2, RefreshCw, Eye, ExternalLink
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../config/constants";
import { formatPrice } from "../lib/utils";

const Approvals = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPendingProperties = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token"); // Use stored token
            const response = await axios.get(`${backendurl}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Wait, admin stats doesn't return the properties list.
            // I should use the products list with status=pending.
            const propertiesResponse = await axios.get(`${backendurl}/api/products/list?status=pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (propertiesResponse.data.success) {
                setProperties(propertiesResponse.data.property);
            }
        } catch (error) {
            console.error("Error fetching pending properties:", error);
            toast.error("Failed to fetch pending properties");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (propertyId, status, title) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${backendurl}/api/admin/properties/status`,
                { propertyId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success(`Property "${title}" ${status} successfully`);
                setProperties(properties.filter(p => p._id !== propertyId));
            }
        } catch (error) {
            console.error(`Error ${status} property:`, error);
            toast.error(`Failed to ${status} property`);
        }
    };

    useEffect(() => {
        fetchPendingProperties();
    }, []);

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FAF8F4]">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#D4755B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#5A5856] font-medium">Loading pending approvals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#FAF8F4]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1C1B1A] mb-1">Pending Approvals</h1>
                        <p className="text-[#5A5856] text-sm">
                            Verify and approve new property listings
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchPendingProperties}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E6D5C3] text-[#1C1B1A] rounded-xl text-sm font-medium hover:border-[#D4755B] transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search pending properties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white border border-[#E6D5C3] rounded-xl text-sm focus:border-[#D4755B] outline-none transition-all"
                    />
                </div>

                {/* List */}
                {filteredProperties.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#E6D5C3]">
                        <div className="w-16 h-16 bg-[#F5F1E8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-[#D4755B]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1C1B1A] mb-2">All caught up!</h3>
                        <p className="text-sm text-[#9CA3AF]">No properties are currently awaiting approval.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProperties.map((property) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-4 rounded-2xl border border-[#E6D5C3] shadow-sm hover:shadow-card transition-all flex flex-col md:flex-row items-center gap-6"
                            >
                                {/* Image */}
                                <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-[#F5F1E8] flex-shrink-0">
                                    <img
                                        src={property.image?.[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-[#1C1B1A] text-white text-[10px] font-bold uppercase rounded">
                                            {property.type}
                                        </span>
                                        <span className="text-[#D4755B] font-bold text-lg">
                                            {formatPrice(property.price)}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-[#1C1B1A] text-lg mb-1 truncate">
                                        {property.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-[#5A5856] mb-3">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="truncate">{property.location}</span>
                                    </div>

                                    {/* Info Tags */}
                                    <div className="flex gap-4 text-xs text-[#9CA3AF]">
                                        <span>{property.beds} Beds</span>
                                        <span>{property.baths} Baths</span>
                                        <span>{property.sqft} sqft</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleStatusUpdate(property._id, 'approved', property.title)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(property._id, 'rejected', property.title)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-all"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                    <a
                                        href={`https://merobhumi.com/property/${property._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 bg-[#FAF8F4] text-[#5A5856] rounded-xl hover:text-[#D4755B] transition-all"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Approvals;
