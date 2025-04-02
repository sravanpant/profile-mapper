import axios from 'axios';
import { z } from 'zod';

// Geocoding result schema
const GeocodeResultSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  formattedAddress: z.string().optional()
});

type GeocodeResult = z.infer<typeof GeocodeResultSchema>;

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  try {
    // Validate input
    if (!address || address.trim() === '') {
      throw new Error('Address cannot be empty');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    });

    // Handle no results
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error('No results found for the given address');
    }

    const result = response.data.results[0];
    const { lat, lng } = result.geometry.location;

    // Validate result
    return GeocodeResultSchema.parse({
      latitude: lat,
      longitude: lng,
      formattedAddress: result.formatted_address
    });
  } catch (error) {
    console.error('Geocoding error', error);
    throw error;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    // Validate coordinates
    if (lat === undefined || lng === undefined) {
      throw new Error('Invalid coordinates');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    });

    // Handle no results
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error('No address found for the given coordinates');
    }

    return response.data.results[0].formatted_address;
  } catch (error) {
    console.error('Reverse geocoding error', error);
    throw error;
  }
}