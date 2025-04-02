'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/hooks/useProfile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Profile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

// Dynamically import GlobalMap to prevent SSR
const GlobalMap = dynamic(
  () => import('@/components/GlobalMap').then(mod => mod.GlobalMap),
  { 
    loading: () => <LoadingSpinner size="large" />,
    ssr: false 
  }
);

export default function GlobalMapPage() {
  const router = useRouter();
  const { profiles, loading, error } = useProfiles();

  // Handle profile selection
  const handleProfileSelect = (profile: Profile) => {
    router.push(`/profile/${profile.id}`);
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
    <div className="h-screen w-full relative">
      <div className="absolute top-4 left-4 z-10 text-black bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Global Profile Map</h2>
        <p className="text-muted-foreground mb-4">
          Explore profiles from around the world
        </p>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => router.push('/profiles')}
          >
            View Profile List
          </Button>
          <Button 
            variant="secondary"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>

      <GlobalMap 
        profiles={profiles}
        onProfileSelect={handleProfileSelect}
      />

      {profiles.length === 0 && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>No Profiles Available</DialogTitle>
              <DialogDescription>
                There are currently no profiles to display on the map.
                Would you like to add a new profile?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
              >
                Go Home
              </Button>
              <Button 
                onClick={() => router.push('/admin/profiles/new')}
              >
                Add Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}