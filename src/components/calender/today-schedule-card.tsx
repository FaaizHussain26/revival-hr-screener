"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit } from "lucide-react";
import type { Interview } from "@/api/requests/calender-api";

interface TodaysScheduleCardProps {
  todaysInterviews: Interview[];
  todaysInterviewsLoading: boolean;
  getCandidateName: (candidate: { applicant_name: string }) => string;
  handleUpdateClick: (interview: Interview, e: React.MouseEvent) => void;
}

export function TodaysScheduleCard({
  todaysInterviews,
  todaysInterviewsLoading,
  getCandidateName,
  handleUpdateClick,
}: TodaysScheduleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-ms-neutral-600">
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todaysInterviewsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : todaysInterviews.length > 0 ? (
          <div className="space-y-3">
            {todaysInterviews.map((interview) => (
              <div key={interview._id} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">
                    {getCandidateName(interview.candidate)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(interview.scheduledAt).toLocaleTimeString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleUpdateClick(interview, e)}
                      className="text-ms-blue hover:bg-ms-blue hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Array.isArray(interview.interviewer)
                    ? interview.interviewer.join(", ")
                    : interview.interviewer}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {interview.type.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No interviews today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
