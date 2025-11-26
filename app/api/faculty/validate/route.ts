import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, facultyCode } = await request.json();

    console.log("[FACULTY VALIDATE] Request received:", { email, facultyCode });

    if (!email || !facultyCode) {
      return NextResponse.json(
        { valid: false, error: "Email and Faculty Code are required" },
        { status: 400 },
      );
    }

    // Query the faculty table
    const faculty = await prisma.faculty.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
        OR: [{ faculty_code: facultyCode }, { faculty_id_number: facultyCode }],
      },
    });

    console.log("[FACULTY VALIDATE] Faculty query result:", faculty);

    if (!faculty) {
      return NextResponse.json(
        {
          valid: false,
          error: "Faculty not found. Please check your credentials.",
        },
        { status: 404 },
      );
    }

    // Check if faculty is active
    if (faculty.status !== "active") {
      return NextResponse.json(
        {
          valid: false,
          error:
            "This faculty account is not active. Please contact administration.",
        },
        { status: 403 },
      );
    }

    // Return faculty data
    return NextResponse.json({
      valid: true,
      faculty: {
        facultyId: faculty.id,
        facultyCode: faculty.faculty_code || faculty.faculty_id_number,
        firstName: faculty.first_name,
        lastName: faculty.last_name,
        middleName: faculty.middle_name,
        email: faculty.email,
        phoneNumber: faculty.phone_number,
        department: faculty.department,
        status: faculty.status,
      },
    });
  } catch (error) {
    console.error("[FACULTY VALIDATE] Error:", error);
    return NextResponse.json(
      { valid: false, error: "An error occurred during validation" },
      { status: 500 },
    );
  }
}
