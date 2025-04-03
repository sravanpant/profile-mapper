import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { geocodeAddress } from '@/lib/geocoding';

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().optional()
  }).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional()
});

// UPDATE profile
export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validatedData = profileUpdateSchema.parse(body);

    // Fetch existing profile to get current address
    const existingProfile = await prisma.profile.findUnique({
      where: { id: params.id },
      include: { address: true }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Geocode address if provided
    let geocodedLocation;
    if (validatedData.address) {
      const fullAddress = `${validatedData.address.street}, ${validatedData.address.city}, ${validatedData.address.country}`;
      geocodedLocation = await geocodeAddress(fullAddress);
    }

    // Prepare address update
    const addressUpdate = validatedData.address 
      ? {
          upsert: {
            where: { profileId: params.id },
            update: {
              street: validatedData.address.street || existingProfile.address?.street,
              city: validatedData.address.city || existingProfile.address?.city,
              country: validatedData.address.country || existingProfile.address?.country,
              postalCode: validatedData.address.postalCode || existingProfile.address?.postalCode
            },
            create: {
              street: validatedData.address.street,
              city: validatedData.address.city,
              country: validatedData.address.country,
              postalCode: validatedData.address.postalCode
            }
          }
        }
      : undefined;

    const updatedProfile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        latitude: geocodedLocation?.latitude ?? existingProfile.latitude,
        longitude: geocodedLocation?.longitude ?? existingProfile.longitude,
        address: addressUpdate
      },
      include: {
        address: true
      }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // More detailed error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

// DELETE profile
export async function DELETE(
  _req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // First, check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { id: params.id }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Delete profile (cascading delete will remove associated address)
    await prisma.profile.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}