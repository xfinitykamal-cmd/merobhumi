import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SimpleFooter from '../components/common/SimpleFooter';
import LoadingState from '../components/common/LoadingState';
import PropertyBreadcrumb from '../components/property-details/PropertyBreadcrumb';
import PropertyHeroImage from '../components/property-details/PropertyHeroImage';
import PropertyHeader from '../components/property-details/PropertyHeader';
import PropertyAbout from '../components/property-details/PropertyAbout';
import PropertyAmenities from '../components/property-details/PropertyAmenities';
import PropertyLocation from '../components/property-details/PropertyLocation';
import ScheduleViewingCard from '../components/property-details/ScheduleViewingCard';
import { propertiesAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';

interface PropertyData {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  availability: string;
  description: string;
  amenities: string[];
  phone: string;
  googleMapLink?: string;
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PropertyData[]>([]);

  // Dynamic SEO based on loaded property
  useSEO({
    title: property ? `${property.title} - ${property.location}` : 'Property Details',
    description: property
      ? `${property.title} in ${property.location}. ${property.beds} beds, ${property.baths} baths, ${property.sqft} sqft. ${property.type}.`
      : 'View property details on Merobhumi.',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const { data } = await propertiesAPI.getById(id);
        if (data.success && data.property) {
          setProperty(data.property);
        } else {
          setError('Property not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch property:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!property) return;
      try {
        const { data } = await propertiesAPI.getAll();
        if (data.success && data.property) {
          // Filter by same type, exclude current
          const similar = data.property.filter((p: any) =>
            p.type === property.type && p._id !== property._id
          ).slice(0, 4);
          setSimilarProperties(similar);
        }
      } catch (err) {
        console.error("Failed to fetch similar properties:", err);
      }
    };
    fetchSimilar();
  }, [property]);

  // Format price for display
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-IN');
  };

  // Map availability to status
  const getStatus = (availability: string): 'available' | 'sold' | 'pending' => {
    switch (availability?.toLowerCase()) {
      case 'sold': return 'sold';
      case 'pending': return 'pending';
      default: return 'available';
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <LoadingState message="Loading property details..." />
        <SimpleFooter />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <span className="material-icons text-5xl text-[#D4755B] mb-4">error_outline</span>
            <p className="font-manrope text-xl text-[#374151] mb-4">{error || 'Property not found'}</p>
            <Link
              to="/properties"
              className="bg-[#D4755B] text-white font-manrope font-bold px-8 py-3 rounded-lg hover:bg-[#B86851] transition-all inline-block"
            >
              Back to Properties
            </Link>
          </div>
        </div>
        <SimpleFooter />
      </div>
    );
  }

  // Extract city from location string (e.g. "Satellite, Ahmedabad, Gujarat" → "Ahmedabad")
  // Indian addresses typically end with state, so use second-to-last part as city
  const cityParts = property.location.split(',').map(s => s.trim());
  const city = cityParts.length >= 3
    ? cityParts[cityParts.length - 2]       // "Area, City, State" → City
    : cityParts.length === 2
      ? cityParts[0]                         // "City, State" → City
      : cityParts[0];                        // "City" → City

  // Parse amenities — handle legacy data where amenities may be a JSON string
  const parseAmenities = (amenities: string[]): string[] => {
    if (!amenities || amenities.length === 0) return [];
    // If single element that looks like a JSON array, parse it
    if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
      try {
        const parsed = JSON.parse(amenities[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch { /* fall through */ }
    }
    return amenities;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Property Structured Data for SEO */}
      <StructuredData
        type="property"
        data={{
          title: property.title,
          description: property.description,
          location: city,
          region: cityParts[cityParts.length - 1] || '',
          price: property.price,
          sqft: property.sqft,
          beds: property.beds,
          baths: property.baths,
          image: property.image?.[0],
        }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Breadcrumb Navigation */}
      <PropertyBreadcrumb
        city={city}
        propertyName={property.title}
      />

      {/* Hero Image */}
      <PropertyHeroImage image={property.image?.[0]} />

      {/* Property Header with Price & Specs */}
      <PropertyHeader
        status={getStatus(property.availability)}
        refNumber={`#${property._id.slice(-8).toUpperCase()}`}
        name={property.title}
        location={property.location}
        price={formatPrice(property.price)}
        beds={property.beds}
        baths={property.baths}
        sqft={property.sqft}
      />

      {/* Main Content Area */}
      <div className="bg-[#F2EFE9] py-12">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column - Main Content */}
            <div className="flex-1 w-full lg:w-2/3">
              <div className="bg-white border border-[#E6E0DA] rounded-3xl p-8 shadow-sm">

                {/* Price Insight Bar (Magicbricks Style) */}
                <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-[#F9FAFB] rounded-2xl border border-[#F1F5F9]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Avg. Price</span>
                    <span className="font-space-mono font-bold text-lg text-[#111827]">
                      Rs. {(property.price / property.sqft).toFixed(0).toLocaleString()}/sqft
                    </span>
                  </div>
                  <div className="w-[1px] h-10 bg-[#E5E7EB] hidden md:block" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Property Status</span>
                    <span className="font-manrope font-bold text-sm text-[#10B981] flex items-center gap-1">
                      <span className="material-icons text-sm">check_circle</span>
                      Ready to Move
                    </span>
                  </div>
                </div>

                {/* About Section */}
                <PropertyAbout description={property.description} />

                {/* Amenities Section */}
                <PropertyAmenities
                  amenities={parseAmenities(property.amenities)}
                />

                {/* Location Section */}
                <PropertyLocation
                  location={property.location}
                  propertyName={property.title}
                  googleMapLink={property.googleMapLink}
                />
              </div>
            </div>

            {/* Right Column - Schedule Viewing Sidebar (Sticky) */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
              <ScheduleViewingCard
                property={{ name: property.title, id: property._id }}
              />

              {/* Trust Box */}
              <div className="mt-6 bg-[#D4755B]/10 border border-[#D4755B]/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-icons text-[#D4755B]">verified_user</span>
                  <span className="font-syne font-bold text-[#111827]">Verified Agent</span>
                </div>
                <p className="font-manrope text-xs text-[#4b5563] leading-relaxed">
                  This property has been verified by our team. All documents and details are authentic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="bg-white py-20 border-t border-[#F1F5F9]">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-syne font-bold text-3xl text-[#111827] mb-2 text-left">Similar Properties</h2>
                <p className="font-manrope text-[#64748B]">You might also be interested in these listings</p>
              </div>
              <Link to="/properties" className="text-[#D4755B] font-manrope font-bold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((p) => (
                <div key={p._id} className="bg-white border border-[#E6E0DA] rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                  <Link to={`/property/${p._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={p.image?.[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase">{p.type}</div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-manrope font-bold text-[#111827] truncate mb-1">{p.title}</h4>
                      <p className="text-[#64748B] text-xs truncate mb-3">{p.location}</p>
                      <div className="text-[#D4755B] font-space-mono font-bold">Rs. {p.price.toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <SimpleFooter />
    </div>
  );
};

export default PropertyDetailsPage;
