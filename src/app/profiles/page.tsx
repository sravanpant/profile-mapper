'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileGrid } from '@/components/ProfileGrid';
import { SearchFilter } from '@/components/SearchFilter';
import { ProfileMap } from '@/components/ProfileMap';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useProfiles } from '@/hooks/useProfile';
import { Profile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function ProfilesPage() {
  const router = useRouter();
  const { profiles, loading, error } = useProfiles();
  
  // Search state
  const [searchParams, setSearchParams] = useState({
    term: '',
    field: 'name' as keyof Pick<Profile, 'name' | 'email' | 'description'>
  });

  // Selected profile state
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Memoized filtered profiles
  const filteredProfiles = useMemo(() => {
    if (!searchParams.term) return profiles;

    return profiles.filter(profile => {
      const value = profile[searchParams.field];
      return String(value).toLowerCase().includes(searchParams.term.toLowerCase());
    });
  }, [profiles, searchParams]);

  // Handler for profile selection
  const handleProfileSelect = (profile: Profile) => {
    router.push(`/profile/${profile.id}`);
  };

  // Handler for map profile selection
  const handleMapProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  // Search handler
  const handleSearch = (term: string, field?: keyof Pick<Profile, 'name' | 'email' | 'description'>) => {
    setSearchParams(prev => ({
      term,
      field: field || prev.field
    }));
  };

  // Render loading state
  if (loading) return <LoadingSpinner size="large" />;
  
  // Render error state
  if (error) return (
    <div className="container mx-auto p-4 text-red-500">
      Error loading profiles: {error.message}
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Search Filter */}
      <SearchFilter 
        onSearch={(term) => handleSearch(term)}
        onFilter={(field) => handleSearch(searchParams.term, field)}
      />

      {/* Profiles Grid and Map Layout */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Profiles Grid */}
        <div className="md:col-span-7 lg:col-span-8">
          <ProfileGrid 
            profiles={filteredProfiles} 
            onProfileSelect={handleProfileSelect}
            onShowMap={handleMapProfileSelect}
            emptyStateMessage={
              searchParams.term 
                ? `No profiles found matching "${searchParams.term}"` 
                : "No profiles available"
            }
          />
        </div>

        {/* Map Section */}
        <div className="hidden md:block md:col-span-5 lg:col-span-4">
          {selectedProfile ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {selectedProfile.name}&apos;s Location
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/profile/${selectedProfile.id}`)}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </div>
              <ProfileMap profile={selectedProfile} />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                Select a profile to view its location
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}