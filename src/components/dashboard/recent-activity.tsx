import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Calendar, Brain, Mail } from "lucide-react";
import { Activity } from "@/dummy-data-shared/schema";


const iconMap = {
  candidate_added: UserPlus,
  interview_scheduled: Calendar,
  resume_analyzed: Brain,
  email_sent: Mail,
  status_changed: UserPlus,
};

const colorMap = {
  candidate_added: "bg-ms-success",
  interview_scheduled: "bg-ms-warning",
  resume_analyzed: "bg-ms-blue",
  email_sent: "bg-ms-error",
  status_changed: "bg-ms-blue",
};

export default function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-ms-neutral-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-ms-neutral-200 rounded mb-2" />
                  <div className="h-3 bg-ms-neutral-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-ms-neutral-600">
            Recent Activity
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-ms-blue bg-opacity-10 text-ms-blue">
              All
            </Badge>
            <Button variant="ghost" size="sm" className="text-ms-neutral-500">
              Interviews
            </Button>
            <Button variant="ghost" size="sm" className="text-ms-neutral-500">
              Applications
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.slice(0, 10).map((activity) => {
              const Icon = iconMap[activity.type as keyof typeof iconMap] || UserPlus;
              const colorClass = colorMap[activity.type as keyof typeof colorMap] || "bg-ms-blue";
              
              return (
                <div key={activity.candidateId} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 ${colorClass} bg-opacity-10 rounded-full flex items-center justify-center`}>
                    <Icon className={`${colorClass.replace('bg-', 'text-')} text-sm`} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ms-neutral-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-ms-neutral-400 mt-1">
                      {activity.metadata?.date && !isNaN(new Date(activity.metadata?.date).getTime())
                        ? `${new Date(activity.metadata?.date).toLocaleDateString()} at ${new Date(activity.metadata?.date).toLocaleTimeString()}`
                        : 'Date not available'}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-ms-neutral-400">No recent activity</p>
            </div>
          )}
        </div>
        
        {activities.length > 10 && (
          <div className="mt-6 text-center">
            <Button variant="link" className="text-ms-blue hover:text-ms-blue-dark">
              Load more activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}