import useSWR from 'swr';
import { Profile } from '@/types/profile';

// Generic fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch data');
  }
  
  return response.json();
};

export function useProfiles() {
  const { 
    data: profiles, 
    error, 
    isLoading: loading,
    mutate
  } = useSWR<Profile[]>('/api/profiles', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2
  });

  return {
    profiles: profiles || [],
    loading,
    error,
    mutate
  };
}

// Function to create a profile
export async function createProfile(profileData: Partial<Profile>) {
  try {
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create profile');
    }

    return response.json();
  } catch (error) {
    console.error('Profile creation error:', error);
    throw error;
  }
}

// Function to update a profile
export async function updateProfile(id: string, profileData: Partial<Profile>) {
  try {
    const response = await fetch(`/api/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}