'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ProfileMap } from '@/components/ProfileMap';
import { LoadingSpinner } from '@/components/LoadingSpinner';
// import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { reverseGeocode } from '@/lib/geocoding';

export default function ProfileDetailsPage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullAddress, setFullAddress] = useState<string>('');

  useEffect(() => {
    async function fetchProfileDetails() {
      try {
        const response = await fetch(`/api/profiles/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);

        // Attempt reverse geocoding if coordinates exist
        if (data.address.latitude && data.address.longitude) {
          const address = await reverseGeocode(
            data.address.latitude, 
            data.address.longitude
          );
          setFullAddress(address);
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProfileDetails();
    }
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto p-4 grid md:grid-cols-2 gap-8">
      <div>
        <Image 
          src={profile.imageUrl} 
          alt={profile.name} 
          width={400} 
          height={400} 
          className="rounded-lg shadow-lg mb-6"
        />
        <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
        <div className="space-y-4">
          <p>{profile.description}</p>
          <div>
            <h2 className="font-semibold">Contact Information</h2>
            <p>Email: {profile.email}</p>
            <p>Address: {fullAddress || 'Address not available'}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        {profile.address.latitude && profile.address.longitude ? (
          <ProfileMap profile={profile} />
        ) : (
          <p>Location information not available</p>
        )}
      </div>
    </div>
  );
}