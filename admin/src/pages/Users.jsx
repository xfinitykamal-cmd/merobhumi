import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users as UsersIcon, User, Mail, Phone, MapPin,
    Shield, Calendar, Search, Filter, Loader2,
    RefreshCcw, MoreVertical, Trash2, Edit, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { backendurl } from "../config/constants";
import { cn, formatDate } from "../lib/utils";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backendurl}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load user list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            !searchTerm ||
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === "all" || u.role === filterRole;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FAF8F4]">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#D4755B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#5A5856] font-medium">Loading participants...</p>
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
                                <UsersIcon className="w-6 h-6 text-white" />
                            </div>
                            User Management
                        </h1>
                        <p className="text-[#5A5856] mt-1 ml-12">Oversee all registered members and their roles</p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchUsers}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#E6D5C3] text-sm font-bold text-[#5A5856] hover:bg-[#F5F1E8] transition-all self-start md:self-center"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Refresh List
                    </motion.button>
                </div>

                {/* Filters */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 border border-[#E6D5C3] shadow-card mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-full lg:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#FAF8F4] border border-[#E6D5C3] rounded-2xl text-sm outline-none focus:border-[#D4755B] focus:ring-4 focus:ring-[#D4755B]/10 transition-all font-medium"
                                />
                            </div>

                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-3 bg-[#FAF8F4] border border-[#E6D5C3] rounded-2xl text-sm font-bold text-[#1C1B1A] outline-none focus:border-[#D4755B] transition-all"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>

                        <div className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest">
                            Showing {filteredUsers.length} of {users.length} members
                        </div>
                    </div>
                </motion.div>

                {/* Desktop Table */}
                <div className="bg-white rounded-[2rem] border border-[#E6D5C3] shadow-card overflow-hidden hidden xl:block">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#1C1B1A]">
                                {["Member", "Contact Info", "Role", "Joined Date", "Verified", "Actions"].map((h) => (
                                    <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F1E8]">
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map((u) => (
                                    <motion.tr
                                        layout
                                        key={u._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-[#FAF8F4] group transition-all duration-200"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#D4755B]/10 rounded-xl flex items-center justify-center font-black text-[#D4755B]">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#1C1B1A]">{u.name}</p>
                                                    <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">ID: {u._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-[#1C1B1A]">
                                                    <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                                    {u.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-[#5A5856]">
                                                    <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                                    {u.phone || "No phone"}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                u.role === "admin" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-50 text-blue-600 border border-blue-200"
                                            )}>
                                                {u.role}
                                            </span>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#5A5856]">
                                                <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            {u.isVerified ? (
                                                <div className="flex items-center gap-1.5 text-emerald-500">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Verified</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">unverified</span>
                                            )}
                                        </td>

                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-[#9CA3AF] hover:text-[#D4755B] hover:bg-[#D4755B]/10 rounded-lg transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Grid for Mobile */}
                <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUsers.map((u) => (
                        <div key={u._id} className="bg-white p-6 rounded-[2rem] border border-[#E6D5C3] shadow-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-[#D4755B] rounded-2xl flex items-center justify-center font-black text-white text-xl">
                                    {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#1C1B1A]">{u.name}</h3>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest mt-1 inline-block",
                                        u.role === "admin" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                    )}>
                                        {u.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-[#FAF8F4] rounded-xl">
                                    <Mail className="w-4 h-4 text-[#D4755B]" />
                                    <span className="text-sm font-bold text-[#1C1B1A]">{u.email}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#FAF8F4] rounded-xl">
                                    <Phone className="w-4 h-4 text-[#D4755B]" />
                                    <span className="text-sm font-bold text-[#1C1B1A]">{u.phone || "Not provided"}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#F5F1E8]">
                                <span className="text-xs font-bold text-[#9CA3AF]">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-[#F5F1E8] rounded-lg text-[#5A5856]"><Edit size={16} /></button>
                                    <button className="p-2 bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Users;
