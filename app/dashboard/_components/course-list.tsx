import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const courses = [
    {
        id: 1,
        name: "Advanced Web Development",
        code: "CS 401",
        instructor: "Dr. Smith",
        progress: 75,
        grade: "A",
        color: "bg-blue-500",
    },
    {
        id: 2,
        name: "Database Systems",
        code: "CS 305",
        instructor: "Prof. Johnson",
        progress: 60,
        grade: "A-",
        color: "bg-green-500",
    },
    {
        id: 3,
        name: "Machine Learning",
        code: "CS 450",
        instructor: "Dr. Williams",
        progress: 45,
        grade: "B+",
        color: "bg-purple-500",
    },
    {
        id: 4,
        name: "Software Engineering",
        code: "CS 320",
        instructor: "Prof. Brown",
        progress: 80,
        grade: "A",
        color: "bg-orange-500",
    },
];

interface CourseListProps {
    className?: string;
}

export function CourseList({ className }: CourseListProps) {
    return (
        <Card className={cn("col-span-4", className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>
                        You are enrolled in {courses.length} courses this semester.
                    </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`w-1 h-12 rounded-full ${course.color}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold truncate text-sm">{course.name}</h4>
                                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                            {course.code}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {course.instructor}
                                    </p>
                                    <div className="flex items-center gap-2 max-w-[200px]">
                                        <Progress value={course.progress} className="h-1.5 flex-1" />
                                        <span className="text-xs text-muted-foreground min-w-[3ch]">
                                            {course.progress}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-4">
                                <Badge variant={course.grade.startsWith("A") ? "default" : "secondary"}>
                                    {course.grade}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
