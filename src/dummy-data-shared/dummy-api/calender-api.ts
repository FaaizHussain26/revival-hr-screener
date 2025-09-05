// src/lib/dummyApi.ts

import { Candidate, insertInterviewSchema, Interview } from "../schema";

// Dummy in-memory storage
const dummyCandidates: Candidate[] = [
  {
    id: "c1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    jobId: "j1",
    status: "applied",
    resumeUrl: "",
    resumeText: "Experienced frontend developer",
    aiScore: 85,
    aiAnalysis: { keywords: ["React", "TypeScript"] },
    appliedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "Jane Smith",
    email: "jane@example.com",
    jobId: "j1",
    status: "interview",
    resumeText: "Skilled backend developer",
    aiScore: 90,
    appliedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const dummyInterviews: Interview[] = [];

// -------------------- Dummy apiRequest --------------------
export async function apiRequest(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 300));

  // --- Candidates ---
  if (url === "/api/candidates") {
    if (method === "GET") return dummyCandidates;
    if (method === "PATCH") {
      const candidate = dummyCandidates.find((c) => c.id === body.id);
      if (!candidate) throw new Error("Candidate not found");
      Object.assign(candidate, body);
      return candidate;
    }
  }

  // --- Interviews ---
  if (url === "/api/interviews") {
    if (method === "GET") return dummyInterviews;

    if (method === "POST") {
      // Validate using Zod
      const parsed = insertInterviewSchema.parse(body);
      const newInterview: Interview = {
        id: "i" + (dummyInterviews.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...parsed,
      };
      dummyInterviews.push(newInterview);
      return newInterview;
    }
  }

  // --- Calendar events (dummy) ---
  if (url === "/api/calendar/events") {
    if (method === "GET") {
      return dummyInterviews.map((i) => ({
        id: i.id,
        title: `Interview with ${i.candidateId}`,
        start: i.scheduledAt,
        end: new Date(
          new Date(i.scheduledAt).getTime() + (i.duration ?? 60) * 60000
        ).toISOString(),
      }));
    }
  }

  throw new Error(`Unknown endpoint: ${method} ${url}`);
}
