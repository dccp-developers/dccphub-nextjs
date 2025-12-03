"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useSemester } from "@/contexts/semester-context";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface FacultyDashboardClientProps {
  facultyId: string;
  firstName?: string;
  lastName?: string;
  department?: string;
}

interface FacultyData {
  id: string;
  faculty_id_number: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  department: string;
  office_hours: string | null;
  birth_date: string;
  address_line1: string;
  biography: string;
  education: string;
  courses_taught: string | null;
  photo_url: string | null;
  status: string;
  gender: string;
  age: number;
  created_at: string;
  updated_at: string;
  classes: Array<{
    id: number;
    subject_code: string;
    subject_title: string;
    section: string;
    school_year: string;
    semester: string;
    classification: string;
    maximum_slots: number;
    grade_level: string;
    student_count: string;
    display_info: string;
  }>;
  account: string;
  department_relation: string;
  class_enrollments_count: number;
  classes_count: number;
}

export function FacultyDashboardClient({
  facultyId,
  firstName,
  lastName,
  department,
}: FacultyDashboardClientProps) {
  const { semester, schoolYear, isLoading: semesterLoading } = useSemester();
  const { user, isLoaded: userLoaded } = useUser();
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [classCount, setClassCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  // Fetch faculty data when component mounts or semester/year changes
  useEffect(() => {
    if (!facultyId || !userLoaded) return;

    async function fetchFacultyData() {
      try {
        setIsLoading(true);
        console.log(`🔄 Fetching faculty data for ${facultyId}, semester: ${semester}, year: ${schoolYear}`);

        const response = await fetch(`/api/faculty/${facultyId}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch faculty data");
        }

        const data = await response.json();
        console.log(`✅ Fetched faculty data:`, data);

        if (data?.data) {
          setFacultyData(data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching faculty data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFacultyData();
  }, [facultyId, userLoaded]);

  // Filter and calculate stats when faculty data or semester/year changes
  useEffect(() => {
    if (!facultyData) return;

    // Filter classes by current semester
    const filteredClasses = facultyData.classes?.filter(cls => {
      const clsSemester = cls.semester?.toString() || "";
      const clsSchoolYear = cls.school_year?.toString() || "";
      const matchesSemester = clsSemester === semester;
      const matchesYear = clsSchoolYear.includes(schoolYear);
      return matchesSemester && matchesYear;
    }) || [];

    const classCount = filteredClasses.length;
    const totalStudents = filteredClasses.reduce(
      (sum, cls) => sum + (parseInt(cls.student_count) || 0),
      0
    );

    console.log(
      `🔄 Dashboard Filter Changed - Semester ${semester}, Year ${schoolYear}: showing ${classCount} classes, ${totalStudents} students`
    );

    setClassCount(classCount);
    setTotalStudents(totalStudents);
  }, [facultyData, semester, schoolYear]);

  // Show loading state
  if (semesterLoading || isLoading || !userLoaded) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64 animate-pulse" />
          <div className="h-4 bg-muted rounded w-96 animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded w-32 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {firstName} {lastName}
        </h1>
        <p className="text-muted-foreground">
          {department ? `Department of ${department}` : "Faculty Dashboard"} •{" "}
          {semester === "1"
            ? "1st Semester"
            : semester === "2"
            ? "2nd Semester"
            : semester}{" "}
          {schoolYear}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classCount}</div>
            <p className="text-xs text-muted-foreground">
              {semester === "1" ? "1st" : semester === "2" ? "2nd" : semester} semester classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Assignments to grade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Average across classes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Today&apos;s Schedule</CardTitle>
            </div>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              No classes scheduled for today
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <CardTitle>Recent Activities</CardTitle>
            </div>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              No recent activities
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Upcoming Deadlines</CardTitle>
            </div>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              No upcoming deadlines
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common faculty tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <BookOpen className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">My Classes</h3>
              <p className="text-sm text-muted-foreground">
                View and manage classes
              </p>
            </button>

            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <Users className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">Students</h3>
              <p className="text-sm text-muted-foreground">
                View student records
              </p>
            </button>

            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <FileText className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">Grades</h3>
              <p className="text-sm text-muted-foreground">
                Submit and manage grades
              </p>
            </button>

            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <Calendar className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">Attendance</h3>
              <p className="text-sm text-muted-foreground">Mark attendance</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
