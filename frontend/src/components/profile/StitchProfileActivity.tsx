import React, { useState } from 'react';
import { Property } from '../../pages/PropertiesPage';
import StitchPropertyCardVertical from '../properties/StitchPropertyCardVertical';
import StitchPropertyCardHorizontal from '../properties/StitchPropertyCardHorizontal';

interface StitchProfileActivityProps {
    myListings: Property[];
    receivedInquiries: any[];
    sentInquiries: any[];
    activeView?: string;
    onDeleteListing?: (id: string) => void;
}

const StitchProfileActivity: React.FC<StitchProfileActivityProps> = ({ myListings, receivedInquiries, sentInquiries, activeView, onDeleteListing }) => {
    const [activeTab, setActiveTab] = useState('listings');

    React.useEffect(() => {
        if (activeView === 'Favorites') setActiveTab('saved');
        if (activeView === 'Personal Profile') setActiveTab('activity');
        if (activeView === 'My Listings') setActiveTab('listings');
        if (activeView === 'Received Leads') setActiveTab('leads');
        if (activeView === 'Sent Inquiries') setActiveTab('contacted');
    }, [activeView]);

    const tabs = [
        { id: 'activity', label: 'My Activity' },
        { id: 'saved', label: 'Saved Properties' },
        { id: 'contacted', label: `Contacted Owners (${sentInquiries.length})` },
        { id: 'listings', label: `Manage My Properties (${myListings.length})` },
        { id: 'leads', label: `Leads Received (${receivedInquiries.length})` },
    ];

    return (
        <div className="lg:col-span-3 font-stitch-display">
            <div className="bg-white dark:bg-slate-900 rounded-t-xl border border-b-0 border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? 'border-stitch-primary text-stitch-primary' : 'border-transparent text-slate-500 hover:text-stitch-primary'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-xl shadow-sm p-6 text-left">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {activeView === 'Account Settings' ? 'Account Settings' :
                                activeTab === 'listings' ? `Manage My Properties (${myListings.length})` :
                                    activeTab === 'leads' ? `Leads Received (${receivedInquiries.length})` :
                                        activeTab === 'contacted' ? `Contacted Owners (${sentInquiries.length})` :
                                            'Saved Properties (0)'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {activeView === 'Account Settings' ? 'Manage your account security and notifications' :
                                activeTab === 'listings' ? 'View and manage your posted listings' :
                                    activeTab === 'leads' ? 'Inquiries from interested buyers' :
                                        activeTab === 'contacted' ? 'Properties you have inquired about' :
                                            'Listings you\'ve marked as favorites'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeView !== 'Account Settings' && (
                            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-stitch-primary transition-colors">
                                <span className="material-symbols-outlined">sort</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {activeView === 'Account Settings' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Security</h4>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:border-stitch-primary outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">New Password</label>
                                            <input type="password" placeholder="Min. 8 characters" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:border-stitch-primary outline-none transition-all" />
                                        </div>
                                        <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all w-full md:w-auto">Update Password</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Email Notifications</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'New Property Alerts', desc: 'Get notified when a property matching your search is posted' },
                                            { label: 'Agent Inquiries', desc: 'Get notified when an agent or owner messages you' },
                                            { label: 'Marketing Updates', desc: 'Stay updated with Nepal\'s real estate trends' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{item.label}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                                                </div>
                                                <div className="w-10 h-5 bg-stitch-primary rounded-full relative cursor-pointer shadow-inner">
                                                    <div className="absolute right-1 top-1 size-3 bg-white rounded-full shadow-sm"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'listings' && myListings.length > 0 ? (
                                myListings.map((prop) => (
                                    <div key={prop._id} className="relative group">
                                        <StitchPropertyCardHorizontal property={prop} />
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-white/90 backdrop-blur shadow-sm p-2 rounded-full text-blue-600 hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button
                                                onClick={() => onDeleteListing?.(prop._id!)}
                                                className="bg-white/90 backdrop-blur shadow-sm p-2 rounded-full text-red-600 hover:scale-110 transition-transform"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : activeTab === 'leads' && receivedInquiries.length > 0 ? (
                                receivedInquiries.map((inquiry) => (
                                    <div key={inquiry._id} className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-lg transition-all group">
                                        <div className="size-12 md:size-16 rounded-xl bg-stitch-primary/10 flex items-center justify-center text-stitch-primary shrink-0">
                                            <span className="material-symbols-outlined text-2xl md:text-3xl">person</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                                                <div>
                                                    <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">{inquiry.buyerName}</h4>
                                                    <div className="flex gap-3 text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                                        <span>{inquiry.buyerPhone}</span>
                                                        <span>•</span>
                                                        <span className="lowercase">{inquiry.buyerEmail}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                    {inquiry.status}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic mb-4">"{inquiry.message}"</p>
                                            <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Interested in:</div>
                                                <div className="text-xs font-bold text-stitch-primary">{inquiry.property?.title}</div>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2 justify-center">
                                            <a href={`tel:${inquiry.buyerPhone}`} className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-xl">call</span>
                                            </a>
                                            <a href={`mailto:${inquiry.buyerEmail}`} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-xl">mail</span>
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : activeTab === 'contacted' && sentInquiries.length > 0 ? (
                                sentInquiries.map((inquiry) => (
                                    <div key={inquiry._id} className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-lg transition-all group">
                                        <div className="size-12 md:size-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                            <span className="material-symbols-outlined text-2xl md:text-3xl">home</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                                                <div>
                                                    <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">{inquiry.property?.title || 'Unknown Property'}</h4>
                                                    <div className="flex gap-3 text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                                        <span>{inquiry.property?.location || 'Nepal'}</span>
                                                        <span>•</span>
                                                        <span>Rs. {inquiry.property?.price || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                    Sent
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic mb-4">You messaged: "{inquiry.message}"</p>
                                            <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Date sent:</div>
                                                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{new Date(inquiry.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2 justify-center">
                                            <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">View Property</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">
                                        {activeView === 'Property Alerts' ? 'notifications_paused' :
                                            activeView === 'My Reviews' ? 'rate_review' : 'empty_dashboard'}
                                    </span>
                                    <p className="text-slate-500 font-bold">
                                        {activeView === 'Property Alerts' ? 'You have no active property alerts' :
                                            activeView === 'My Reviews' ? 'You haven\'t written any reviews yet' :
                                                'No records found for this section'}
                                    </p>
                                    {activeTab === 'listings' && activeView !== 'Property Alerts' && activeView !== 'My Reviews' && (
                                        <button className="mt-4 bg-stitch-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Post a Property</button>
                                    )}
                                    {activeView === 'Property Alerts' && (
                                        <button className="mt-4 bg-stitch-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Create New Alert</button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {activeTab === 'listings' && myListings.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <button className="text-stitch-primary font-bold text-sm border-2 border-stitch-primary/20 px-8 py-2.5 rounded-lg hover:bg-stitch-primary/5 transition-colors">Load More</button>
                    </div>
                )}
            </div>
        </div >
    );
};

export default StitchProfileActivity;
