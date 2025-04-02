import { z } from "zod";

export interface Address {
  street: string;
  city: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  description: string;
  imageUrl: string;
  address: Address;
  contactInfo?: {
    phone?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Validation Schema for Profile
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  description: z.string().max(500, "Description too long"),
  imageUrl: z.string().url("Invalid image URL"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  }),
  contactInfo: z.object({
    phone: z.string().optional(),
    website: z.string().url().optional()
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});