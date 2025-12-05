import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClassData, LaravelApiHelpers } from "@/lib/laravel-api";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { ClassActionsDropdown } from "./class-actions-dropdown";

interface ClassCardProps {
    classItem: ClassData;
    onActionComplete?: () => void;
    compact?: boolean;
}

export function ClassCard({ classItem, onActionComplete, compact = false }: ClassCardProps) {
    // Extract data using helpers or direct access
    const { subjectCode, subjectName, section, schoolYear, semester, semesterFormatted } = LaravelApiHelpers.formatClassInfoForClassData(classItem);

    const status = LaravelApiHelpers.getClassStatus({ data: classItem } as any);
    const enrollmentCount = LaravelApiHelpers.getClassEnrollmentCount({ data: classItem } as any);
    const maxSlots = classItem.class_information.maximum_slots;
    const progress = maxSlots > 0 ? (enrollmentCount / maxSlots) * 100 : 0;

    // Get theme colors/images from settings
    const bannerImage = classItem.settings?.visual?.banner_image;
    const themeColor = classItem.settings?.visual?.theme || "blue"; // Default fallback
    const accentColor = classItem.settings?.visual?.accent_color;

    // Determine background style
    const backgroundStyle = bannerImage
        ? { backgroundImage: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: accentColor || `var(--${themeColor}-500, #3b82f6)` }; // Fallback to accent or theme color

    // Schedule display
    const scheduleDisplay = LaravelApiHelpers.getClassScheduleDisplay({ data: classItem } as any);

    return (
        <Link href={`/dashboard/faculty/classes/${classItem.id}`} className="block group h-full">
            <Card className={cn(
                "h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-card group-hover:-translate-y-1 ring-1 ring-border/50",
                compact ? "text-sm" : ""
            )}>
                {/* Visual Header (Banner) */}
                <div
                    className={cn(
                        "relative w-full flex flex-col justify-between transition-all duration-500 group-hover:brightness-110",
                        compact ? "h-24 p-3" : "h-36 p-5"
                    )}
                    style={backgroundStyle}
                >
                    {/* Overlay for readability if using image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="relative z-10 flex justify-between items-start">
                        <Badge variant="outline" className="bg-background/20 text-white border-white/20 hover:bg-background/30 backdrop-blur-md shadow-sm font-medium tracking-wide">
                            {subjectCode}
                        </Badge>

                        <div onClick={e => e.preventDefault()} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ClassActionsDropdown classItem={classItem as any} onActionComplete={onActionComplete} />
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <Badge
                            variant="secondary"
                            className="bg-white/90 text-black hover:bg-white font-semibold shadow-sm backdrop-blur-sm"
                        >
                            {section}
                        </Badge>
                        {/* Show semester in header on compact mode since we hide meta info */}
                        {compact && (
                            <span className="text-[10px] text-white/80 font-medium bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                {semesterFormatted}
                            </span>
                        )}
                    </div>
                </div>

                <CardContent className={cn("flex-1 flex flex-col gap-3", compact ? "p-3" : "p-5")}>
                    {/* Subject Name & Semester */}
                    <div className="space-y-1">
                        <h3
                            className={cn(
                                "font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2",
                                compact ? "text-base" : "text-lg"
                            )}
                            title={subjectName}
                        >
                            {subjectName}
                        </h3>
                        {!compact && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                    {schoolYear} • {semesterFormatted}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar (Capacity) */}
                    <div className="space-y-1.5 mt-auto">
                        <div className="flex items-center justify-between text-xs">
                            <span className={cn("font-medium flex items-center gap-1.5", status.isFull ? "text-destructive" : "text-muted-foreground")}>
                                <Users className="h-3.5 w-3.5" />
                                {status.isFull ? "Full" : "Enrolled"}
                            </span>
                            <span className="text-muted-foreground font-medium">
                                <span className={cn("text-foreground", status.isFull && "text-destructive")}>
                                    {enrollmentCount}
                                </span>
                                <span className="opacity-50 mx-0.5">/</span>
                                {maxSlots}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    status.isFull ? "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-primary relative overflow-hidden"
                                )}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            >
                                {progress < 100 && (
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] translate-x-[-100%]" />
                                )}
                            </div>
                        </div>
                    </div>

                    {!compact && (
                        <>
                            <div className="h-px w-full bg-border/50" />

                            {/* Meta Info Grid */}
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                {/* Schedule Summary */}
                                <div className="flex items-start gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4 mt-0.5 text-primary/70" />
                                    <span className="line-clamp-2 text-xs leading-relaxed">
                                        {scheduleDisplay.schedules.length > 0
                                            ? scheduleDisplay.schedules.map(s =>
                                                `${s.day} ${s.startTime}-${s.endTime}`
                                            ).join(", ")
                                            : "No schedule set"}
                                    </span>
                                </div>

                                {/* Room Info (Take first room if available) */}
                                {scheduleDisplay.schedules.length > 0 && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary/70" />
                                        <span className="text-xs truncate">{scheduleDisplay.schedules[0].room.name}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
