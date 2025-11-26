"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, TrendingUp, Download, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const gradeData = [
  {
    classCode: "CS 401",
    className: "Advanced Web Development",
    section: "A",
    students: [
      {
        id: 1,
        studentId: "2024-CS-001",
        name: "John Doe",
        midterm: 85,
        finals: 88,
        assignments: 90,
        project: 92,
        finalGrade: "A",
        gpa: 3.85,
      },
      {
        id: 2,
        studentId: "2024-CS-002",
        name: "Jane Smith",
        midterm: 92,
        finals: 95,
        assignments: 94,
        project: 96,
        finalGrade: "A",
        gpa: 3.92,
      },
      {
        id: 3,
        studentId: "2024-CS-005",
        name: "David Brown",
        midterm: 78,
        finals: 82,
        assignments: 80,
        project: 85,
        finalGrade: "B+",
        gpa: 3.72,
      },
    ],
  },
  {
    classCode: "CS 305",
    className: "Database Systems",
    section: "B",
    students: [
      {
        id: 2,
        studentId: "2024-CS-002",
        name: "Jane Smith",
        midterm: 90,
        finals: 93,
        assignments: 91,
        project: 94,
        finalGrade: "A",
        gpa: 3.92,
      },
      {
        id: 3,
        studentId: "2024-CS-003",
        name: "Michael Johnson",
        midterm: 82,
        finals: 85,
        assignments: 84,
        project: 88,
        finalGrade: "B+",
        gpa: 3.67,
      },
    ],
  },
  {
    classCode: "CS 201",
    className: "Data Structures",
    section: "A",
    students: [
      {
        id: 3,
        studentId: "2024-CS-003",
        name: "Michael Johnson",
        midterm: 88,
        finals: 90,
        assignments: 87,
        project: 89,
        finalGrade: "A-",
        gpa: 3.67,
      },
    ],
  },
  {
    classCode: "CS 101",
    className: "Introduction to Programming",
    section: "C",
    students: [
      {
        id: 4,
        studentId: "2024-CS-004",
        name: "Emily Williams",
        midterm: 95,
        finals: 97,
        assignments: 96,
        project: 98,
        finalGrade: "A",
        gpa: 3.95,
      },
    ],
  },
];

export default function FacultyGradesPage() {
  const router = useRouter();
  const { sessionClaims, isLoaded } = useAuth();
  const [selectedClass, setSelectedClass] = useState(gradeData[0].classCode);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect non-faculty users to student dashboard
  useEffect(() => {
    if (isLoaded) {
      const userRole = (sessionClaims?.metadata as { role?: string })?.role;
      if (userRole !== "faculty") {
        router.push("/dashboard/student");
      }
    }
  }, [isLoaded, sessionClaims, router]);

  const currentClass = gradeData.find((c) => c.classCode === selectedClass);
  const filteredStudents =
    currentClass?.students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const calculateAverage = (field: keyof (typeof currentClass.students)[0]) => {
    if (!currentClass || currentClass.students.length === 0) return 0;
    const sum = currentClass.students.reduce((acc, student) => {
      const value = student[field];
      return acc + (typeof value === "number" ? value : 0);
    }, 0);
    return (sum / currentClass.students.length).toFixed(1);
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A" || grade === "A+")
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (grade === "A-" || grade === "B+")
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    if (grade === "B" || grade === "B-")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Grades Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage student grades for your classes
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Grades
        </Button>
      </div>

      {/* Class Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentClass?.students.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              In {currentClass?.classCode}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage("midterm")}%
            </div>
            <p className="text-xs text-muted-foreground">Midterm average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage("finals")}%
            </div>
            <p className="text-xs text-muted-foreground">Finals average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {gradeData.map((cls) => (
                    <SelectItem key={cls.classCode} value={cls.classCode}>
                      {cls.classCode} - {cls.className} (Section {cls.section})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentClass?.classCode} - {currentClass?.className}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Midterm</TableHead>
                  <TableHead className="text-center">Finals</TableHead>
                  <TableHead className="text-center">Assignments</TableHead>
                  <TableHead className="text-center">Project</TableHead>
                  <TableHead className="text-center">Final Grade</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.studentId}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-center">
                      {student.midterm}%
                    </TableCell>
                    <TableCell className="text-center">
                      {student.finals}%
                    </TableCell>
                    <TableCell className="text-center">
                      {student.assignments}%
                    </TableCell>
                    <TableCell className="text-center">
                      {student.project}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getGradeColor(student.finalGrade)}>
                        {student.finalGrade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search query
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Class Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["A", "B+", "B", "C+", "C"].map((grade) => {
              const count =
                currentClass?.students.filter((s) => s.finalGrade === grade)
                  .length || 0;
              return (
                <div key={grade} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">
                    Grade {grade}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
