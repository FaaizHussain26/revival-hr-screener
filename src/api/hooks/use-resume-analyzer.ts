"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  analyzeResume,
  ResumeAnalysisRequest,
  ResumeAnalysisResponse,
} from "../requests/resume-analyzer-api";

export const useResumeAnalyzer = () => {
  const { toast } = useToast();

  return useMutation<ResumeAnalysisResponse, Error, ResumeAnalysisRequest>({
    mutationFn: analyzeResume,
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Resume has been successfully analyzed.",
      });
    },
    onError: (error) => {
      console.error("Resume analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description:
          error.message ||
          "There was an error analyzing the resume. Please try again.",
      });
    },
  });
};
