import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  badge?: string;
  tags?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  name,
  price,
  location,
  beds,
  baths,
  sqft,
  badge,
  tags = [],
  isVerified = false,
  isFeatured = false
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Link to={`/property/${id}`} className="block">
      <div className="bg-white border border-[#E6E0DA] rounded-2xl overflow-hidden hover:shadow-[0px_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer relative">

        {/* Featured Ribbon */}
        {isFeatured && (
          <div className="absolute top-0 right-0 z-10 w-32 h-32 overflow-hidden pointer-events-none">
            <div className="bg-[#D4755B] text-white text-[10px] font-bold py-1 px-10 text-center uppercase tracking-tighter rotate-45 translate-x-10 translate-y-3 shadow-sm">
              Featured
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[340/220] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Badge & Verified Status */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {badge && (
              <div className={`px-2.5 py-1 rounded-lg text-white font-manrope text-[10px] font-bold shadow-lg ${badge === 'HOT' ? 'bg-[#D4755B]' :
                  badge === 'SOLD' ? 'bg-gray-800' :
                    'bg-[#10B981]'
                }`}>
                {badge}
              </div>
            )}
            {isVerified && (
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/20">
                <span className="material-icons text-[#10B981] text-[14px]">verified</span>
                <span className="text-[#111827] font-manrope font-bold text-[10px] uppercase">Verified</span>
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md group/fav"
          >
            <span className={`material-icons text-lg transition-all ${isFavorite
              ? 'text-[#D4755B]'
              : 'text-[#6B7280]'
              }`}>
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Info Bar */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1">
              <span className="font-space-mono font-bold text-xl text-[#111827]">Rs.</span>
              <span className="font-space-mono font-bold text-2xl text-[#111827]">{price}</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-syne font-bold text-lg text-[#111827] mb-1 group-hover:text-[#D4755B] transition-colors truncate">
            {name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 mb-6">
            <span className="material-icons text-[#94A3B8] text-sm">location_on</span>
            <span className="font-manrope text-sm text-[#64748B] truncate">{location}</span>
          </div>

          {/* Specs Grid (Magicbricks style) */}
          <div className="flex items-center justify-between py-4 border-t border-[#F1F5F9]">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[#475569]">
                <span className="material-icons text-sm">bed</span>
                <span className="font-space-mono font-bold text-sm tracking-tighter">{beds}</span>
              </div>
              <span className="text-[10px] text-[#94A3B8] uppercase font-manrope">Beds</span>
            </div>
            <div className="w-[1px] h-6 bg-[#F1F5F9]" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[#475569]">
                <span className="material-icons text-sm">bathtub</span>
                <span className="font-space-mono font-bold text-sm tracking-tighter">{baths}</span>
              </div>
              <span className="text-[10px] text-[#94A3B8] uppercase font-manrope">Baths</span>
            </div>
            <div className="w-[1px] h-6 bg-[#F1F5F9]" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[#475569]">
                <span className="material-icons text-sm">square_foot</span>
                <span className="font-space-mono font-bold text-sm tracking-tighter">{sqft.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-[#94A3B8] uppercase font-manrope">sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;