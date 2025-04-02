"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { LoadingSpinner } from "./LoadingSpinner";

// Static libraries to avoid unnecessary re-renders
const LIBRARIES: ("places" | "geometry" | "drawing")[] = ["places"];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
});

export function useGoogleMapsContext() {
  return useContext(GoogleMapsContext);
}

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Prevent multiple script loads
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );

    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }&libraries=${LIBRARIES.join(",")}&v=weekly`;
    script.async = true;
    script.defer = true;

    // Success handler
    script.onload = () => {
      setIsLoaded(true);
    };

    // Error handler
    script.onerror = (error) => {
      console.error("Google Maps script failed to load", error);
      setLoadError(new Error("Failed to load Google Maps script"));
    };

    // Append script to document
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      isLoaded,
      loadError,
    }),
    [isLoaded, loadError]
  );

  // Render loading state
  if (!isLoaded && !loadError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Render error state
  if (loadError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Failed to load Google Maps: {loadError.message}</p>
      </div>
    );
  }

  // Render children when loaded
  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

// Custom hook for using Google Maps
export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);

  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }

  return context;
}
