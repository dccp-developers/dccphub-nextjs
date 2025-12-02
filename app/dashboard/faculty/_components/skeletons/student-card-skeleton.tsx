import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function StudentCardSkeleton() {
  return (
    <Card className="h-64">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Student Header */}
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-16 rounded" />
            </div>
          </div>

          {/* Student Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Skeleton className="h-3.5 w-3.5 rounded" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-6 w-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Skeleton className="h-3.5 w-3.5 rounded" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-8" />
            </div>
          </div>

          {/* Enrolled Classes */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-6 w-12 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
