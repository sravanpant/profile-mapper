"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types/profile";
import { geocodeAddress } from "@/lib/geocoding";
import { toast } from "sonner";

// Comprehensive Zod validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  description: z.string().max(500, "Description too long").optional(),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().optional(),
  }),
  contactInfo: z
    .object({
      phone: z.string().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

// Countries list for dropdown
const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  // Add more countries as needed
];

interface AdminProfileFormProps {
  profile?: Partial<Profile>;
  onSubmit: (profile: Partial<Profile>) => Promise<void>;
  isSubmitting?: boolean;
}

export function AdminProfileForm({
  profile,
  onSubmit,
  isSubmitting,
}: AdminProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Use Controller for more complex inputs
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      description: profile?.description || "",
      address: {
        street: profile?.address?.street || "",
        city: profile?.address?.city || "",
        country: profile?.address?.country || "",
        postalCode: profile?.address?.postalCode || "",
      },
      contactInfo: {
        phone: profile?.contactInfo?.phone || "",
        website: profile?.contactInfo?.website || "",
      },
    },
  });

  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true);

    try {
      // Construct full address for geocoding
      const fullAddress = `${data.address.street}, ${data.address.city}, ${data.address.country}`;

      // Geocode address with a loading toast
      const toastId = toast.loading("Geocoding address...");

      let latitude, longitude;
      try {
        const geoResult = await geocodeAddress(fullAddress);
        latitude = geoResult.latitude;
        longitude = geoResult.longitude;
        toast.dismiss(toastId);
      } catch (geoError) {
        toast.dismiss(toastId);
        toast.error("Failed to geocode address", {
          description:
            geoError instanceof Error ? geoError.message : "Unknown error",
        });
        setIsLoading(false);
        return;
      }

      // Prepare profile data
      const profileData: Partial<Profile> = {
        ...data,
        address: {
          ...data.address,
          latitude,
          longitude,
        },
        id: profile?.id, // Preserve existing ID if editing
      };

      // Submit profile with loading toast
      const submitToastId = toast.loading("Saving profile...");

      try {
        await onSubmit(profileData);
        toast.dismiss(submitToastId);

        // Success toast
        toast.success("Profile Saved", {
          description: "Profile has been successfully saved.",
        });

        // Reset form
        form.reset();
      } catch (submitError) {
        toast.dismiss(submitToastId);
        toast.error("Failed to save profile", {
          description:
            submitError instanceof Error
              ? submitError.message
              : "An unexpected error occurred",
        });
      }
    } catch (error) {
      // Catch-all error handling
      toast.error("Unexpected Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-w-xl"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter profile description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country Dropdown using Controller */}
          <Controller
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter postal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactInfo.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo.website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter website URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isLoading ? (
            <>
              <span className="mr-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              Saving...
            </>
          ) : profile ? (
            "Update Profile"
          ) : (
            "Create Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}
