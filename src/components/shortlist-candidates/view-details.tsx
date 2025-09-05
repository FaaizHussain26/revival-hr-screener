import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Star,
  User,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import type { ShortListedCandidate } from "./shortlisted-candidates-page";

interface ViewCandidateDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: ShortListedCandidate | null;
  onDownloadCV?: (candidate: ShortListedCandidate) => void;
  onContactCandidate?: (candidate: ShortListedCandidate) => void;
}

const getBadgeClassName = (score: number): string => {
  if (score >= 90) return "bg-green-800 text-white hover:bg-green-900";
  if (score >= 80) return "bg-green-400 text-white hover:bg-green-500";
  if (score >= 70) return "bg-yellow-400 text-black hover:bg-yellow-500";
  return "bg-red-500 text-white hover:bg-red-600";
};

const totalScoreClassName = (score: number): string => {
  if (score >= 90) return "text-green-800  hover:text-green-900";
  if (score >= 80) return "text-green-400  hover:text-green-500";
  if (score >= 70) return "text-yellow-400  hover:text-yellow-500";
  return "text-red-500  hover:text-red-600";
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Good Match";
  if (score >= 70) return "Fair Match";
  return "Poor Match";
};

const getStatusBadge = (status?: string, isDeleted?: boolean) => {
  // If no status is provided, fall back to the old isDeleted logic
  if (!status) {
    return (
      <Badge variant={isDeleted ? "destructive" : "default"}>
        {isDeleted ? "Inactive" : "Active"}
      </Badge>
    );
  }

  // Color coding based on hiring pipeline status
  const getStatusVariant = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (
      normalizedStatus.includes("hired") ||
      normalizedStatus.includes("offer")
    ) {
      return "default"; // Green
    }
    if (normalizedStatus.includes("rejected")) {
      return "destructive"; // Red
    }
    if (
      normalizedStatus.includes("interview") ||
      normalizedStatus.includes("phone")
    ) {
      return "secondary"; // Blue/Gray
    }
    return "outline"; // Default for other statuses
  };

  const getStatusClassName = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes("hired")) {
      return "bg-green-600 text-white hover:bg-green-700";
    }
    if (normalizedStatus.includes("offer")) {
      return "bg-green-500 text-white hover:bg-green-600";
    }
    if (normalizedStatus.includes("rejected")) {
      return "bg-red-500 text-white hover:bg-red-600";
    }
    if (normalizedStatus.includes("interview")) {
      return "bg-blue-500 text-white hover:bg-blue-600";
    }
    if (normalizedStatus.includes("phone")) {
      return "bg-purple-500 text-white hover:bg-purple-600";
    }
    if (normalizedStatus.includes("applied")) {
      return "bg-gray-500 text-white hover:bg-gray-600";
    }
    return "bg-gray-400 text-white hover:bg-gray-500";
  };

  return (
    <Badge
      variant={getStatusVariant(status)}
      className={getStatusClassName(status)}
    >
      {status}
    </Badge>
  );
};

function MatchBadge({ match }: { match: string | boolean }) {
  const isMatch = match === "Yes" || match === true;
  return (
    <Badge
      className={
        isMatch
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-red-100 text-red-800 hover:bg-red-200"
      }
    >
      {isMatch ? (
        <CheckCircle className="w-3 h-3 mr-1" />
      ) : (
        <XCircle className="w-3 h-3 mr-1" />
      )}
      {isMatch ? "Match" : "No Match"}
    </Badge>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isEmail = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isEmail?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <span className="font-medium text-sm min-w-0">{label}:</span>
      {isEmail ? (
        <a
          href={`mailto:${value}`}
          className="text-blue-600 hover:text-blue-800 underline text-sm truncate"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm truncate">{value}</span>
      )}
    </div>
  );
}

