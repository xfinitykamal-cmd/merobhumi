import React from 'react';

interface PropertyHeaderProps {
  status?: 'available' | 'sold' | 'pending';
  refNumber?: string;
  name?: string;
  location?: string;
  price?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  status = 'available',
  refNumber = '#AHM-SKT-402',
  name = 'Skyline Towers: 4BHK Apartment in Ahmedabad',
  location = 'Satellite, Gandhingar Highway, Ahmedabad',
  price = '75,00,000',
  beds = 4,
  baths = 4,
  sqft = 1200
}) => {
  const statusConfig = {
    available: {
      bg: 'bg-[#E0E8E3]',
      dotColor: 'bg-[#22C55E]',
      textColor: 'text-[#4A6356]',
      label: 'Available'
    },
    sold: {
      bg: 'bg-[#FEE2E2]',
      dotColor: 'bg-[#EF4444]',
      textColor: 'text-[#991B1B]',
      label: 'Sold'
    },
    pending: {
      bg: 'bg-[#FEF3C7]',
      dotColor: 'bg-[#F59E0B]',
      textColor: 'text-[#92400E]',
      label: 'Pending'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-white border-b border-[#F1F5F9]">
      <div className="max-w-[1280px] mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Left - Property Info */}
          <div className="flex-1">
            {/* Status Badge & Ref Number */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`${currentStatus.bg} rounded-lg px-3 py-1 flex items-center gap-2`}>
                <div className={`${currentStatus.dotColor} w-1.5 h-1.5 rounded-full`} />
                <span className={`font-manrope font-bold text-[10px] ${currentStatus.textColor} uppercase tracking-widest`}>
                  {currentStatus.label}
                </span>
              </div>
              <span className="font-space-mono text-xs text-[#94A3B8] font-bold">
                REF: {refNumber}
              </span>
            </div>

            {/* Property Name */}
            <h1 className="font-syne font-bold text-4xl text-[#111827] leading-tight mb-3">
              {name}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-[#64748B]">
              <span className="material-icons text-[#D4755B] text-lg">
                location_on
              </span>
              <span className="font-manrope font-medium text-sm">
                {location}
              </span>
            </div>
          </div>

          {/* Right - Price */}
          <div className="bg-[#F9FAFB] border border-[#F1F5F9] rounded-2xl p-6 md:text-right min-w-[240px]">
            <p className="font-manrope font-bold text-[10px] text-[#94A3B8] mb-1 uppercase tracking-widest">
              Asking Price
            </p>
            <div className="flex md:justify-end items-baseline gap-1">
              <span className="font-space-mono font-bold text-2xl text-[#111827]">
                Rs.
              </span>
              <span className="font-space-mono font-bold text-4xl text-[#111827]">
                {price}
              </span>
            </div>
            <div className="mt-2 text-[#D4755B] font-manrope font-bold text-xs">
              Estimated EMI: Rs. {(parseInt(price.replace(/,/g, '')) * 0.008).toFixed(0).toLocaleString()}/mo*
            </div>
          </div>
        </div>

        {/* Key Specs Row (Magicbricks scannable style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 pt-10 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#D4755B]">
              <span className="material-icons text-2xl">bed</span>
            </div>
            <div>
              <p className="font-space-mono font-bold text-xl text-[#111827] leading-none mb-1">{beds}</p>
              <p className="font-manrope text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Bedrooms</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#D4755B]">
              <span className="material-icons text-2xl">bathtub</span>
            </div>
            <div>
              <p className="font-space-mono font-bold text-xl text-[#111827] leading-none mb-1">{baths}</p>
              <p className="font-manrope text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Bathrooms</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#D4755B]">
              <span className="material-icons text-2xl">square_foot</span>
            </div>
            <div>
              <p className="font-space-mono font-bold text-xl text-[#111827] leading-none mb-1">{sqft.toLocaleString()}</p>
              <p className="font-manrope text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Sq Ft Area</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#D4755B]">
              <span className="material-icons text-2xl">directions_car</span>
            </div>
            <div>
              <p className="font-space-mono font-bold text-xl text-[#111827] leading-none mb-1">Yes</p>
              <p className="font-manrope text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Parking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;