import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapPrismaProfileToProfile } from "@/types/profile";

export async function GET() {
  try {
    // Ensure prisma is initialized
    if (!prisma) {
      throw new Error("Prisma client not initialized");
    }

    // Fetch profiles with their addresses
    const prismaProfiles = await prisma.profile.findMany({
      include: {
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map Prisma profiles to application profiles
    const profiles = prismaProfiles.map(mapPrismaProfileToProfile);

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);

    // More detailed error response
    return NextResponse.json(
      {
        message: "Failed to fetch profiles",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
