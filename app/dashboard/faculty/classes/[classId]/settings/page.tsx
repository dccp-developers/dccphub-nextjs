import { laravelApi } from "@/lib/laravel-api";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClassSettingsClient } from "./_components/class-settings-client";

interface PageProps {
    params: Promise<{ classId: string }>;
}

export default async function ClassSettingsPage({ params }: PageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Verify faculty access
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const facultyId = user.publicMetadata?.facultyId as string | undefined;

    if (user.publicMetadata?.role !== "faculty" || !facultyId) {
        redirect("/onboarding");
    }

    const { classId } = await params;

    try {
        const classDetails = await laravelApi.getClassDetails(parseInt(classId));

        if (!classDetails?.data) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <h1 className="text-2xl font-bold">Class Not Found</h1>
                    <p className="text-muted-foreground">The requested class could not be found.</p>
                </div>
            );
        }

        return <ClassSettingsClient classData={classDetails.data} />;
    } catch (error) {
        console.error("Error loading class settings:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold text-destructive">Error</h1>
                <p className="text-muted-foreground">Failed to load class settings.</p>
            </div>
        );
    }
}
