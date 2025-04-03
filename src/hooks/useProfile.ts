import useSWR from 'swr'
import { Profile } from '@/types/profile'

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetcher error:', error);
    throw error;
  }
}

export function useProfiles() {
  const { 
    data: profiles, 
    error, 
    isLoading: loading,
    mutate
  } = useSWR<Profile[]>('/api/profiles', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
    // Add more robust error handling
    onError: (err) => {
      console.error('SWR Error:', err);
    }
  })

  return {
    profiles: profiles || [],
    loading,
    error,
    mutate
  }
}