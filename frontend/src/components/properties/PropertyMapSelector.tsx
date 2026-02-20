import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface PropertyMapSelectorProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLocation?: { lat: number; lng: number };
}

function LocationMarker({ onLocationSelect, initialLocation }: PropertyMapSelectorProps) {
    const [position, setPosition] = useState<L.LatLng | null>(
        initialLocation ? new L.LatLng(initialLocation.lat, initialLocation.lng) : null
    );

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function PropertyMapSelector({ onLocationSelect, initialLocation }: PropertyMapSelectorProps) {
    const defaultCenter: [number, number] = [27.7172, 85.3240]; // Kathmandu center

    return (
        <div className="h-[300px] w-full rounded-2xl overflow-hidden border-2 border-[#E6D5C3] shadow-inner relative z-0">
            <MapContainer
                center={initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={onLocationSelect} initialLocation={initialLocation} />
            </MapContainer>
            <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#1C1B1A] shadow-sm border border-[#E6D5C3]">
                Click on map to set pinpoint
            </div>
        </div>
    );
}
