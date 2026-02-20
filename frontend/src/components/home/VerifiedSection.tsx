import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../properties/PropertyCard';
import LoadingState from '../common/LoadingState';

const VerifiedSection: React.FC = () => {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVerified = async () => {
            try {
                const { data } = await propertiesAPI.getAll();
                if (data.success && data.property) {
                    // Filter only verified properties
                    const verified = data.property.filter((p: any) => p.isVerified).slice(0, 3);
                    setProperties(verified);
                }
            } catch (err) {
                console.error("Failed to fetch verified properties:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVerified();
    }, []);

    const formatPrice = (price: number): string => {
        const crore = price / 10000000;
        if (crore >= 1) {
            return `${crore.toFixed(2)} Cr`;
        }
        const lakhs = price / 100000;
        return `${lakhs.toFixed(0)} L`;
    };

    if (loading) return null; // Don't show loading on home if it's just one section
    if (properties.length === 0) return null;

    return (
        <section className="bg-white py-24">
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-icons text-[#10B981]">verified</span>
                            <span className="font-manrope font-bold text-[#10B981] text-sm uppercase tracking-widest">Trusted Listings</span>
                        </div>
                        <h2 className="font-syne font-bold text-5xl text-[#111827] leading-tight mb-4">
                            Verified by <span className="text-[#D4755B]">Merobhumi</span>
                        </h2>
                        <p className="font-manrope text-lg text-[#64748B]">
                            Every detail, every document. We personally verify these properties so you can buy with 100% confidence.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-[#D4755B] font-manrope font-bold hover:gap-4 transition-all">
                        View All Verified Listings
                        <span className="material-icons text-sm">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property, index) => (
                        <motion.div
                            key={property._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <PropertyCard
                                id={property._id}
                                image={property.image?.[0]}
                                name={property.title}
                                price={formatPrice(property.price)}
                                location={property.location}
                                beds={property.beds}
                                baths={property.baths}
                                sqft={property.sqft}
                                isVerified={true}
                                isFeatured={property.isFeatured}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VerifiedSection;
