import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId query param required" },
        { status: 400 },
      );
    }

    const studentIdNumber = parseInt(studentId, 10);

    // Try to find the student
    const result = await prisma.students.findFirst({
      where: {
        student_id: studentIdNumber,
      },
    });

    return NextResponse.json({
      found: result !== null,
      count: result ? 1 : 0,
      student: result
        ? {
            id: result.id,
            studentId: result.student_id,
            firstName: result.first_name,
            lastName: result.last_name,
            email: result.email,
            deletedAt: result.deleted_at,
            status: result.status,
          }
        : null,
    });
  } catch (error) {
    console.error("Test query error:", error);
    return NextResponse.json(
      {
        error: "Database query failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
