import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  address: z.object({
    street: z.string().min(1, "Street is required").optional(),
    city: z.string().min(1, "City is required").optional(),
    country: z.string().min(1, "Country is required").optional(),
    postalCode: z.string().optional()
  }).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

// UPDATE profile
export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const validatedData = profileUpdateSchema.parse(body)

    const updatedProfile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        address: validatedData.address 
          ? { 
              upsert: {
                create: validatedData.address,
                update: validatedData.address
              }
            }
          : undefined
      },
      include: {
        address: true
      }
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 })
  }
}

// DELETE profile
export async function DELETE(
  _req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await prisma.profile.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Profile deleted successfully' })
  } catch (error) {
    console.error('Error deleting profile:', error)
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 400 })
  }
}