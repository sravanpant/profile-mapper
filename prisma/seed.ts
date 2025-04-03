import { PrismaClient } from '@prisma/client'
import { geocodeAddress } from '../src/lib/geocoding'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.profile.deleteMany()

  // Sample profiles with geocoding
  const profileData = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      description: 'Software Engineer',
      address: {
        street: '123 Tech Lane',
        city: 'San Francisco',
        country: 'USA'
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      description: 'Product Manager',
      address: {
        street: '456 Innovation Road',
        city: 'New York',
        country: 'USA'
      }
    }
  ]

  // Create profiles with geocoded locations
  for (const profile of profileData) {
    const fullAddress = `${profile.address.street}, ${profile.address.city}, ${profile.address.country}`;
    const geocodedLocation = await geocodeAddress(fullAddress);

    await prisma.profile.create({
      data: {
        ...profile,
        latitude: geocodedLocation.latitude,
        longitude: geocodedLocation.longitude,
        address: {
          create: profile.address
        }
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })