import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'Buy' | 'Rent' | 'Land'>('Buy');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [propertyType, setPropertyType] = useState('All Residential');

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (location) queryParams.append('city', location);
    if (searchType === 'Buy') queryParams.append('availability', 'sale');
    if (searchType === 'Rent') queryParams.append('availability', 'rent');
    if (searchType === 'Land') queryParams.append('type', 'Land');
    navigate(`/properties?${queryParams.toString()}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <section className="relative min-h-[700px] flex items-center justify-center pt-24 pb-32 overflow-hidden">
      {/* Premium Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600"
          alt="Luxury Nepal Real Estate"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-8 relative z-20 text-center text-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Headings with improved shadows for readability */}
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="font-syne font-bold text-5xl lg:text-8xl text-white leading-[1.1] mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Find Your <br />
              <span className="text-[#D4755B]">Dream Home</span>
            </h1>
            <p className="font-manrope text-lg md:text-2xl text-white/95 max-w-2xl mx-auto font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Nepal's most trusted marketplace for verified residential and commercial properties.
            </p>
          </motion.div>

          {/* Redesigned Search Container */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-4xl bg-white rounded-3xl shadow-[0px_30px_60px_-15px_rgba(0,0,0,0.4)] p-2 md:p-3 overflow-hidden"
          >
            {/* Search Tabs */}
            <div className="flex gap-1 mb-2 px-4 pt-2">
              {['Buy', 'Rent', 'Land'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type as any)}
                  className={`px-6 py-2 rounded-full font-manrope font-bold text-sm transition-all ${searchType === type
                    ? 'bg-[#D4755B] text-white'
                    : 'text-[#4b5563] hover:bg-[#F3F4F6]'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full flex items-center bg-[#F9FAFB] rounded-2xl px-5 py-3 border border-transparent focus-within:border-[#D4755B]/30 transition-all">
                <span className="material-icons text-[#D4755B] mr-3">location_on</span>
                <input
                  type="text"
                  placeholder="Enter City, Locality or Project..."
                  className="bg-transparent w-full font-manrope text-[#111827] focus:outline-none placeholder:text-[#9CA3AF]"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="w-full md:w-auto flex items-center bg-[#F9FAFB] rounded-2xl px-5 py-3 gap-4">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <span className="material-icons text-[#D4755B] text-sm">home</span>
                  <select
                    className="bg-transparent font-manrope text-[#4b5563] text-sm font-bold focus:outline-none cursor-pointer"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option>Property Type</option>
                    <option>Flat/Apartment</option>
                    <option>House/Villa</option>
                    <option>Plots/Land</option>
                  </select>
                </div>
                <div className="w-[1px] h-6 bg-[#E5E7EB]" />
                <div className="flex items-center gap-2 cursor-pointer">
                  <span className="material-icons text-[#D4755B] text-sm">payments</span>
                  <select
                    className="bg-transparent font-manrope text-[#4b5563] text-sm font-bold focus:outline-none cursor-pointer"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option>Budget</option>
                    <option>Rs. 50 Lac - 1 Cr</option>
                    <option>Rs. 1 Cr - 5 Cr</option>
                    <option>Rs. 5 Cr+</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-[#D4755B] text-white px-10 py-4 rounded-2xl font-manrope font-bold text-lg hover:bg-[#B86851] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <span className="material-icons">search</span>
                Search
              </button>
            </div>
          </motion.div>

          {/* Quick Suggestions */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="font-manrope text-sm text-white/80 py-1 drop-shadow-md">Popular:</span>
            {['Budhanilkantha', 'Jhamsikhel', 'Lakeside Pokhara', 'Sanepa'].map((tag) => (
              <button
                key={tag}
                onClick={() => setLocation(tag)}
                className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold hover:bg-white/20 transition-all shadow-sm"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
