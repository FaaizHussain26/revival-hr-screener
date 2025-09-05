import MetricsOverview from "@/components/dashboard/metrics-overview";

import { Card, CardContent } from "@/components/ui/card";

import { ResumeAnalyzer } from "./resume-analyzer";

import { ShortlistedCandidatesPage } from "@/components/shortlist-candidates/shortlisted-candidates-page";
import { TodaysScheduleCard } from "@/components/calender/today-schedule-card";

import { useGetTodaysInterviews } from "@/api/hooks/useCalender";
import type { Interview } from "@/api/requests/calender-api";

const mockStats = {
  totalJob: 7,
  totalInactiveCandidates: 2,
  countInterviewsThisWeek: 3,
  hiringRate: "50.00",
};

export default function Dashboard() {
  const { data: todaysInterviewsResponse, isLoading: todaysInterviewsLoading } =
    useGetTodaysInterviews();
  const todaysInterviews: Interview[] = todaysInterviewsResponse?.data || [];

  const handleUpdateClick = (interview: Interview, e: React.MouseEvent) => {
    console.log(interview);
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <MetricsOverview stats={mockStats} />

      <div className="grid grid-cols-1  gap-6">
        <div className="xl:col-span-2">
          <Card>
            <CardContent>
              <ShortlistedCandidatesPage />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6 ">
          <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
            <ResumeAnalyzer />
          </div>
          <div>
            <TodaysScheduleCard
              todaysInterviews={todaysInterviews}
              todaysInterviewsLoading={todaysInterviewsLoading}
              getCandidateName={(candidate: { applicant_name: string }) =>
                candidate.applicant_name
              }
              handleUpdateClick={(interview: Interview, e: React.MouseEvent) =>
                handleUpdateClick(interview, e)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
