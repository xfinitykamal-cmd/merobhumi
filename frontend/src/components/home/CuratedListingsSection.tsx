import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import LoadingState from '../common/LoadingState';

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  sqft: number;
  availability: string;
  isVerified?: boolean;
}

const CuratedListingsSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await propertiesAPI.getAll();
        if (data.success && data.property) {
          setProperties(data.property.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch curated listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN');
  };

  if (loading) return <LoadingState message="Fetching curated listings..." />;
  if (properties.length === 0) return null;

  return (
    <section className="bg-[#F9F7F2] py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
          <path d="M0 0h20v20H0z" fill="#D4755B" opacity="0.05" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <div className="font-space-mono text-sm text-[#D4755B] uppercase tracking-widest mb-4">Exclusive Selection</div>
            <h2 className="font-fraunces text-5xl text-[#111827]">Curated Listings</h2>
          </div>

          <Link to="/properties" className="flex items-center gap-2 font-manrope font-bold text-[#D4755B] hover:gap-4 transition-all">
            View All Properties
            <span className="material-icons text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* Large Featured Property (Index 0) */}
          {properties[0] && (
            <Link to={`/property/${properties[0]._id}`} className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] relative group cursor-pointer border border-[#E6E0DA]">
              <div className="relative h-[500px]">
                <img
                  src={properties[0].image?.[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"}
                  alt={properties[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex gap-2 mb-4">
                    <div className="bg-[#D4755B] inline-block px-3 py-1 rounded text-white font-manrope font-bold text-xs uppercase shadow-sm">
                      {properties[0].availability || 'Sale'}
                    </div>
                    {properties[0].isVerified && (
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded flex items-center gap-1 shadow-sm">
                        <span className="material-icons text-[#10B981] text-xs">verified</span>
                        <span className="text-[#111827] font-manrope font-bold text-[10px] uppercase">Verified</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-fraunces text-3xl text-white mb-2">{properties[0].title}</h3>
                  <p className="font-manrope font-light text-white/80 mb-4">{properties[0].location}</p>
                  <div className="border-t border-white/20 pt-4 flex items-center justify-between">
                    <span className="font-space-mono text-white text-xl font-bold">Rs. {formatPrice(properties[0].price)}</span>
                    <div className="flex items-center gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm">bed</span>
                        <span className="font-space-mono text-sm">{properties[0].beds} Beds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm">square_foot</span>
                        <span className="font-space-mono text-sm">{properties[0].sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Small Property Card (Index 1) */}
          {properties[1] && (
            <Link to={`/property/${properties[1]._id}`} className="col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] relative group cursor-pointer border border-[#E6E0DA]">
              <div className="relative h-[500px]">
                <img
                  src={properties[1].image?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"}
                  alt={properties[1].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-[#D4755B] inline-block px-2 py-0.5 rounded text-white font-manrope font-bold text-[10px] mb-2 uppercase">
                    {properties[1].availability}
                  </div>
                  <h3 className="font-fraunces text-xl text-white mb-1 group-hover:text-[#D4755B] transition-colors">{properties[1].title}</h3>
                  <p className="font-manrope text-sm text-white/70 mb-3">{properties[1].location}</p>
                  <span className="font-space-mono text-lg text-white font-bold">Rs. {formatPrice(properties[1].price)}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Third Property (Index 2) */}
          {properties[2] && (
            <Link to={`/property/${properties[2]._id}`} className="col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] aspect-square relative group cursor-pointer border border-[#E6E0DA]">
              <div className="relative h-full">
                <img
                  src={properties[2].image?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"}
                  alt={properties[2].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-fraunces text-xl text-white mb-1 group-hover:text-[#D4755B] transition-colors">{properties[2].title}</h3>
                  <p className="font-manrope text-sm text-white/70 mb-3">{properties[2].location}</p>
                  <span className="font-space-mono text-lg text-white font-bold">Rs. {formatPrice(properties[2].price)}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Fourth Property (Index 3) */}
          {properties[3] && (
            <Link to={`/property/${properties[3]._id}`} className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] relative group cursor-pointer border border-[#E6E0DA]">
              <div className="relative h-[800px] md:h-auto md:aspect-[16/9]">
                <img
                  src={properties[3].image?.[0] || "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=800"}
                  alt={properties[3].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-fraunces text-2xl text-white mb-2 group-hover:text-[#D4755B] transition-colors">{properties[3].title}</h3>
                  <p className="font-manrope text-white/70 mb-6">{properties[3].location}</p>
                  <div className="border-t border-white/20 pt-6 flex items-center justify-between">
                    <span className="font-space-mono text-white text-xl font-bold">Rs. {formatPrice(properties[3].price)}</span>
                    <div className="text-white bg-[#D4755B] hover:bg-[#B86851] p-3 rounded-full transition-all shadow-lg">
                      <span className="material-icons text-2xl">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CuratedListingsSection;
