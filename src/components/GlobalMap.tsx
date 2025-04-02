'use client';

import React, { useState, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Profile } from '@/types/profile';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from './ui/button';
import { useGoogleMaps } from './GoogleMapsProvider';

interface GlobalMapProps {
  profiles: Profile[];
  onProfileSelect?: (profile: Profile) => void;
}

export function GlobalMap({ profiles, onProfileSelect }: GlobalMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Memoize map container style
  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    minHeight: '400px'
  }), []);

  // Memoize center coordinates
  const center = useMemo(() => ({
    lat: 20,
    lng: 0
  }), []);

  // Filter profiles with valid coordinates
  const validProfiles = useMemo(() => 
    profiles.filter(
      profile => 
        profile.address?.latitude && 
        profile.address?.longitude
    ), 
    [profiles]
  );

  // Handle loading and error states
  if (!isLoaded) {
    return <LoadingSpinner size="large" />;
  }

  if (loadError) {
    return (
      <div className="text-red-500 p-4">
        Error loading map: {loadError.message}
      </div>
    );
  }

  // Marker click handler
  const handleMarkerClick = (profile: Profile) => {
    setSelectedProfile(profile);
    onProfileSelect?.(profile);
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={3}
      center={center}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {validProfiles.map(profile => (
        <Marker
          key={profile.id}
          position={{
            lat: profile.address.latitude!,
            lng: profile.address.longitude!
          }}
          onClick={() => handleMarkerClick(profile)}
          title={profile.name}
        />
      ))}

      {selectedProfile && (
        <InfoWindow
          position={{
            lat: selectedProfile.address.latitude!,
            lng: selectedProfile.address.longitude!
          }}
          onCloseClick={() => setSelectedProfile(null)}
        >
          <div className="p-2 max-w-[250px]">
            <h3 className="font-bold text-lg mb-2">{selectedProfile.name}</h3>
            <p className="text-sm mb-3 text-muted-foreground">
              {selectedProfile.description}
            </p>
            <Button 
              size="sm" 
              onClick={() => onProfileSelect?.(selectedProfile)}
            >
              View Profile
            </Button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}