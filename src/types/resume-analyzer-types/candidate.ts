export interface CandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  certifications: string[];
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  resumeUrl: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0-100 percentage
}
