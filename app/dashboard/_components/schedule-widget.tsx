import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const schedule = [
  {
    id: 1,
    course: "Advanced Web Development",
    code: "CS 401",
    time: "09:00 AM - 10:30 AM",
    location: "Room 301",
    type: "Lecture",
    color: "bg-blue-500",
    status: "upcoming", // current, upcoming, past
  },
  {
    id: 2,
    course: "Database Systems",
    code: "CS 305",
    time: "11:00 AM - 12:30 PM",
    location: "Lab 205",
    type: "Lab",
    color: "bg-green-500",
    status: "upcoming",
  },
  {
    id: 3,
    course: "Machine Learning",
    code: "CS 450",
    time: "02:00 PM - 03:30 PM",
    location: "Room 401",
    type: "Lecture",
    color: "bg-purple-500",
    status: "upcoming",
  },
];

interface ScheduleWidgetProps {
  className?: string;
}

export function ScheduleWidget({ className }: ScheduleWidgetProps) {
  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Today&apos;s Schedule</CardTitle>
        <CardDescription>
          You have {schedule.length} classes today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0 ml-2">
          {/* Vertical Line */}
          <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-muted" />

          {schedule.map((item, index) => (
            <div key={item.id} className="relative pl-6 pb-6 last:pb-0">
              {/* Dot */}
              <div
                className={cn(
                  "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background",
                  index === 0
                    ? "bg-primary animate-pulse"
                    : "bg-muted-foreground/30",
                )}
              />

              <div
                className={cn(
                  "flex flex-col gap-1 p-3 rounded-lg transition-colors",
                  index === 0 ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{item.course}</h4>
                  <Badge
                    variant={index === 0 ? "default" : "outline"}
                    className="text-[10px] h-5"
                  >
                    {item.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
