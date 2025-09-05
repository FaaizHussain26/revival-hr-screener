import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
} from "lucide-react";
import * as Progress from "@radix-ui/react-progress";

interface AnalysisData {
  finalPercentage: number;
  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  matchedSkills: string[];
  missingSkills: string[];
  skillsAnalysis?: { name: string; value: number }[]; // NEW
  relevantExperienceAndSkills: { score: number; rationale: string };
  educationAndCertifications: { score: number; rationale: string };
  professionalAchievementsAndImpact: { score: number; rationale: string };
  culturalFitAndSoftSkills: { score: number; rationale: string };
  keywordsAndATSOptimization: { score: number; rationale: string };
  resumeClarityAndProfessionalism: { score: number; rationale: string };
  overallFitForTheRole: { score: number; rationale: string };
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const categories = [
    {
      key: "relevantExperienceAndSkills" as const,
      label: "Experience & Skills",
    },
    { key: "educationAndCertifications" as const, label: "Education" },
    {
      key: "professionalAchievementsAndImpact" as const,
      label: "Achievements",
    },
    { key: "culturalFitAndSoftSkills" as const, label: "Soft Skills" },
    { key: "keywordsAndATSOptimization" as const, label: "ATS Optimization" },
    { key: "resumeClarityAndProfessionalism" as const, label: "Clarity" },
    { key: "overallFitForTheRole" as const, label: "Overall Role Fit" },
  ];

  const getStatus = (score: number) => {
    if (score >= 8)
      return { text: "Excellent", color: "bg-green-100 text-green-700" };
    if (score >= 6)
      return { text: "Good", color: "bg-yellow-100 text-yellow-700" };
    return { text: "Needs Improvement", color: "bg-red-100 text-red-700" };
  };

  return (
    <div className="space-y-10">
      {/* Header Section: Candidate Info + Match Score */}
      <Card className="p-6 rounded-xl shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Candidate Info */}
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {data.personalInfo?.name ?? "N/A"}
          </h1>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={18} className="text-card-box" />
              <span>{data.personalInfo?.email ?? "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={18} className="text-card-box" />
              <span>{data.personalInfo?.phoneNumber ?? "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} className="text-card-box" />
              <span>{data.personalInfo?.address ?? "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="w-32 h-32 relative flex flex-col items-center justify-center">
          <svg
            className="absolute top-0 left-0 w-full h-full -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-blue-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-card-box"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${data.finalPercentage}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-card-box">
              {data.finalPercentage}%
            </span>
            <p className="text-sm text-gray-500">Match Score</p>
          </div>
        </div>
      </Card>

      {/* Skills Analysis */}
      {data.skillsAnalysis && data.skillsAnalysis.length > 0 && (
        <Card className="p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <Award className="text-card-box" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">
              Skills Analysis
            </h2>
          </div>
          <div className="space-y-4">
            {data.skillsAnalysis.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">
                    {skill.name}
                  </span>
                  <span className="font-semibold text-card-box">
                    {skill.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-300 to-card-box"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {/* Matched & Missing Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" /> Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {data.matchedSkills.length > 0 ? (
              data.matchedSkills.map((skill, idx) => (
                <Badge
                  key={idx}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full hover:bg-green-200 transition"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-gray-500">No matched skills found.</p>
            )}
          </div>
        </Card>

        <Card className="p-5 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-500">
            <XCircle className="w-4 h-4" /> Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {data.missingSkills.length > 0 ? (
              data.missingSkills.map((skill, idx) => (
                <Badge
                  key={idx}
                  className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full hover:bg-red-200 transition"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-gray-500">No missing skills.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Category Progress */}
      <Card className="bg-white border-border shadow-elegant p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Category Analysis
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => {
            const section = data[cat.key];
            const percentage = section.score * 10;
            const status = getStatus(section.score);
            // Icon mapping for categories
            const icons = [
              <CheckCircle className="w-5 h-5 text-green-500" />, // Experience & Skills
              <Award className="w-5 h-5 text-blue-500" />, // Education
              <Star className="w-5 h-5 text-yellow-500" />, // Achievements
              <Mail className="w-5 h-5 text-purple-500" />, // Soft Skills
              <CheckCircle className="w-5 h-5 text-orange-500" />, // ATS Optimization
              <XCircle className="w-5 h-5 text-gray-500" />, // Clarity
              <Award className="w-5 h-5 text-pink-500" />, // Overall Role Fit
            ];
            return (
              <div
                key={cat.key}
                className="rounded-xl bg-gradient-to-br from-gray-50 to-white shadow p-4 space-y-3 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  {icons[idx]}
                  <span className="font-semibold text-base text-gray-800">
                    {cat.label}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Score</span>
                  <span className="text-sm font-bold text-gray-700">
                    {percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress.Root
                    className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
                    value={percentage}
                  >
                    <Progress.Indicator
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        background:
                          percentage >= 80
                            ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)" // green
                            : percentage >= 60
                            ? "linear-gradient(90deg, #facc15 0%, #eab308 100%)" // yellow
                            : "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)", // red
                      }}
                    />
                  </Progress.Root>
                  <Badge
                    variant={
                      percentage >= 80
                        ? "default"
                        : percentage >= 60
                        ? "secondary"
                        : "outline"
                    }
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${status.color}`}
                  >
                    {status.text}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 italic">
                  {section.rationale}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
