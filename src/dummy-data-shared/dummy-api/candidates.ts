import { Candidate } from "../schema";
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
    phone: "9876543210",
    jobId: "j1",
    status: "interview",
    resumeUrl: "",
    resumeText: "Skilled backend developer",
    aiScore: 90,
    aiAnalysis: { keywords: ["Node.js", "Postgres"] },
    appliedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Fetch candidates
export const fetchCandidates = async (): Promise<Candidate[]> => {
  await new Promise((res) => setTimeout(res, 300)); // simulate delay
  return dummyCandidates;
};

// Update candidate status
export const updateCandidateStatus = async (candidateId: string, newStatus: string) => {
  const candidate = dummyCandidates.find((c) => c.id === candidateId);
  if (candidate) candidate.status = newStatus;
  return candidate;
};