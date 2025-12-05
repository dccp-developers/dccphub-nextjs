"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSemester } from "@/contexts/semester-context";
import { ClassData, LaravelApiHelpers } from "@/lib/laravel-api";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    FolderOpen,
    LayoutGrid,
    List,
    Users,
    SlidersHorizontal,
    ArrowUpDown,
    Maximize2,
    Minimize2
} from "lucide-react";
import { Suspense, useMemo } from "react";
import { ClassCard } from "./class-card";
import { ClassCardSkeleton } from "./class-card-skeleton";
import { useClassPreferences } from "@/hooks/use-class-preferences";
import { Skeleton } from "@/components/ui/skeleton";

interface EnhancedClassesLayoutProps {
    initialClasses: ClassData[];
}

export function EnhancedClassesLayout({ initialClasses }: EnhancedClassesLayoutProps) {
    const { semester, schoolYear } = useSemester();
    const { preferences, updatePreference, isLoaded } = useClassPreferences();

    // Filter classes based on global academic period
    const filteredClasses = useMemo(() => {
        let result = initialClasses.filter(cls => {
            const info = LaravelApiHelpers.formatClassInfoForClassData(cls);
            // Relaxed matching for "All" semester if needed, but strict for now based on existing logic
            const matchesSemester = info.semester === semester;
            const matchesYear = info.schoolYear.includes(schoolYear);
            return matchesSemester && matchesYear;
        });

        // Apply sorting
        if (preferences.sortBy) {
            result.sort((a, b) => {
                const infoA = LaravelApiHelpers.formatClassInfoForClassData(a);
                const infoB = LaravelApiHelpers.formatClassInfoForClassData(b);

                switch (preferences.sortBy) {
                    case "name":
                        return infoA.subjectName.localeCompare(infoB.subjectName);
                    case "enrollment":
                        const countA = LaravelApiHelpers.getClassEnrollmentCount({ data: a } as any);
                        const countB = LaravelApiHelpers.getClassEnrollmentCount({ data: b } as any);
                        return countB - countA; // Descending
                    case "recent":
                    default:
                        // Assuming id or created_at proxy for recent, falling back to ID for stability
                        return Number(b.id) - Number(a.id);
                }
            });
        }

        return result;
    }, [initialClasses, semester, schoolYear, preferences.sortBy]);

    // Calculate dashboard stats
    const stats = useMemo(() => {
        const total = filteredClasses.length;
        const students = filteredClasses.reduce((sum, cls) => {
            return sum + LaravelApiHelpers.getClassEnrollmentCount({ data: cls } as any);
        }, 0);

        const full = filteredClasses.filter(cls => {
            const status = LaravelApiHelpers.getClassStatus({ data: cls } as any);
            return status.isFull;
        }).length;

        const lowEnrollment = filteredClasses.filter(cls => {
            const enrollment = LaravelApiHelpers.getClassEnrollmentCount({ data: cls } as any);
            const maxSlots = cls.class_information.maximum_slots;
            return enrollment < maxSlots * 0.5 && enrollment > 0;
        }).length;

        return { total, students, full, lowEnrollment };
    }, [filteredClasses]);

    if (!isLoaded) {
        return <EnhancedLayoutSkeleton />;
    }

    return (
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
            {/* HEADER SECTION */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-border/40">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        My Classes
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm sm:text-base">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {semester === "1" ? "1st Sem" : semester === "2" ? "2nd Sem" : semester}
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{schoolYear}</span>
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* View Mode */}
                    <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50">
                        <Button
                            variant={preferences.viewMode === "grid" ? "secondary" : "ghost"}
                            size="sm"
                            className={cn("h-8 w-8 p-0", preferences.viewMode === "grid" && "bg-background shadow-sm")}
                            onClick={() => updatePreference("viewMode", "grid")}
                            title="Grid View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={preferences.viewMode === "list" ? "secondary" : "ghost"}
                            size="sm"
                            className={cn("h-8 w-8 p-0", preferences.viewMode === "list" && "bg-background shadow-sm")}
                            onClick={() => updatePreference("viewMode", "list")}
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Display Options Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="hidden sm:inline">Display</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>View Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={preferences.compactMode}
                                onCheckedChange={(checked) => updatePreference("compactMode", checked)}
                            >
                                <span className="flex items-center gap-2">
                                    {preferences.compactMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                    Compact Cards
                                </span>
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updatePreference("sortBy", "recent")}>
                                {preferences.sortBy === "recent" && <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />}
                                Recently Added
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updatePreference("sortBy", "name")}>
                                {preferences.sortBy === "name" && <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />}
                                Subject Name (A-Z)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updatePreference("sortBy", "enrollment")}>
                                {preferences.sortBy === "enrollment" && <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />}
                                Highest Enrollment
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button className="h-9 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Create Class</span>
                    </Button>
                </div>
            </div>

            {/* QUICK STATS - High Resolution Aware */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Classes"
                    value={stats.total}
                    icon={BookOpen}
                    description="Active this semester"
                    trend="info"
                />
                <StatCard
                    title="Total Students"
                    value={stats.students}
                    icon={Users}
                    description="Enrolled across all classes"
                    trend="success"
                />
                <StatCard
                    title="Full Classes"
                    value={stats.full}
                    icon={CheckCircle2}
                    description={`${stats.total ? Math.round((stats.full / stats.total) * 100) : 0}% capacity reached`}
                    trend={stats.full > 0 ? "success" : "neutral"}
                    color="text-green-600"
                />
                <StatCard
                    title="Low Enrollment"
                    value={stats.lowEnrollment}
                    icon={AlertCircle}
                    description="Requires attention"
                    trend={stats.lowEnrollment > 0 ? "warning" : "neutral"}
                    color="text-amber-600"
                />
            </div>

            {/* CONTENT GRID/LIST */}
            {filteredClasses.length === 0 ? (
                <EmptyState semester={semester} schoolYear={schoolYear} />
            ) : (
                <div
                    className={cn(
                        "grid gap-6 transition-all duration-500 ease-in-out",
                        preferences.viewMode === "grid"
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                            : "grid-cols-1 max-w-5xl mx-auto"
                    )}
                >
                    {filteredClasses.map(cls => (
                        <div key={cls.id} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-backwards" style={{ animationDelay: `${Math.min(filteredClasses.indexOf(cls) * 50, 500)}ms` }}>
                            {/* Pass compact mode preference to card if we were to update card props, 
                                 or we can control sizing via CSS classes here */}
                            <ClassCard classItem={cls} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, description, trend, color }: any) {
    return (
        <Card className="overflow-hidden border-border/50 hover:border-border transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </CardTitle>
                <div className={cn("p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors", color)}>
                    <Icon className={cn("h-4 w-4", color || "text-muted-foreground group-hover:text-primary")} />
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", color)}>{value}</div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function EmptyState({ semester, schoolYear }: any) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/5">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No classes found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                No classes schedules for {semester === "1" ? "1st" : semester === "2" ? "2nd" : semester} semester {schoolYear}.
            </p>
            <Button variant="outline">
                Change Academic Period
            </Button>
        </div>
    );
}

function EnhancedLayoutSkeleton() {
    return (
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-end pb-4 border-b border-border/40">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
