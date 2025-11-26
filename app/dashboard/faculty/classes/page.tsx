"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Search,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const classes = [
  {
    id: 1,
    code: "CS 401",
    name: "Advanced Web Development",
    section: "A",
    credits: 3,
    semester: "1st Semester",
    year: "2024-2025",
    schedule: [
      {
        day: "Monday",
        time: "9:00 AM - 10:30 AM",
        room: "Room 301, Building A",
        type: "Lecture",
      },
      {
        day: "Wednesday",
        time: "9:00 AM - 10:30 AM",
        room: "Room 301, Building A",
        type: "Lecture",
      },
      {
        day: "Friday",
        time: "2:00 PM - 4:00 PM",
        room: "Lab 205, Building B",
        type: "Lab",
      },
    ],
    enrolledStudents: 45,
    capacity: 50,
    color: "bg-blue-500",
    courseType: "Lecture & Lab",
    averageGrade: "B+",
    attendanceRate: "92%",
    pendingAssignments: 3,
  },
  {
    id: 2,
    code: "CS 305",
    name: "Database Systems",
    section: "B",
    credits: 4,
    semester: "1st Semester",
    year: "2024-2025",
    schedule: [
      {
        day: "Tuesday",
        time: "11:00 AM - 12:30 PM",
        room: "Room 402, Building A",
        type: "Lecture",
      },
      {
        day: "Thursday",
        time: "11:00 AM - 12:30 PM",
        room: "Room 402, Building A",
        type: "Lecture",
      },
      {
        day: "Thursday",
        time: "2:00 PM - 4:00 PM",
        room: "Lab 301, Building B",
        type: "Lab",
      },
    ],
    enrolledStudents: 38,
    capacity: 45,
    color: "bg-green-500",
    courseType: "Lecture & Lab",
    averageGrade: "A-",
    attendanceRate: "88%",
    pendingAssignments: 5,
  },
  {
    id: 3,
    code: "CS 201",
    name: "Data Structures",
    section: "A",
    credits: 4,
    semester: "1st Semester",
    year: "2024-2025",
    schedule: [
      {
        day: "Monday",
        time: "2:00 PM - 3:30 PM",
        room: "Room 501, Building C",
        type: "Lecture",
      },
      {
        day: "Wednesday",
        time: "2:00 PM - 3:30 PM",
        room: "Room 501, Building C",
        type: "Lecture",
      },
    ],
    enrolledStudents: 52,
    capacity: 60,
    color: "bg-purple-500",
    courseType: "Lecture",
    averageGrade: "B",
    attendanceRate: "85%",
    pendingAssignments: 2,
  },
  {
    id: 4,
    code: "CS 101",
    name: "Introduction to Programming",
    section: "C",
    credits: 3,
    semester: "1st Semester",
    year: "2024-2025",
    schedule: [
      {
        day: "Tuesday",
        time: "4:00 PM - 5:30 PM",
        room: "Room 302, Building A",
        type: "Lecture",
      },
      {
        day: "Friday",
        time: "10:00 AM - 12:00 PM",
        room: "Lab 101, Building B",
        type: "Lab",
      },
    ],
    enrolledStudents: 42,
    capacity: 50,
    color: "bg-orange-500",
    courseType: "Lecture & Lab",
    averageGrade: "B+",
    attendanceRate: "90%",
    pendingAssignments: 1,
  },
];

export default function FacultyClassesPage() {
  const router = useRouter();
  const { sessionClaims, isLoaded } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2024-2025");

  // Redirect non-faculty users to student dashboard
  useEffect(() => {
    if (isLoaded) {
      const userRole = (sessionClaims?.metadata as { role?: string })?.role;
      if (userRole !== "faculty") {
        router.push("/dashboard/student");
      }
    }
  }, [isLoaded, sessionClaims, router]);

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.section.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSemester =
      semesterFilter === "all" || classItem.semester === semesterFilter;

    const matchesYear = yearFilter === "all" || classItem.year === yearFilter;

    return matchesSearch && matchesSemester && matchesYear;
  });

  const totalStudents = filteredClasses.reduce(
    (sum, c) => sum + c.enrolledStudents,
    0,
  );
  const totalPendingAssignments = filteredClasses.reduce(
    (sum, c) => sum + c.pendingAssignments,
    0,
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Class Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your classes and view student enrollment
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="School Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary Stats */}
            <div className="flex items-center gap-6 pt-2 border-t">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">
                    {filteredClasses.length}
                  </span>{" "}
                  Class{filteredClasses.length !== 1 ? "es" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">{totalStudents}</span> Total
                  Students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">
                    {totalPendingAssignments}
                  </span>{" "}
                  Pending Assignment{totalPendingAssignments !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class List */}
      <div className="space-y-3">
        {filteredClasses.map((classItem) => (
          <Card
            key={classItem.id}
            className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Color Indicator */}
                <div
                  className={`w-1.5 h-full rounded-full ${classItem.color} min-h-[100px]`}
                />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {classItem.code} - Section {classItem.section}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {classItem.credits} Credits
                        </Badge>
                      </div>
                      <p className="text-base font-medium text-foreground mb-2">
                        {classItem.name}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            <span className="font-semibold">
                              {classItem.enrolledStudents}
                            </span>
                            <span className="text-muted-foreground">
                              /{classItem.capacity}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            Avg:{" "}
                            <span className="font-semibold">
                              {classItem.averageGrade}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            Attendance:{" "}
                            <span className="font-semibold">
                              {classItem.attendanceRate}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            <span className="font-semibold">
                              {classItem.pendingAssignments}
                            </span>{" "}
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>

                  {/* Schedule Info */}
                  <div className="space-y-1">
                    {classItem.schedule.map((sched, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 text-sm text-muted-foreground"
                      >
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-medium">{sched.day}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-[180px]">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{sched.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{sched.room}</span>
                        </div>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {sched.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No classes found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
