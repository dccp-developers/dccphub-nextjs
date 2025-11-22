import { DashboardStats } from "./dashboard-stats";
import { CourseList } from "./course-list";
import { AssignmentList } from "./assignment-list";
import { ScheduleWidget } from "./schedule-widget";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon } from "lucide-react";

export function StudentDashboard() {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="flex-1 p-4 md:p-8 pt-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Good Afternoon, Student</h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <CalendarIcon className="h-4 w-4" />
                        {currentDate}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        View Full Schedule
                    </Button>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Daily Focus (2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ScheduleWidget className="col-span-full" />
                        <AssignmentList className="col-span-full" />
                    </div>
                </div>

                {/* Right Column: Overview (1/3 width on large screens) */}
                <div className="space-y-6">
                    <CourseList className="col-span-full" />
                    
                    {/* Quick Actions / Exam Countdown Placeholder */}
                    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button variant="secondary" className="w-full justify-start">
                                📝 Request Transcript
                            </Button>
                            <Button variant="secondary" className="w-full justify-start">
                                💳 Make a Payment
                            </Button>
                            <Button variant="secondary" className="w-full justify-start">
                                📚 Reserve Library Room
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
