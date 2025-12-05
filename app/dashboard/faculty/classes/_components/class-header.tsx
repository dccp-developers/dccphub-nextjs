"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getClassColor } from "../_utils/colors";

type ClassDetails = {
  id?: string | number; // Added id to interface
  code: string;
  name: string;
  section: string;
  credits: number;
  semester: string;
  year: string;
  enrolledStudents: number;
  capacity: number;
  averageGrade: string;
  attendanceRate: string;
  room?: string;
};

interface ScheduleItem {
  id?: string;
  day_of_week?: string;
  dayOfWeek?: string;
  start_time?: string;
  startTime?: string;
  end_time?: string;
  endTime?: string;
  formatted_start_time?: string;
  formatted_end_time?: string;
  time_range?: string;
  room?: string | { id?: string; name?: string; building?: string; floor?: string; capacity?: number };
}

interface ClassHeaderProps {
  classDetails: ClassDetails;
  schedule?: ScheduleItem[];
}

export function ClassHeader({ classDetails, schedule = [] }: ClassHeaderProps) {
  const pathname = usePathname();

  // Ensure schedule is always an array
  const scheduleArray = Array.isArray(schedule) ? schedule : [];

  // Transform schedule data to match expected format
  const transformedSchedule = scheduleArray.map((item) => ({
    id: item.id || Math.random().toString(36).substr(2, 9),
    dayOfWeek: item.dayOfWeek || item.day_of_week || "",
    startTime: item.startTime || item.start_time || item.formatted_start_time || "",
    timeRange: item.time_range || `${item.formatted_start_time || ''} - ${item.formatted_end_time || ''}`,
    room: item.room
      ? typeof item.room === 'string'
        ? item.room
        : item.room.name || `${item.room.building || ''} ${item.room.floor || ''}`.trim()
      : "",
  }));

  // Sort schedule by day order
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const sortedSchedule = [...transformedSchedule].sort((a, b) => {
    const dayDiff =
      dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime?.localeCompare(b.startTime || "") || 0;
  });

  const theme = getClassColor(classDetails.code);
  const classId = classDetails.id;

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 px-4 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard/faculty/classes"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Link>

        {/* Settings Menu - only show if we have a valid class ID */}
        {classId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/faculty/classes/${classId}/settings`} className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Class Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div
        className="relative w-full rounded-xl overflow-hidden shadow-lg border border-border/50 bg-card text-card-foreground transition-all"
      >
        {/* Decorative Background Pattern using Global Colors */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at top right, var(--primary) 0%, transparent 40%), radial-gradient(circle at bottom left, ${theme.base} 0%, transparent 40%)`
          }}
        />

        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            {/* Left Side: Class Info */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                  >
                    {classDetails.code}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    {classDetails.semester} • {classDetails.year}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
                  {classDetails.name}
                </h1>
                <div className="flex items-center gap-2 text-xl font-medium text-muted-foreground">
                  <span>Section {classDetails.section}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    {classDetails.enrolledStudents} / {classDetails.capacity}{" "}
                    Enrolled
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Schedule & Details */}
            <div className="md:w-80 shrink-0">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Class Schedule</h3>
                </div>

                {sortedSchedule.length > 0 ? (
                  <div className="space-y-3">
                    {sortedSchedule.map((item) => (
                      <div key={item.id} className="text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-foreground">{item.dayOfWeek}</span>
                          {item.room && (
                            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.room}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{item.timeRange}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground py-2 text-center">
                    No schedule set
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