function PersonalInfoCard({ candidate }: { candidate: ShortListedCandidate }) {
  return (
    <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white m-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <User className="w-6 h-6 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <InfoRow icon={User} label="Name" value={candidate.applicant_name} />
        <InfoRow
          icon={Mail}
          label="Email"
          value={candidate.applicant_email}
          isEmail
        />
        <InfoRow icon={Phone} label="Phone" value={candidate.applicant_phone} />
        <InfoRow
          icon={Briefcase}
          label="Applied For"
          value={candidate.job_applied_for}
        />

        {candidate.applicant_summary && (
          <>
            <Separator className="my-4" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-semibold text-base">Summary:</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-primary">
                <p className="text-gray-700 text-base leading-relaxed">
                  {candidate.applicant_summary}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MatchAnalysisCard({ candidate }: { candidate: ShortListedCandidate }) {
  const scoreLabel = useMemo(
    () => getScoreLabel(candidate.match_score),
    [candidate.match_score]
  );

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white m-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <Star className="w-6 h-6 text-yellow-500" />
          Match Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="font-semibold text-sm text-gray-500">
              Overall Score
            </div>
            <div className="space-y-1">
              <Badge
                className={`${getBadgeClassName(
                  candidate.match_score
                )} text-lg px-4 py-2 rounded-xl shadow`}
              >
                {candidate.match_score}%
              </Badge>
              <div className="text-xs text-gray-400 font-medium">
                {scoreLabel}
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="font-semibold text-sm text-gray-500">Job Match</div>
            <MatchBadge match={candidate.job_matched} />
          </div>

          <div className="text-center space-y-2">
            <div className="font-semibold text-sm text-gray-500">
              Summary Match
            </div>
            <MatchBadge match={candidate.summary_match} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExperienceCard({ candidate }: { candidate: ShortListedCandidate }) {
  return (
    <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white m-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <Clock className="w-6 h-6 text-blue-500" />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow">
            <span className="font-semibold text-base text-gray-600">
              Years of Experience:
            </span>
            <Badge variant="outline" className="ml-2 text-base">
              {candidate.experience?.years_found > 0
                ? `${candidate.experience.years_found} years`
                : "Not specified"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow">
            <span className="font-semibold text-base text-gray-600">
              Experience Match:
            </span>
            <MatchBadge match={candidate.experience?.match === "yes"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillsCard({ skills }: { skills: string[] }) {
  if (!skills || skills.length === 0) return null;

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white m-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <Award className="w-6 h-6 text-purple-500" />
          Matched Skills{" "}
          <span className="text-gray-500">({skills.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="hover:bg-purple-100 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1 text-base shadow"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DataCard({
  title,
  icon: Icon,
  data,
  emptyMessage = "No data available",
  scrollable = false,
}: {
  title: string;
  icon: React.ElementType;
  data: unknown[] | string | null;
  emptyMessage?: string;
  scrollable?: boolean;
}) {
  if (!data || (Array.isArray(data) && data.length === 0)) return null;

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white m-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <Icon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {typeof data === "string" ? (
          <div className="bg-gray-50 rounded-xl border p-4">
            {scrollable ? (
              <ScrollArea className="h-64">
                <pre className="text-base whitespace-pre-wrap font-mono text-gray-700">
                  {data}
                </pre>
              </ScrollArea>
            ) : (
              <pre className="text-base whitespace-pre-wrap font-mono text-gray-700">
                {data}
              </pre>
            )}
          </div>
        ) : Array.isArray(data) ? (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl border">
                <pre className="text-base whitespace-pre-wrap font-mono text-gray-700">
                  {typeof item === "object" && item !== null
                    ? JSON.stringify(item, null, 2)
                    : String(item)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-base">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ViewCandidateDetailModal({
  open,
  onOpenChange,
  candidate,
  onDownloadCV,
  onContactCandidate,
}: ViewCandidateDetailModalProps) {
  if (!candidate) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl lg:max-w-xl xl:max-w-2xl overflow-hidden">
        <SheetHeader className="space-y-3 pb-4 px-8 pt-8">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <User className="w-8 h-8 text-primary" />
              {candidate.applicant_name}
            </SheetTitle>
            <SheetTitle className="flex items-center font-bold mr-5 ">
              <div className="text-center">
                <div
                  className={`${totalScoreClassName(
                    candidate.match_score
                  )} text-3xl font-bold `}
                >
                  {candidate.match_score}%
                </div>
                <p className="text-xs text-gray-800 ">Total Score</p>
              </div>
            </SheetTitle>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-2">
            {onContactCandidate && (
              <Button
                size="sm"
                onClick={() => onContactCandidate(candidate)}
                className="flex items-center gap-2 rounded-lg shadow bg-blue-600 text-white hover:bg-blue-700"
              >
                <MessageSquare className="w-4 h-4" />
                Contact
              </Button>
            )}

            {onDownloadCV && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownloadCV(candidate)}
                className="flex items-center gap-2 rounded-lg shadow border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                Download CV
              </Button>
            )}

            {candidate.applicant_email && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="flex items-center gap-2 rounded-lg shadow border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                <a href={`mailto:${candidate.applicant_email}`}>
                  <ExternalLink className="w-4 h-4" />
                  Email
                </a>
              </Button>
            )}
            <MatchBadge match={candidate.job_matched} />
            {getStatusBadge(candidate.status, candidate.isDeleted)}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-8 pl-8 pb-8">
          <PersonalInfoCard candidate={candidate} />

          <div className="gap-6">
            <DataCard
              title="Jobs Matched"
              icon={Briefcase}
              data={candidate.jobs_matched}
            />

            {candidate.matched_skills &&
              candidate.matched_skills.length > 0 && (
                <SkillsCard skills={candidate.matched_skills} />
              )}

            <ExperienceCard candidate={candidate} />

            <DataCard
              title="Bonus Matches"
              icon={Star}
              data={candidate.bonus_matches}
            />

            <MatchAnalysisCard candidate={candidate} />

            <DataCard
              title="CV Details"
              icon={FileText}
              data={candidate.cv_details}
              scrollable={true}
            />
          </div>
        </ScrollArea>

        <SheetFooter className="pt-6 border-t px-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg shadow text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
