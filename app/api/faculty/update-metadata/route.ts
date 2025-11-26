import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { metadata } = await request.json();

    console.log("[FACULTY METADATA UPDATE] Updating metadata for user:", userId);
    console.log("[FACULTY METADATA UPDATE] Metadata to update:", metadata);

    if (!metadata) {
      return NextResponse.json(
        { success: false, error: "Metadata is required" },
        { status: 400 }
      );
    }

    // Update user's public metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: metadata,
    });

    console.log("[FACULTY METADATA UPDATE] Metadata updated successfully");

    return NextResponse.json({
      success: true,
      message: "Faculty profile updated successfully"
    });
  } catch (error) {
    console.error("[FACULTY METADATA UPDATE] Error updating metadata:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
