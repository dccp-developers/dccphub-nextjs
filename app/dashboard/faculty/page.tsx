import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FacultyDashboardContent } from "./_components/faculty-dashboard-content";
import { FacultyDashboardSkeleton } from "./_components/skeletons/faculty-dashboard-skeleton";

export default async function FacultyDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get the faculty info from Clerk metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userRole = user.publicMetadata?.role as string | undefined;
  const facultyId = user.publicMetadata?.facultyId as string | undefined;
  const firstName = user.publicMetadata?.firstName as string | undefined;
  const lastName = user.publicMetadata?.lastName as string | undefined;
  const department = user.publicMetadata?.department as string | undefined;

  // Verify user is faculty
  if (userRole !== "faculty") {
    redirect("/onboarding");
  }

  if (!facultyId) {
    redirect("/onboarding");
  }

  return (
    <Suspense fallback={<FacultyDashboardSkeleton />}>
      <FacultyDashboardContent
        facultyId={facultyId}
        firstName={firstName}
        lastName={lastName}
        department={department}
      />
    </Suspense>
  );
}
