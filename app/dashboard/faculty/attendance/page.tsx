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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Check,
  X,
  Download,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const attendanceData = [
  {
    classCode: "CS 401",
    className: "Advanced Web Development",
    section: "A",
    schedule: "Monday, Wednesday, Friday",
    students: [
      {
        id: 1,
        studentId: "2024-CS-001",
        name: "John Doe",
        totalSessions: 30,
        present: 28,
        absent: 2,
        late: 0,
        attendanceRate: 93,
      },
      {
        id: 2,
        studentId: "2024-CS-002",
        name: "Jane Smith",
        totalSessions: 30,
        present: 30,
        absent: 0,
        late: 0,
        attendanceRate: 100,
      },
      {
        id: 3,
        studentId: "2024-CS-005",
        name: "David Brown",
        totalSessions: 30,
        present: 25,
        absent: 4,
        late: 1,
        attendanceRate: 83,
      },
    ],
  },
  {
    classCode: "CS 305",
    className: "Database Systems",
    section: "B",
    schedule: "Tuesday, Thursday",
    students: [
      {
        id: 2,
        studentId: "2024-CS-002",
        name: "Jane Smith",
        totalSessions: 24,
        present: 23,
        absent: 1,
        late: 0,
        attendanceRate: 96,
      },
      {
        id: 3,
        studentId: "2024-CS-003",
        name: "Michael Johnson",
        totalSessions: 24,
        present: 21,
        absent: 2,
        late: 1,
        attendanceRate: 88,
      },
    ],
  },
  {
    classCode: "CS 201",
    className: "Data Structures",
    section: "A",
    schedule: "Monday, Wednesday",
    students: [
      {
        id: 3,
        studentId: "2024-CS-003",
        name: "Michael Johnson",
        totalSessions: 20,
        present: 18,
        absent: 1,
        late: 1,
        attendanceRate: 90,
      },
    ],
  },
  {
    classCode: "CS 101",
    className: "Introduction to Programming",
    section: "C",
    schedule: "Tuesday, Friday",
    students: [
      {
        id: 4,
        studentId: "2024-CS-004",
        name: "Emily Williams",
        totalSessions: 20,
        present: 20,
        absent: 0,
        late: 0,
        attendanceRate: 100,
      },
    ],
  },
];

export default function FacultyAttendancePage() {
  const router = useRouter();
  const { sessionClaims, isLoaded } = useAuth();
  const [selectedClass, setSelectedClass] = useState(
    attendanceData[0].classCode,
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [markingMode, setMarkingMode] = useState(false);

  // Redirect non-faculty users to student dashboard
  useEffect(() => {
    if (isLoaded) {
      const userRole = (sessionClaims?.metadata as { role?: string })?.role;
      if (userRole !== "faculty") {
        router.push("/dashboard/student");
      }
    }
  }, [isLoaded, sessionClaims, router]);

  const currentClass = attendanceData.find(
    (c) => c.classCode === selectedClass,
  );

  const calculateClassAverage = () => {
    if (!currentClass || currentClass.students.length === 0) return 0;
    const sum = currentClass.students.reduce(
      (acc, student) => acc + student.attendanceRate,
      0,
    );
    return (sum / currentClass.students.length).toFixed(1);
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (rate >= 75)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  const lowAttendanceCount =
    currentClass?.students.filter((s) => s.attendanceRate < 75).length || 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Attendance Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage student attendance for your classes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setMarkingMode(!markingMode)}>
            {markingMode ? "Cancel" : "Mark Attendance"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <div className="text-2xl font-bold">{calculateClassAverage()}%</div>
            <p className="text-xs text-muted-foreground">
              Overall attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Attendance
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowAttendanceCount}</div>
            <p className="text-xs text-muted-foreground">Students below 75%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentClass?.students[0]?.totalSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total this semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Selection and Date */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {attendanceData.map((cls) => (
                  <SelectItem key={cls.classCode} value={cls.classCode}>
                    {cls.classCode} - {cls.className} (Section {cls.section})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {markingMode && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )}
          </div>
          {currentClass && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Schedule:{" "}
                <span className="font-medium text-foreground">
                  {currentClass.schedule}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {markingMode
              ? `Mark Attendance - ${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
              : "Attendance Overview"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {markingMode && (
                    <TableHead className="text-center w-[100px]">
                      Present
                    </TableHead>
                  )}
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  {!markingMode && (
                    <>
                      <TableHead className="text-center">
                        Total Sessions
                      </TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">
                        Attendance Rate
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClass?.students.map((student) => (
                  <TableRow key={student.id}>
                    {markingMode && (
                      <TableCell className="text-center">
                        <Checkbox defaultChecked />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      {student.studentId}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    {!markingMode && (
                      <>
                        <TableCell className="text-center">
                          {student.totalSessions}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Check className="h-4 w-4 text-green-600" />
                            {student.present}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <X className="h-4 w-4 text-red-600" />
                            {student.absent}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {student.late}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={getAttendanceColor(
                              student.attendanceRate,
                            )}
                          >
                            {student.attendanceRate}%
                          </Badge>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {markingMode && (
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setMarkingMode(false)}>
                Cancel
              </Button>
              <Button>Submit Attendance</Button>
            </div>
          )}

          {!currentClass?.students.length && (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground text-center">
                No students enrolled in this class
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low Attendance Alert */}
      {!markingMode && lowAttendanceCount > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-600">
                Low Attendance Alert
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {lowAttendanceCount} student
              {lowAttendanceCount !== 1 ? "s have" : " has"} attendance below
              75%. Consider reaching out to discuss their attendance.
            </p>
            <div className="mt-4 space-y-2">
              {currentClass?.students
                .filter((s) => s.attendanceRate < 75)
                .map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.studentId}
                      </p>
                    </div>
                    <Badge
                      className={getAttendanceColor(student.attendanceRate)}
                    >
                      {student.attendanceRate}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
