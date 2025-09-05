import { AlertCircle, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

export function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="text-left pl-10">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-20 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-12 mx-auto rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRowSkeleton key={index} />
      ))}
    </>
  );
}

// Empty State Component
export function EmptyState({
  title,
  description,
  icon: Icon = Users,
}: {
  title: string;
  description: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-muted p-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {description}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Error State Component
export function ErrorState({ error }: { error: unknown }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card className="border-destructive/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-destructive">
                Error Loading Candidates
              </h3>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
