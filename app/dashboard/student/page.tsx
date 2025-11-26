import { StudentDashboard } from "../_components/student-dashboard";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getStudentEnrollmentStatus,
  getCurrentAcademicSettings,
} from "@/lib/enrollment";
import { redirect } from "next/navigation";

export default async function StudentDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get the student ID from Clerk metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userRole = user.publicMetadata?.role as string | undefined;
  const studentId = user.publicMetadata?.studentId as string | undefined;

  // Verify user is a student
  if (userRole !== "student") {
    redirect("/onboarding");
  }

  if (!studentId) {
    // If no student ID, redirect to onboarding
    redirect("/onboarding");
  }

  // Get current academic settings
  const { semester, curriculumYear, schoolYear } =
    await getCurrentAcademicSettings();

  // Get student enrollment status
  const enrollmentStatus = await getStudentEnrollmentStatus(
    studentId,
    semester,
    curriculumYear,
  );

  return (
    <StudentDashboard
      enrollmentStatus={enrollmentStatus}
      currentSemester={semester}
      currentCurriculumYear={curriculumYear}
      schoolYear={schoolYear}
    />
  );
}
