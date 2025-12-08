import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchListings } from "@/lib/listings";
import { sessionCookie, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const propertyId = id;
    
    // Fetch a larger set of listings using the same search approach as main page
    // Use city-only search to match the main listings page behavior
    const allListings = await fetchListings({ q: "Olathe", limit: 200 });
    
    const property = allListings.find(listing => listing.id === propertyId);
    
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    console.log('Property description:', property.description); // Debug log

    return NextResponse.json({ 
      property: {
        ...property,
        isFavorited: false
      }
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch property details", message: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
