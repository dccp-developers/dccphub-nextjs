import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const assignments = [
    {
        id: 1,
        title: "Final Project Proposal",
        course: "CS 401",
        dueDate: "2025-11-25",
        status: "pending",
        priority: "high",
    },
    {
        id: 2,
        title: "Database Design Assignment",
        course: "CS 305",
        dueDate: "2025-11-22",
        status: "in-progress",
        priority: "high",
    },
    {
        id: 3,
        title: "ML Model Implementation",
        course: "CS 450",
        dueDate: "2025-11-28",
        status: "pending",
        priority: "medium",
    },
];

function getDaysUntil(dateString: string) {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

interface AssignmentListProps {
    className?: string;
}

export function AssignmentList({ className }: AssignmentListProps) {
    return (
        <Card className={cn("col-span-3", className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Active Assignments</CardTitle>
                    <CardDescription>
                        Prioritize your upcoming deadlines.
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    View All
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {assignments.map((assignment) => {
                        const daysUntil = getDaysUntil(assignment.dueDate);
                        const isUrgent = daysUntil <= 2;

                        return (
                            <div
                                key={assignment.id}
                                className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-medium text-sm leading-tight">
                                            {assignment.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {assignment.course}
                                        </p>
                                    </div>
                                    {assignment.priority === "high" && (
                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                                            High Priority
                                        </Badge>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span className={isUrgent ? "text-red-500 font-medium" : ""}>
                                                {isUrgent ? "Due soon" : `${daysUntil} days left`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{assignment.dueDate}</span>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="secondary" className="h-7 text-xs">
                                        Submit
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
