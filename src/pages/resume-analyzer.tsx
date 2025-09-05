import React, { useState, useCallback } from "react";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CandidateData } from "@/types/resume-analyzer-types/candidate";
import { useDropzone } from "react-dropzone";

import { useResumeAnalyzer } from "@/api/hooks/use-resume-analyzer";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { Job } from "@/api/requests/job-module-api";
import { useJobs } from "@/api/hooks/job-module/useJobs";
import { useNavigate } from "react-router";

export const ResumeAnalyzer = ({
  hasDescription = false,
}: {
  hasDescription?: boolean;
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [candidateData, setCandidateData] = useState<CandidateData | null>(
    null
  );
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [jobId, setJobId] = useState<string>("");
  const navigate = useNavigate();

  const { data: jobsData, isLoading: isJobsLoading } = useJobs({
    page: 1,
    limit: 50,
  });
  const { mutate: analyzeResume } = useResumeAnalyzer();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && jobId) {
        const file = acceptedFiles[0];
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setCandidateData(null);

        analyzeResume(
          {
            file,
            job_id: jobId,
          },
          {
            onSuccess: (res) => {
              setAnalysisProgress(100);
              setCandidateData(res.data);
              setIsAnalyzing(false);
              navigate("/dashboard/resume-analysis", { state: res });
            },
            onError: () => {
              setIsAnalyzing(false);
              setAnalysisProgress(0);
            },
          }
        );
      }
    },
    [analyzeResume, jobId, navigate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    disabled: isAnalyzing || !jobId, // disable until job is selected
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            AI-Powered Resume Analysis
          </h2>
          <p className="text-gray-600">
            Upload a resume to get instant insights on candidate fit, strengths,
            weaknesses, and interview questions.
          </p>
        </div>

        <div className="space-y-6">
          {!candidateData && (
            <Card className="p-8 bg-white shadow-sm border border-gray-200">
              <div className="space-y-6">
                {/* Job Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Job
                  </label>
                  <Select
                    onValueChange={(value) => setJobId(value)}
                    value={jobId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isJobsLoading ? "Loading jobs..." : "Choose a job"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {jobsData?.data?.map((job: Job) => (
                        <SelectItem key={job._id} value={job._id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Upload Section */}
                <div className="text-center space-y-6">
                  {hasDescription && (
                    <React.Fragment>
                      <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full">
                        <Upload className="w-8 h-8 text-card-box" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                          Upload Resume
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Upload a PDF or Word document to get started with
                          AI-powered analysis
                        </p>
                      </div>
                    </React.Fragment>
                  )}

                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200 ${
                      isDragActive
                        ? "border-card-box bg-blue-50"
                        : "border-gray-300 hover:border-card-box hover:bg-blue-50"
                    } ${isAnalyzing ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center p-4 bg-white rounded-full border border-gray-200">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      {isDragActive ? (
                        <div>
                          <p className="text-lg font-medium text-orange-600">
                            Drop the resume here
                          </p>
                          <p className="text-sm text-gray-500">
                            Release to upload
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            Drop resume here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">
                            Supports PDF, DOC, and DOCX files up to 10MB
                          </p>
                        </div>
                      )}
                      <Button
                        type="button"
                        className="bg-card-box"
                        disabled={isAnalyzing || !jobId}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>

                  {isAnalyzing && (
                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="flex items-center gap-3 justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                        <span className="text-sm text-gray-600">
                          {analysisProgress < 100
                            ? "Uploading resume..."
                            : "Analyzing resume..."}
                        </span>
                      </div>
                      {/* <Progress value={analysisProgress} className="w-full" /> */}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Analysis Results */}
        </div>
      </div>
    </div>
  );
};
