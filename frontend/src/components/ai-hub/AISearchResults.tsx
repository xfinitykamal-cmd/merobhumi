import React from 'react';
import { MapPin, Maximize, Building2, Loader2, SearchX, Home } from 'lucide-react';
import type { ScrapedProperty } from '../../pages/AIPropertyHubPage';

interface Props {
  properties: ScrapedProperty[];
  loading: boolean;
  error: string | null;
  city: string;
}

/* ── Property card ──────────────────────────────────────── */

const PropertyCard: React.FC<{ property: ScrapedProperty }> = ({ property }) => (
  <div className="bg-white border border-[#E6E0DA] rounded-xl overflow-hidden hover:shadow-xl transition-all group">
    {/* Gradient accent bar */}
    <div className="h-1.5 bg-gradient-to-r from-[#D4755B] to-[#C05621]" />

    <div className="p-6">
      {/* Type badge */}
      <div className="mb-3">
        <span className="inline-flex items-center gap-1.5 bg-[#D4755B]/10 rounded-full px-3 py-1">
          <Building2 className="w-3.5 h-3.5 text-[#D4755B]" />
          <span className="font-space-mono text-[11px] text-[#D4755B] uppercase">
            {property.property_type || 'Property'}
          </span>
        </span>
      </div>

      {/* Name */}
      <h3 className="font-syne text-lg text-[#221410] mb-2 line-clamp-2 group-hover:text-[#D4755B] transition-colors">
        {property.building_name || 'Unnamed Property'}
      </h3>

      {/* Location */}
      <div className="flex items-start gap-2 mb-4">
        <MapPin className="w-4 h-4 text-[#D4755B] mt-0.5 shrink-0" />
        <span className="font-manrope font-light text-sm text-[#6b7280] line-clamp-2">
          {property.location_address || 'Location not specified'}
        </span>
      </div>

      {/* Price */}
      <div className="bg-[#F5F1E8] rounded-lg px-4 py-3 mb-4">
        <div className="font-space-mono text-[11px] text-[#6b7280] uppercase tracking-wider mb-0.5">
          Price
        </div>
        <div className="font-space-mono font-bold text-xl text-[#221410]">
          {property.price || 'Contact for Price'}
        </div>
      </div>

      {/* Area */}
      {property.area_sqft && (
        <div className="flex items-center gap-2 mb-4 text-[#6b7280]">
          <Maximize className="w-4 h-4" />
          <span className="font-manrope font-light text-sm">
            {property.area_sqft} sq.ft
          </span>
        </div>
      )}

      {/* Description */}
      {property.description && (
        <p className="font-manrope font-light text-sm text-[#6b7280] line-clamp-2 mb-4">
          {property.description}
        </p>
      )}

      {/* Amenities */}
      {property.amenities?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {property.amenities.slice(0, 4).map((amenity, i) => (
            <span
              key={i}
              className="font-manrope text-[11px] text-[#6b7280] bg-[#F2EFE9] rounded-full px-2.5 py-1"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 4 && (
            <span className="font-manrope text-[11px] text-[#D4755B] bg-[#D4755B]/10 rounded-full px-2.5 py-1">
              +{property.amenities.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);

/* ── Main section ───────────────────────────────────────── */

const AISearchResults: React.FC<Props> = ({ properties, loading, error, city }) => {
  /* Loading skeleton */
  if (loading) {
    return (
      <section className="bg-[#FAF8F4] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-[#D4755B]/10 rounded-full px-6 py-3 mb-6">
              <Loader2 className="w-5 h-5 text-[#D4755B] animate-spin" />
              <span className="font-manrope text-sm text-[#D4755B] font-medium">
                Scanning properties in {city}…
              </span>
            </div>
            <h2 className="font-syne text-3xl text-[#221410] mb-3">
              Finding Your Matches
            </h2>
            <p className="font-manrope font-light text-[#6b7280]">
              Our AI is scraping live listings and analysing market data
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#E6E0DA] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-2 bg-[#E6E0DA]" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-[#E6E0DA] rounded w-3/4" />
                  <div className="h-4 bg-[#E6E0DA] rounded w-1/2" />
                  <div className="h-16 bg-[#F5F1E8] rounded-lg" />
                  <div className="h-4 bg-[#E6E0DA] rounded w-full" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-[#E6E0DA] rounded-full w-16" />
                    <div className="h-6 bg-[#E6E0DA] rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* Error */
  if (error) {
    return (
      <section className="bg-[#FAF8F4] py-16">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="font-syne text-2xl text-[#221410] mb-2">Search Failed</h3>
          <p className="font-manrope font-light text-[#6b7280]">{error}</p>
        </div>
      </section>
    );
  }

  /* Empty */
  if (properties.length === 0) {
    return (
      <section className="bg-[#FAF8F4] py-16">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-[#D4755B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-[#D4755B]" />
          </div>
          <h3 className="font-syne text-2xl text-[#221410] mb-2">No Properties Found</h3>
          <p className="font-manrope font-light text-[#6b7280]">
            No properties found in {city} within your budget. Try increasing
            your budget or changing the property type.
          </p>
        </div>
      </section>
    );
  }

  /* Results */
  return (
    <section className="bg-[#FAF8F4] py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="font-space-mono text-[11px] text-[#D4755B] uppercase tracking-widest mb-2">
            Live Results
          </div>
          <h2 className="font-syne text-3xl text-[#221410] mb-2">
            Properties in {city}
          </h2>
          <p className="font-manrope font-light text-[#6b7280]">
            Found {properties.length}{' '}
            {properties.length === 1 ? 'property' : 'properties'} matching your
            criteria
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyCard key={index} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISearchResults;
