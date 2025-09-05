import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Mail, Phone, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DialogContent,
  DialogHeader,
} from "../ui/dialog-applicant-detail-model";

interface Applicant {
  _id: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_email: string;
  job_matched: "Yes" | "No";
  matched_skills: string[];
  match_score: number;
}

interface JobApplicants {
  _id: string;
  count: number;
  data: Applicant[];
}

interface ApplicantDetailModalProps {
  job: JobApplicants | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicantDetailModal = ({
  job,
  isOpen,
  onClose,
}: ApplicantDetailModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMatch, setFilterMatch] = useState<string>("all");
  const [sortBy, setSortBy] = useState("score");

  const getClassificationColor = (matched: "Yes" | "No") => {
    if (matched === "Yes") return "bg-green-50 text-green-700 border-green-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const applicantsForJob = useMemo(() => {
    if (!job || !job.data) return [];
    return job.data;
  }, [job]);

  const filteredApplicants = useMemo(() => {
    return applicantsForJob
      .filter((applicant) => {
        const matchesSearch =
          applicant.applicant_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          applicant.applicant_email
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilter =
          filterMatch === "all" ||
          (filterMatch === "matched" && applicant.job_matched === "Yes") ||
          (filterMatch === "unmatched" && applicant.job_matched === "No");
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "score") return b.match_score - a.match_score;
        if (sortBy === "name")
          return a.applicant_name.localeCompare(b.applicant_name);
        return 0;
      });
  }, [applicantsForJob, searchTerm, filterMatch, sortBy]);

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Match Score",
      "Matched",
      "Skills",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredApplicants.map((applicant) =>
        [
          applicant.applicant_name,
          applicant.applicant_email,
          applicant.applicant_phone,
          applicant.match_score,
          applicant.job_matched,
          `"${applicant.matched_skills.join("; ")}"`,
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${job?._id}-applicants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Applicants for Job ID: {job?._id}
          </DialogTitle>
          <p className="text-muted-foreground">
            Job ID: {job?._id} • {filteredApplicants?.length} of{" "}
            {applicantsForJob?.length} applicants
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterMatch} onValueChange={setFilterMatch}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="unmatched">Unmatched</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Match Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>

          {/* Applicants Table */}
          <div className="border rounded-lg overflow-auto">
            <div className="bg-muted/50 px-6 py-3 border-b">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Candidate</div>
                <div className="col-span-3">Contact</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-2">Matched</div>
                <div className="col-span-2">Skills</div>
              </div>
            </div>

            <div className="divide-y">
              {filteredApplicants.map((applicant) => (
                <div
                  key={applicant._id}
                  className="px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 font-medium">
                      {applicant.applicant_name}
                    </div>
                    <div className="col-span-3 space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {applicant.applicant_email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {applicant.applicant_phone}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-xl font-bold">
                        {applicant.match_score}%
                      </span>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        className={getClassificationColor(
                          applicant.job_matched
                        )}
                      >
                        {applicant.job_matched === "Yes"
                          ? "Strong Match"
                          : "No Match"}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex flex-wrap gap-1">
                      {applicant.matched_skills.length > 0 ? (
                        applicant.matched_skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No matched skills
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredApplicants.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <Filter className="h-8 w-8 mx-auto mb-2" />
                No applicants found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
