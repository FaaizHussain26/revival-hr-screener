import axiosInstance from "../axiosInstance"


export interface Candidate {
  _id: string
  applicant_name: string
  job_matched: string
  summary_match: string
  matched_skills: string[]
  experience: {
    match: string
    years_found: number
  }
  bonus_matches: string[]
  match_score: number
  jobs_matched: string[]
  applicant_summary: string
  applicant_email: string
  applicant_phone: string
  applicant_skills: string[]
  status: string
  resume_url: string
  applied_date: string
  isDuplicated: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  job: string
}

export interface PipelineStage {
  _id: string
  count: number
  data: Candidate[]
}

export interface HiringPipelineResponse {
  success: boolean
  message: string
  data: PipelineStage[]
}

export const getCandidatesWithStatus = async (): Promise<HiringPipelineResponse> => {
  const response = await axiosInstance.get("/hiring-pipeline/candidate-with-status")
  return response.data
}

export const updateCandidateStatus = async (candidateId: string, newStatus: string) => {
  const response = await axiosInstance.put(`/hiring-pipeline/update-candidate-status/${candidateId}`, {
    status: newStatus,
  })
  return response.data
}
