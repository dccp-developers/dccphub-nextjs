import { laravelApi, LaravelApiHelpers } from "@/lib/laravel-api";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ClassCardSkeleton } from "./_components/class-card-skeleton";
import { EnhancedClassesLayout } from "./_components/enhanced-classes-layout";
import { ClassesList } from "./_components/classes-list";

async function getClasses(facultyId: string) {
    try {
        console.log("🚀 Fetching faculty classes for ID:", facultyId);

        // Fetch faculty data from Laravel API
        const facultyData = await laravelApi.getFaculty(facultyId, { next: { revalidate: 60 } });

        if (!facultyData?.data) {
            return [];
        }

        const faculty = facultyData.data;
        const facultyClasses = faculty.classes || [];
        console.log(`✅ Found faculty: ${faculty.full_name} with ${facultyClasses.length} classes`);

        // Map to frontend format using the faculty classes data directly
        const mappedClasses = facultyClasses.map((cls) => {
            console.log(`📚 Class ${cls.id} (${cls.subject_code}): semester="${cls.semester}"`);

            // Generate a consistent color based on subject code
            const colors = ["blue", "green", "purple", "orange", "pink", "teal", "indigo"];
            const colorIndex = cls.subject_code
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

            return {
                id: cls.id,
                subjectCode: cls.subject_code,
                subjectName: cls.subject_title,
                section: cls.section,
                semester: cls.semester, // Already a string "1" or "2"
                originalSemester: cls.semester === "1" ? "1st Semester" : cls.semester === "2" ? "2nd Semester" : cls.semester,
                schoolYear: cls.school_year,
                enrolledStudents: parseInt(cls.student_count) || 0, // Parse string to number
                maximumSlots: cls.maximum_slots || 30,
                credits: 3, // Default as not in API yet
                lecture: 3, // Default
                laboratory: 0, // Default
                classification: cls.classification || "College",
                gradeLevel: cls.grade_level || "N/A",
                faculty: faculty.full_name,
                department: faculty.department,
                color: colors[colorIndex],
                status: "Active",
                progress: 0, // Default
                completionRate: 0, // Default
                gradeDistribution: [
                    { grade: "A", count: 0 },
                    { grade: "B", count: 0 },
                    { grade: "C", count: 0 },
                    { grade: "D", count: 0 },
                    { grade: "F", count: 0 },
                ],
                schedules: [], // No schedule in faculty.classes - would need separate API call
                formattedSchedule: "Schedule not available",
                isFull: parseInt(cls.student_count) >= (cls.maximum_slots || 30),
                availableSlots: Math.max(0, (cls.maximum_slots || 30) - parseInt(cls.student_count || "0")),
            };
        });

        return mappedClasses;
    } catch (error) {
        console.error("💥 Error fetching faculty classes:", error);
        return [];
    }
}

export default async function FacultyClassesPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const facultyId = user.publicMetadata?.facultyId as string;

    if (!facultyId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-muted-foreground">You do not have a faculty ID associated with your account.</p>
            </div>
        );
    }

    const classes = await getClasses(facultyId);

    return (
        <Suspense
            fallback={
                <div className="p-6 max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-24">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ClassCardSkeleton key={i} />
                    ))}
                </div>
            }
        >
            <EnhancedClassesLayout initialClasses={classes} />
        </Suspense>
    );
}
