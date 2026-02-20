import React from 'react';

interface StitchProfileSidebarProps {
    onLogout: () => void;
    onNavigate: (tab: string) => void;
    activeTab: string;
}

const StitchProfileSidebar: React.FC<StitchProfileSidebarProps> = ({ onLogout, onNavigate, activeTab }) => {
    const links = [
        { icon: 'person', label: 'Personal Profile' },
        { icon: 'other_houses', label: 'My Listings' },
        { icon: 'contact_mail', label: 'Received Leads' },
        { icon: 'send', label: 'Sent Inquiries' },
        { icon: 'favorite', label: 'Favorites' },
        { icon: 'settings', label: 'Account Settings' },
    ];

    return (
        <aside className="hidden lg:block lg:col-span-1 font-stitch-display">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
                <nav className="flex flex-col text-left">
                    {links.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => onNavigate(link.label)}
                            className={`p-4 flex items-center gap-3 transition-colors w-full text-left ${activeTab === link.label ? 'bg-stitch-primary/10 text-stitch-primary border-r-4 border-stitch-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined">{link.icon}</span>
                            <span className="text-sm">{link.label}</span>
                        </button>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                    <button
                        onClick={onLogout}
                        className="p-4 flex items-center gap-3 text-stitch-accent-red hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-bold">Logout</span>
                    </button>
                </nav>
            </div>

            <div className="mt-6 bg-blue-600 rounded-xl p-5 text-white text-left shadow-lg">
                <h4 className="font-bold mb-2">Need a Home Loan?</h4>
                <p className="text-xs text-blue-100 mb-4 leading-relaxed">Get pre-approved in minutes with our banking partners in Nepal.</p>
                <button
                    onClick={() => alert('Home Loan application feature is coming soon!')}
                    className="bg-white text-blue-600 w-full py-2.5 rounded-lg font-bold text-xs hover:bg-blue-50 transition-colors"
                >
                    Apply Now
                </button>
            </div>
        </aside>
    );
};

export default StitchProfileSidebar;
