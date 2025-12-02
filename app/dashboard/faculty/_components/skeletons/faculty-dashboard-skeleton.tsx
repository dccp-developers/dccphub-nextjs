import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as skeleton from "@/components/ui/skeleton";
import { FacultyScheduleCardSkeleton } from "./faculty-schedule-card-skeleton";
import { FacultyStatsCardSkeleton } from "./faculty-stats-card-skeleton";

export function FacultyDashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Welcome Header */}
            <div className="space-y-2">
                <skeleton.Skeleton className="h-9 w-96" />
                <skeleton.Skeleton className="h-5 w-72" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FacultyStatsCardSkeleton />
                <FacultyStatsCardSkeleton />
                <FacultyStatsCardSkeleton />
                <FacultyStatsCardSkeleton />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FacultyScheduleCardSkeleton />
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <skeleton.Skeleton className="h-5 w-5 rounded" />
                            <skeleton.Skeleton className="h-6 w-40" />
                        </div>
                        <skeleton.Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground text-center py-8">
                            <skeleton.Skeleton className="h-4 w-48 mx-auto" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <skeleton.Skeleton className="h-5 w-5 rounded" />
                            <skeleton.Skeleton className="h-6 w-40" />
                        </div>
                        <skeleton.Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground text-center py-8">
                            <skeleton.Skeleton className="h-4 w-48 mx-auto" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <skeleton.Skeleton className="h-6 w-48" />
                    <skeleton.Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                                <skeleton.Skeleton className="h-6 w-6 mb-2 rounded" />
                                <skeleton.Skeleton className="h-5 w-24 mb-1" />
                                <skeleton.Skeleton className="h-4 w-36" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
