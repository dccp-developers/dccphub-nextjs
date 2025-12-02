import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FacultyScheduleCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                                <Skeleton className="h-3 w-3 rounded" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex items-center gap-1">
                                <Skeleton className="h-3 w-3 rounded" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
