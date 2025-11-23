import { DashboardStats } from "./dashboard-stats";
import { CourseList } from "./course-list";
import { AssignmentList } from "./assignment-list";
import { ScheduleWidget } from "./schedule-widget";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar as CalendarIcon,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { EnrollmentStatus } from "@/lib/enrollment";

interface StudentDashboardProps {
  enrollmentStatus: EnrollmentStatus;
  currentSemester: string;
  currentCurriculumYear: string;
  schoolYear: string;
}

export function StudentDashboard({
  enrollmentStatus,
  currentSemester,
  currentCurriculumYear,
  schoolYear,
}: StudentDashboardProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Helper function to get status badge variant
  const getStatusVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "enrolled":
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "dropped":
      case "inactive":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Good Afternoon, Student
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <CalendarIcon className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {enrollmentStatus.isEnrolled && (
            <>
              <Button variant="outline">View Full Schedule</Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Enrollment Status Alert */}
      {enrollmentStatus.isEnrolled ? (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <UserCheck className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900 dark:text-green-100">
            Enrolled for School Year {schoolYear} - Semester {currentSemester}
          </AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200 flex items-center gap-2">
            Status:{" "}
            <Badge variant={getStatusVariant(enrollmentStatus.status)}>
              {enrollmentStatus.status}
            </Badge>
            {currentCurriculumYear && (
              <span className="text-xs">
                (Curriculum Year: {currentCurriculumYear})
              </span>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Enrolled</AlertTitle>
          <AlertDescription>
            You are not currently enrolled for School Year {schoolYear} -
            Semester {currentSemester}. Please contact the registrar&apos;s
            office or complete your enrollment to access full dashboard
            features.
          </AlertDescription>
        </Alert>
      )}

      {enrollmentStatus.isEnrolled && <DashboardStats />}

      {enrollmentStatus.isEnrolled ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Daily Focus (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScheduleWidget className="col-span-full" />
              <AssignmentList className="col-span-full" />
            </div>
          </div>

          {/* Right Column: Overview (1/3 width on large screens) */}
          <div className="space-y-6">
            <CourseList className="col-span-full" />

            {/* Quick Actions / Exam Countdown Placeholder */}
            <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  📝 Request Transcript
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  💳 Make a Payment
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  📚 Reserve Library Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Not enrolled view - show limited information
        <div className="grid grid-cols-1 gap-6">
          <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm text-center">
            <h3 className="text-xl font-semibold mb-4">
              Limited Access - Not Enrolled
            </h3>
            <p className="text-muted-foreground mb-6">
              You currently do not have access to the full dashboard because you
              are not enrolled for School Year {schoolYear} - Semester{" "}
              {currentSemester}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Complete Enrollment</Button>
              <Button variant="outline" size="lg">
                Contact Registrar
              </Button>
            </div>
          </div>

          {/* Limited Quick Actions for non-enrolled students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-4">Available Actions</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  📝 View Profile
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  📚 Browse Courses
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  💬 Contact Support
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-4">Enrollment Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">School Year</p>
                  <p className="font-medium">{schoolYear || "Not Set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Semester</p>
                  <p className="font-medium">Semester {currentSemester}</p>
                </div>
                {currentCurriculumYear && (
                  <div>
                    <p className="text-muted-foreground">Curriculum Year</p>
                    <p className="font-medium">{currentCurriculumYear}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Enrollment Status</p>
                  <Badge variant="destructive">Not Enrolled</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
