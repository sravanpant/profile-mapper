import { z } from "zod";
import {
  Profile as PrismaProfile,
  Address as PrismaAddress,
} from "@prisma/client";

export const AddressSchema = z.object({
  id: z.string().cuid().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().nullable().optional(),
});

export const ProfileSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  description: z
    .string()
    .max(500, "Description too long")
    .nullable()
    .optional(),
  imageUrl: z.string().url("Invalid image URL").nullable().optional(),
  address: AddressSchema.nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().url("Invalid URL").nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  tags: z.array(z.string()).default([]).optional(),
  isActive: z.boolean().default(true).optional(),
});

export type AddressInput = z.input<typeof AddressSchema>;
export type AddressOutput = z.output<typeof AddressSchema>;
export type Profile = z.output<typeof ProfileSchema>;
export type ProfileCreateInput = z.input<typeof ProfileSchema>;
export type ProfileUpdateInput = Partial<ProfileCreateInput>;

export function validateProfileData(data: unknown): Profile {
  return ProfileSchema.parse(data);
}

export function isValidProfileData(data: unknown): data is Profile {
  return ProfileSchema.safeParse(data).success;
}

export function mapPrismaProfileToProfile(
  profile: PrismaProfile & { address?: PrismaAddress | null }
): Profile {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    description: profile.description,
    imageUrl: profile.imageUrl,
    address: profile.address
      ? {
          id: profile.address.id,
          street: profile.address.street,
          city: profile.address.city,
          country: profile.address.country,
          postalCode: profile.address.postalCode,
        }
      : null,
    phone: profile.phone,
    website: profile.website,
    latitude: profile.latitude,
    longitude: profile.longitude,
    tags: profile.tags,
    isActive: profile.isActive,
  };
}
