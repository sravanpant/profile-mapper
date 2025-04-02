import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().optional()
  }).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

// GET all profiles
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}

// CREATE new profile
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    const newProfile = await prisma.profile.create({
      data: {
        ...validatedData,
        address: validatedData.address 
          ? { create: validatedData.address } 
          : undefined
      },
      include: {
        address: true
      }
    })

    return NextResponse.json(newProfile, { status: 201 })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 400 })
  }
}