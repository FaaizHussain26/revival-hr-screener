import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Calendar, Plus, ExternalLink } from "lucide-react";

interface CalendarEvent {
  id?: string;
  subject: string;
  start: string;
  end: string;
  location?: string;
  attendees: string[];
  body?: string;
}

export default function OutlookIntegration() {
  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar/events"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-ms-neutral-600">
            Outlook Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-ms-neutral-200 rounded-lg" />
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
            Outlook Calendar
          </CardTitle>
          <div className="w-8 h-8 bg-ms-warning bg-opacity-10 rounded-lg flex items-center justify-center">
            <Calendar className="text-ms-warning" size={16} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {events.length > 0 ? (
            events.slice(0, 3).map((event, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-ms-neutral-100 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ms-blue rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-ms-neutral-600">
                      {event.subject || "Interview Session"}
                    </p>
                    <p className="text-xs text-ms-neutral-400">
                      {new Date(event.start).toLocaleDateString()} at{" "}
                      {new Date(event.start).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-ms-blue hover:text-ms-blue-dark"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Calendar className="mx-auto h-8 w-8 text-ms-neutral-400 mb-2" />
              <p className="text-sm text-ms-neutral-400">
                No upcoming interviews
              </p>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full border-ms-blue text-ms-blue hover:bg-ms-blue hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </CardContent>
    </Card>
  );
}
