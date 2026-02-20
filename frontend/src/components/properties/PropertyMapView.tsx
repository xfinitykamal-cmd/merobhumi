import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Property } from '../../pages/PropertiesPage';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatPrice } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Layers } from 'lucide-react';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface PropertyMapViewProps {
    properties: Property[];
}

function MapEvents({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange(map.getBounds());
        },
        zoomend: () => {
            onBoundsChange(map.getBounds());
        },
    });

    useEffect(() => {
        // Initial bounds
        onBoundsChange(map.getBounds());
    }, []);

    return null;
}

export default function PropertyMapView({ properties }: PropertyMapViewProps) {
    const defaultCenter: [number, number] = [27.7172, 85.3240];
    const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);

    // Initial filter for properties with coords
    const propertiesWithCoords = properties.filter(p => (p as any).coordinates?.lat && (p as any).coordinates?.lng);

    useEffect(() => {
        if (mapBounds) {
            const filtered = propertiesWithCoords.filter(p => {
                const { lat, lng } = (p as any).coordinates;
                return mapBounds.contains(L.latLng(lat, lng));
            });
            setVisibleProperties(filtered);
        } else {
            setVisibleProperties(propertiesWithCoords);
        }
    }, [mapBounds, properties]);

    return (
        <div className="h-[calc(100vh-200px)] w-full relative z-0">
            <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onBoundsChange={setMapBounds} />
                {visibleProperties.map((property) => (
                    <Marker
                        key={property._id}
                        position={[(property as any).coordinates.lat, (property as any).coordinates.lng]}
                    >
                        <Popup className="property-popup">
                            <div className="w-64 p-1">
                                <img
                                    src={property.image?.[0]}
                                    className="w-full h-32 object-cover rounded-xl mb-3"
                                    alt={property.title}
                                />
                                <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-[#1C1B1A] text-sm truncate flex-1">{property.title}</h3>
                                        <span className="text-[#D4755B] font-bold text-sm whitespace-nowrap ml-2">{formatPrice(property.price)}</span>
                                    </div>
                                    <p className="text-[#9CA3AF] text-[10px] flex items-center gap-1 mb-2">
                                        <MapPin size={10} /> {property.location}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] text-[#5A5856] font-bold mb-3">
                                        <span className="flex items-center gap-1"><Bed size={12} /> {property.beds}</span>
                                        <span className="flex items-center gap-1"><Bath size={12} /> {property.baths}</span>
                                        <span className="flex items-center gap-1"><Maximize size={12} /> {property.sqft} sqft</span>
                                    </div>
                                    <Link
                                        to={`/property/${property._id}`}
                                        className="block w-full py-2 bg-[#1C1B1A] text-white text-center rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#D4755B] transition-all"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating Stats */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#E6D5C3] shadow-lg flex items-center gap-2">
                <Layers size={16} className="text-[#D4755B]" />
                <span className="text-xs font-bold text-[#1C1B1A]">Showing {visibleProperties.length} properties in this area</span>
            </div>

            {propertiesWithCoords.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 pointer-events-none">
                    <div className="bg-white p-6 rounded-3xl border border-[#E6D5C3] shadow-xl text-center">
                        <MapPin className="mx-auto text-[#D4755B] mb-2" size={32} />
                        <p className="font-bold text-[#1C1B1A]">No Map Data Available</p>
                        <p className="text-xs text-[#9CA3AF]">None of the filtered properties have pinpoint locations.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
