import { Elysia, t } from "elysia";
import { prisma } from "@/lib/prisma";
import { badRequest, serverError } from "../lib/auth";

export const enrollment = new Elysia({ prefix: "/enrollment-status" }).get(
  "/",
  async ({ query }) => {
    try {
      const { studentId, semester, schoolYear } = query;

      console.log("🔍 Enrollment API called with:", {
        studentId,
        semester,
        schoolYear,
      });

      if (!studentId || !semester || !schoolYear) {
        console.error("❌ Missing parameters:", {
          studentId,
          semester,
          schoolYear,
        });
        return badRequest("Missing required parameters");
      }

      // Valid enrollment statuses
      const validStatuses = ["Verified By Cashier", "Verified By Head Dept"];

      // Check both student_enrollment and subject_enrollments tables
      // First, try student_enrollment
      console.log("🔍 Checking student_enrollment table...");

      let enrollmentRecord;
      try {
        enrollmentRecord = await prisma.student_enrollment.findFirst({
          where: {
            student_id: studentId,
            semester: BigInt(semester),
            school_year: schoolYear,
            status: {
              in: validStatuses,
            },
            deleted_at: null,
          },
          orderBy: {
            created_at: "desc",
          },
        });
      } catch (dbError) {
        console.error("💥 Database error in student_enrollment:", dbError);
        enrollmentRecord = null;
      }

      console.log(
        "📊 student_enrollment result:",
        enrollmentRecord ? "Found" : "Not found"
      );

      // If not found in student_enrollment, check subject_enrollments
      if (!enrollmentRecord) {
        // Parse studentId to integer for subject_enrollments table
        const studentIdInt = parseInt(studentId);
        const semesterInt = parseInt(semester);

        console.log("🔍 Checking subject_enrollments table with:", {
          studentIdInt,
          semesterInt,
          schoolYear,
        });

        let subjectEnrollment;
        try {
          subjectEnrollment = await prisma.subject_enrollments.findFirst({
            where: {
              student_id: studentIdInt,
              semester: semesterInt,
              school_year: schoolYear,
            },
            orderBy: {
              created_at: "desc",
            },
          });
        } catch (dbError) {
          console.error("💥 Database error in subject_enrollments:", dbError);
          subjectEnrollment = null;
        }

        console.log(
          "📊 subject_enrollments result:",
          subjectEnrollment ? "Found" : "Not found"
        );

        if (subjectEnrollment) {
          const enrollmentData = {
            isEnrolled: true,
            status: "enrolled",
            semester: subjectEnrollment.semester || parseInt(semester),
            academicYear: parseInt(subjectEnrollment.academic_year || "0"),
            schoolYear: subjectEnrollment.school_year,
            courseId: "",
          };
          console.log(
            "✅ Returning enrollment from subject_enrollments:",
            enrollmentData
          );
          return {
            success: true,
            enrollmentStatus: enrollmentData,
          };
        }

        console.log("❌ No enrollment found in either table");
        return {
          success: true,
          enrollmentStatus: {
            isEnrolled: false,
          },
        };
      }

      console.log("✅ Returning enrollment from student_enrollment");
      return {
        success: true,
        enrollmentStatus: {
          isEnrolled: true,
          status: enrollmentRecord.status,
          semester: Number(enrollmentRecord.semester),
          academicYear: Number(enrollmentRecord.academic_year),
          schoolYear: enrollmentRecord.school_year,
          courseId: enrollmentRecord.course_id,
        },
      };
    } catch (error) {
      console.error("💥 Error fetching enrollment status:", error);
      return serverError(
        "Failed to fetch enrollment status",
        error instanceof Error ? error.message : String(error)
      );
    }
  },
  {
    query: t.Object({
      studentId: t.String(),
      semester: t.String(),
      schoolYear: t.String(),
    }),
  }
);
