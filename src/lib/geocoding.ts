import axios from 'axios'

export async function geocodeAddress(address: string) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    })

    const result = response.data.results[0]
    if (!result) {
      throw new Error('No results found')
    }

    const { lat, lng } = result.geometry.location
    return { 
      latitude: lat, 
      longitude: lng,
      formattedAddress: result.formatted_address
    }
  } catch (error) {
    console.error('Geocoding error', error)
    throw error
  }
}