import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Briefcase } from "lucide-react";

interface DashboardStats {
  totalJob: number;
  totalInactiveCandidates: number;
  countInterviewsThisWeek: number;
  hiringRate: string;
}

interface MetricsOverviewProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  error?: string;
}

export default function MetricsOverview({
  stats,
  isLoading,
  error,
}: MetricsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-8 w-12 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Error loading dashboard stats: {error}
        </p>
      </div>
    );
  }

  const totalCandidates =
    (stats?.totalInactiveCandidates || 0) +
    (stats?.countInterviewsThisWeek || 0);
  const activeCandidates = stats?.countInterviewsThisWeek || 0;
  const inactiveCandidates = stats?.totalInactiveCandidates || 0;
  const openPositions = stats?.totalJob || 0;

  const metrics = [
    {
      title: "Total Candidates",
      value: totalCandidates,
      icon: Users,
    },
    {
      title: "Active",
      value: activeCandidates,
      icon: UserCheck,
    },
    {
      title: "Inactive",
      value: inactiveCandidates,
      icon: UserX,
    },
    {
      title: "Open Positions",
      value: openPositions,
      icon: Briefcase,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="border border-border shadow-sm">
            <CardContent className="h-20 items-center flex">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
