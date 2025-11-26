import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get the user role from Clerk metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userRole = user.publicMetadata?.role as string | undefined;

  // Redirect based on role
  if (userRole === "student") {
    redirect("/dashboard/student");
  } else if (userRole === "faculty") {
    redirect("/dashboard/faculty");
  } else {
    // No role assigned, redirect to onboarding
    redirect("/onboarding");
  }
}
