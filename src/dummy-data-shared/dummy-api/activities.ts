// api/activities.ts

import { Activity } from "../schema";


export const fetchActivities = async (): Promise<Activity[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));

  // Return dummy data
  return [
    {
      type: "candidate_added",
      candidateId: "abc123",
      description: "Added new candidate John Doe",
      actor: "Admin",
      metadata: { source: "web" },
    },
    {
      type: "interview_scheduled",
      candidateId: "abc123",
      description: "Scheduled technical interview",
      actor: "HR",
      metadata: { date: "2025-08-25" },
    },
  ];
};
