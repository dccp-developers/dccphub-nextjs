import { TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function GradesTableRowSkeleton() {
  return (
    <>
      <TableCell className="font-medium">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-12 mx-auto rounded" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-8 w-8 mx-auto rounded" />
      </TableCell>
    </>
  );
}
