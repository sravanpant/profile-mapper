import { useState, useEffect } from 'react';

interface UseGoogleMapsResult {
  isLoaded: boolean;
  loadError: Error | null;
}

export function useGoogleMaps(
  apiKey: string, 
  libraries: ('places' | 'geometry' | 'drawing')[] = ['places']
): UseGoogleMapsResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Prevent multiple script loads
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&v=weekly`;
    script.async = true;
    script.defer = true;

    // Success handler
    script.onload = () => {
      setIsLoaded(true);
    };

    // Error handler
    script.onerror = (error) => {
      console.error('Google Maps script failed to load', error);
      setLoadError(new Error('Failed to load Google Maps script'));
    };

    // Append script to document
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey, libraries]);

  return { isLoaded, loadError };
}