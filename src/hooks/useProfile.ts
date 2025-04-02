import useSWR from 'swr'
import { Profile } from '@/types/profile'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch data')
  }
  
  return response.json()
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
    errorRetryCount: 2
  })

  return {
    profiles: profiles || [],
    loading,
    error,
    mutate
  }
}