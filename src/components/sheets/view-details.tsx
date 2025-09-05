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
import type { ShortListedCandidate } from "../shortlisted-candidates-page";

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

const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Good Match";
  if (score >= 70) return "Fair Match";
  return "Poor Match";
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
  icon: any;
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
    <Card className="h-fi m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">Summary:</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm leading-relaxed">
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
    <Card className="h-fit m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="w-5 h-5" />
          Match Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="font-medium text-sm text-muted-foreground">
              Overall Score
            </div>
            <div className="space-y-1">
              <Badge
                className={`${getBadgeClassName(
                  candidate.match_score
                )} text-lg px-3 py-1`}
              >
                {candidate.match_score}%
              </Badge>
              <div className="text-xs text-muted-foreground">{scoreLabel}</div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="font-medium text-sm text-muted-foreground">
              Job Match
            </div>
            <MatchBadge match={candidate.job_matched} />
          </div>

          <div className="text-center space-y-2">
            <div className="font-medium text-sm text-muted-foreground">
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
    <Card className="h-fit m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5" />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium text-sm">Years of Experience:</span>
            <Badge variant="outline" className="ml-2">
              {candidate.experience?.years_found > 0
                ? `${candidate.experience.years_found} years`
                : "Not specified"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium text-sm">Experience Match:</span>
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
    <Card className="h-fit m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5" />
          Matched Skills ({skills.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="hover:bg-secondary/80 transition-colors"
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
  icon: any;
  data: any[] | string | null;
  emptyMessage?: string;
  scrollable?: boolean;
}) {
  if (!data || (Array.isArray(data) && data.length === 0)) return null;

  return (
    <Card className="h-fit m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {typeof data === "string" ? (
          <div className="bg-muted/50 rounded-lg border">
            {scrollable ? (
              <ScrollArea className="h-64 p-4">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {data}
                </pre>
              </ScrollArea>
            ) : (
              <div className="p-4">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {data}
                </pre>
              </div>
            )}
          </div>
        ) : Array.isArray(data) ? (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="bg-muted/50 p-4 rounded-lg border">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {typeof item === "object"
                    ? JSON.stringify(item, null, 2)
                    : item}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
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
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl overflow-hidden">
        <SheetHeader className="space-y-3 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6" />
            {candidate.applicant_name}
          </SheetTitle>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {onContactCandidate && (
              <Button
                size="sm"
                onClick={() => onContactCandidate(candidate)}
                className="flex items-center gap-2"
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
                className="flex items-center gap-2"
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
                className="flex items-center gap-2 bg-transparent"
              >
                <a href={`mailto:${candidate.applicant_email}`}>
                  <ExternalLink className="w-4 h-4" />
                  Email
                </a>
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <PersonalInfoCard candidate={candidate} />

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <DataCard
                title="Jobs Matched"
                icon={Briefcase}
                data={candidate.jobs_matched}
              />

              {candidate.matched_skills &&
                candidate.matched_skills.length > 0 && (
                  <SkillsCard skills={candidate.matched_skills} />
                )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <ExperienceCard candidate={candidate} />

              <DataCard
                title="Bonus Matches"
                icon={Star}
                data={candidate.bonus_matches}
              />
              {/* <StatusCard candidate={candidate} /> */}
            </div>
          </div>
          <MatchAnalysisCard candidate={candidate} />

          <DataCard
            title="CV Details"
            icon={FileText}
            data={candidate.cv_details}
            scrollable={true}
          />
        </ScrollArea>

        <SheetFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
