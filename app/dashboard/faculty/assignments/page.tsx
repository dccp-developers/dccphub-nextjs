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
import {
  Search,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const assignmentsData = [
  {
    classCode: "CS 401",
    className: "Advanced Web Development",
    section: "A",
    assignments: [
      {
        id: 1,
        title: "React Components Assignment",
        description: "Build a component library using React hooks",
        dueDate: "2024-12-15",
        totalPoints: 100,
        submissions: 42,
        totalStudents: 45,
        graded: 38,
        pending: 4,
        status: "active",
      },
      {
        id: 2,
        title: "RESTful API Development",
        description: "Create a RESTful API with Express.js",
        dueDate: "2024-12-20",
        totalPoints: 150,
        submissions: 45,
        totalStudents: 45,
        graded: 45,
        pending: 0,
        status: "graded",
      },
      {
        id: 3,
        title: "Final Project: Full Stack Application",
        description: "Build a complete full-stack web application",
        dueDate: "2024-12-30",
        totalPoints: 200,
        submissions: 15,
        totalStudents: 45,
        graded: 0,
        pending: 15,
        status: "active",
      },
    ],
  },
  {
    classCode: "CS 305",
    className: "Database Systems",
    section: "B",
    assignments: [
      {
        id: 4,
        title: "Database Design Exercise",
        description: "Design a normalized database schema",
        dueDate: "2024-12-18",
        totalPoints: 100,
        submissions: 35,
        totalStudents: 38,
        graded: 30,
        pending: 5,
        status: "active",
      },
      {
        id: 5,
        title: "SQL Query Assignment",
        description: "Complex SQL queries and optimization",
        dueDate: "2024-12-25",
        totalPoints: 120,
        submissions: 38,
        totalStudents: 38,
        graded: 38,
        pending: 0,
        status: "graded",
      },
    ],
  },
  {
    classCode: "CS 201",
    className: "Data Structures",
    section: "A",
    assignments: [
      {
        id: 6,
        title: "Binary Search Tree Implementation",
        description: "Implement BST with insertion and deletion",
        dueDate: "2024-12-22",
        totalPoints: 100,
        submissions: 48,
        totalStudents: 52,
        graded: 40,
        pending: 8,
        status: "active",
      },
    ],
  },
  {
    classCode: "CS 101",
    className: "Introduction to Programming",
    section: "C",
    assignments: [
      {
        id: 7,
        title: "Basic Programming Concepts",
        description: "Variables, loops, and conditionals",
        dueDate: "2024-12-10",
        totalPoints: 50,
        submissions: 42,
        totalStudents: 42,
        graded: 42,
        pending: 0,
        status: "graded",
      },
    ],
  },
];

export default function FacultyAssignmentsPage() {
  const router = useRouter();
  const { sessionClaims, isLoaded } = useAuth();
  const [selectedClass, setSelectedClass] = useState(
    assignmentsData[0].classCode,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Redirect non-faculty users to student dashboard
  useEffect(() => {
    if (isLoaded) {
      const userRole = (sessionClaims?.metadata as { role?: string })?.role;
      if (userRole !== "faculty") {
        router.push("/dashboard/student");
      }
    }
  }, [isLoaded, sessionClaims, router]);

  const currentClass = assignmentsData.find(
    (c) => c.classCode === selectedClass,
  );
  const filteredAssignments =
    currentClass?.assignments.filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || assignment.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const totalAssignments = currentClass?.assignments.length || 0;
  const totalPending =
    currentClass?.assignments.reduce((sum, a) => sum + a.pending, 0) || 0;
  const activeAssignments =
    currentClass?.assignments.filter((a) => a.status === "active").length || 0;

  const getStatusBadge = (status: string) => {
    if (status === "graded") {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Graded
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        <Clock className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  };

  const getSubmissionColor = (submissions: number, total: number) => {
    const percentage = (submissions / total) * 100;
    if (percentage === 100) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground mt-2">
            Manage assignments and grade submissions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assignments
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              In {currentClass?.classCode}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssignments}</div>
            <p className="text-xs text-muted-foreground">Ongoing assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Grading
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">
              Submissions to grade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentClass?.assignments.reduce(
                (sum, a) => sum + a.graded,
                0,
              ) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total graded submissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {assignmentsData.map((cls) => (
                  <SelectItem key={cls.classCode} value={cls.classCode}>
                    {cls.classCode} - {cls.className} (Section {cls.section})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
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
                  <TableHead>Assignment</TableHead>
                  <TableHead className="text-center">Due Date</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Submissions</TableHead>
                  <TableHead className="text-center">Graded</TableHead>
                  <TableHead className="text-center">Pending</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {assignment.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span
                            className={
                              isOverdue(assignment.dueDate) &&
                              assignment.status === "active"
                                ? "text-red-600"
                                : ""
                            }
                          >
                            {formatDate(assignment.dueDate)}
                          </span>
                        </div>
                        {isOverdue(assignment.dueDate) &&
                          assignment.status === "active" && (
                            <Badge
                              variant="destructive"
                              className="text-xs mt-1"
                            >
                              Overdue
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {assignment.totalPoints}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={getSubmissionColor(
                          assignment.submissions,
                          assignment.totalStudents,
                        )}
                      >
                        {assignment.submissions}/{assignment.totalStudents}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {assignment.graded}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {assignment.pending > 0 ? (
                          <>
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600 font-medium">
                              {assignment.pending}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(assignment.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {assignment.pending > 0 && (
                          <Button variant="outline" size="sm">
                            Grade ({assignment.pending})
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAssignments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No assignments found
              </h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your filters or create a new assignment
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Grading Alert */}
      {totalPending > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-600">
                Pending Submissions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You have {totalPending} submission{totalPending !== 1 ? "s" : ""}{" "}
              waiting to be graded.
            </p>
            <div className="space-y-2">
              {currentClass?.assignments
                .filter((a) => a.pending > 0)
                .map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {formatDate(assignment.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {assignment.pending} pending
                      </Badge>
                      <Button size="sm">Grade Now</Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
