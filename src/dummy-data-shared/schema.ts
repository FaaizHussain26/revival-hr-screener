// schemas.ts
import { z } from "zod";

// ---------------------- Job Schema ----------------------
export const insertJobSchema = z.object({
  title: z.string(),
  department: z.string(),
  location: z.string(),
  employmentType: z.string(),
  description: z.string(),
  requirements: z.string(),
  responsibilities: z.string(),
  skillsRequired: z.string(),
  experienceLevel: z.string(),
  salaryRange: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type InsertJob = z.infer<typeof insertJobSchema>;

// ---------------------- Candidate Schema ----------------------
export const insertCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  jobId: z.string().nullable().optional(),
  status: z.string().optional(),
  resumeUrl: z.string().optional(),
  resumeText: z.string().optional(),
  aiScore: z.number().optional(),
  aiAnalysis: z.any().optional(),
  appliedDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  position: z.string().optional(),
});

export type Candidate = z.infer<typeof insertCandidateSchema>;

// ---------------------- Interview Schema ----------------------
export const insertInterviewSchema = z.object({
  id: z.string().optional(), // optional for new inserts
  candidateId: z.string(),
  scheduledAt: z.string(),
  duration: z.number().optional().default(60),
  type: z.enum(["phone_screen", "technical", "behavioral", "final"]),
  interviewer: z.string(),
  location: z.string().optional(),
  status: z.string().optional().default("scheduled"),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  outlookEventId: z.string().optional(),
});

export type Interview = z.infer<typeof insertInterviewSchema>;

// ---------------------- Activity Schema ----------------------
export const insertActivitySchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  candidateId: z.string().nullable().optional(),
  description: z.string(),
  actor: z.string(),
  metadata: z.any().optional(),
  createdAt: z.string().optional(),
});

export type Activity = z.infer<typeof insertActivitySchema>;

// ---------------------- Candidate Report Schema ----------------------
export const insertCandidateReportSchema = z.object({
  id: z.string().optional(),
  candidateId: z.string(),
  reportType: z.string().optional(),
  reportData: z.any(),
  pdfUrl: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CandidateReport = z.infer<typeof insertCandidateReportSchema>;


