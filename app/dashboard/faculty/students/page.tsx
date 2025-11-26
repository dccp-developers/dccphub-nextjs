"use client";

import { Badge } from "@/components/ui/badge";
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
  Search,
  User,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const students = [
  {
    id: 1,
    studentId: "2024-CS-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@student.edu",
    phone: "+1 (555) 123-4567",
    avatar: "",
    program: "Computer Science",
    year: "4th Year",
    enrolledClasses: ["CS 401", "CS 305"],
    gpa: "3.85",
    attendance: "92%",
    status: "Active",
  },
  {
    id: 2,
    studentId: "2024-CS-002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@student.edu",
    phone: "+1 (555) 234-5678",
    avatar: "",
    program: "Computer Science",
    year: "3rd Year",
    enrolledClasses: ["CS 305", "CS 201"],
    gpa: "3.92",
    attendance: "95%",
    status: "Active",
  },
  {
    id: 3,
    studentId: "2024-CS-003",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.j@student.edu",
    phone: "+1 (555) 345-6789",
    avatar: "",
    program: "Computer Science",
    year: "2nd Year",
    enrolledClasses: ["CS 201", "CS 101"],
    gpa: "3.67",
    attendance: "88%",
    status: "Active",
  },
  {
    id: 4,
    studentId: "2024-CS-004",
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.w@student.edu",
    phone: "+1 (555) 456-7890",
    avatar: "",
    program: "Computer Science",
    year: "1st Year",
    enrolledClasses: ["CS 101"],
    gpa: "3.95",
    attendance: "97%",
    status: "Active",
  },
  {
    id: 5,
    studentId: "2024-CS-005",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@student.edu",
    phone: "+1 (555) 567-8901",
    avatar: "",
    program: "Computer Science",
    year: "4th Year",
    enrolledClasses: ["CS 401"],
    gpa: "3.72",
    attendance: "85%",
    status: "Active",
  },
];

export default function FacultyStudentsPage() {
  const router = useRouter();
  const { sessionClaims, isLoaded } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Redirect non-faculty users to student dashboard
  useEffect(() => {
    if (isLoaded) {
      const userRole = (sessionClaims?.metadata as { role?: string })?.role;
      if (userRole !== "faculty") {
        router.push("/dashboard/student");
      }
    }
  }, [isLoaded, sessionClaims, router]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      classFilter === "all" || student.enrolledClasses.includes(classFilter);

    const matchesYear = yearFilter === "all" || student.year === yearFilter;

    return matchesSearch && matchesClass && matchesYear;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Students</h1>
        <p className="text-muted-foreground mt-2">
          View and manage students enrolled in your classes
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
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="CS 401">CS 401</SelectItem>
                  <SelectItem value="CS 305">CS 305</SelectItem>
                  <SelectItem value="CS 201">CS 201</SelectItem>
                  <SelectItem value="CS 101">CS 101</SelectItem>
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Year Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Year Levels</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary Stats */}
            <div className="flex items-center gap-6 pt-2 border-t">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">
                    {filteredStudents.length}
                  </span>{" "}
                  Student{filteredStudents.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Student Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(student.firstName, student.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {student.studentId}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {student.year}
                    </Badge>
                  </div>
                </div>

                {/* Student Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>GPA</span>
                    </div>
                    <p className="text-lg font-semibold">{student.gpa}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Attendance</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {student.attendance}
                    </p>
                  </div>
                </div>

                {/* Enrolled Classes */}
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Enrolled Classes</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {student.enrolledClasses.map((cls, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
