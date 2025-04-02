import React, { useCallback, useMemo } from 'react';
import { 
  GoogleMap, 
  Marker, 
  useLoadScript 
} from "@react-google-maps/api";
import { Profile } from "@/types/profile";
import { LoadingSpinner } from './LoadingSpinner';

// Define map container style
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

// Memoize libraries to prevent unnecessary re-renders
const libraries: ('places' | 'geometry' | 'drawing')[] = ['places'];

interface ProfileMapProps {
  profile: Profile;
  className?: string;
}

export function ProfileMap({ profile, className = '' }: ProfileMapProps) {
  // Use useLoadScript hook for Google Maps loading
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  // Memoize center coordinates
  const center = useMemo(() => ({
    lat: profile.address.latitude || 0,
    lng: profile.address.longitude || 0
  }), [profile.address.latitude, profile.address.longitude]);

  // Memoize map options
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: false,
    fullscreenControl: true,
  }), []);

  // Callback for handling map load (optional)
  const onMapLoad = useCallback((map: google.maps.Map) => {
    // You can perform additional map configurations here if needed
    // For example, adding custom controls or event listeners
    map.setOptions({
      gestureHandling: 'cooperative'
    });
  }, []);

  // Handle loading and error states
  if (loadError) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100">
        <p className="text-red-500">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <LoadingSpinner size="large" />;
  }

  // Validate coordinates
  const isValidCoordinates = 
    center.lat !== 0 && 
    center.lng !== 0 && 
    !isNaN(center.lat) && 
    !isNaN(center.lng);

  if (!isValidCoordinates) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100">
        <p className="text-gray-500">Location information not available</p>
      </div>
    );
  }

  return (
    <div className={`map-container ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        <Marker
          position={center}
          title={profile.name}
          animation={google.maps.Animation.DROP}
        />
      </GoogleMap>
    </div>
  );
}