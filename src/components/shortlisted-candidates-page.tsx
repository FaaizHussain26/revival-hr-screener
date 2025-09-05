/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useDeleteShortListedCandidates } from "@/api/hooks/useDeleteShortListedCandidate";
import { useShortListedCandidates } from "@/api/hooks/useShortListedCandidates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortlistCandidateData } from "@/utils/Content-Data/shortlist-candidate-data";
import { Eye, Filter, Search, Trash2, AlertCircle, Users } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "./modals/delete-confirmation";
import { RenderPagination } from "./pagination/pagination";
import { ViewCandidateDetailModal } from "./sheets/view-details";

export interface ShortListedCandidate {
  _id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  applicant_summary: string;
  job_matched: string | boolean;
  summary_match: string | boolean;
  matched_skills: string[];
  experience: {
    years_found: number;
    match: "yes" | "no";
    [key: string]: any;
  };
  bonus_matches: any[];
  match_score: number;
  jobs_matched: any[];
  outlook_details?: {
    message_id: string;
    attachment_id: string;
  };
  cv_details: string;
  job_applied_for: string;
  deletedAt: string;
  isDeleted: boolean;
}

const ITEMS_PER_PAGE = 15;

// Skeleton Components
function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="text-left pl-10">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-20 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-12 mx-auto rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
        </div>
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRowSkeleton key={index} />
      ))}
    </>
  );
}

// Empty State Component
function EmptyState({
  title,
  description,
  icon: Icon = Users,
}: {
  title: string;
  description: string;
  icon?: any;
}) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-muted p-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {description}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Error State Component
function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card className="border-destructive/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-destructive">
                Error Loading Candidates
              </h3>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ShortlistedCandidatesPage({
  limit,
  disablePagination,
  disableFilters,
}: {
  limit?: number;
  disablePagination?: boolean;
  disableFilters?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [candidateToDelete, setCandidateToDelete] =
    useState<ShortListedCandidate | null>(null);
  const [candidateToView, setCandidateToView] =
    useState<ShortListedCandidate | null>(null);

  const {
    data: shortListedCandidates,
    isLoading,
    isError,
    error,
  } = useShortListedCandidates({
    page: currentPage,
    search: searchTerm,
    limit: limit || ITEMS_PER_PAGE,
  });

  const { mutate: deleteCandidate, isPending: isDeleting } =
    useDeleteShortListedCandidates();

  const handleDeleteClick = () => {
    deleteCandidate(candidateToDelete?._id as string);
    setCandidateToDelete(null);
  };

  const handleViewClick = (candidate: ShortListedCandidate) => {
    setCandidateToView(candidate);
  };

  const allCandidates = shortListedCandidates?.data || [];
  const lastPages = shortListedCandidates?.last_page || 1;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getBadgeClassName = (score: number) => {
    if (score >= 90) return "bg-green-800 text-white animate-pulse";
    if (score >= 80) return "bg-green-400 text-white";
    if (score >= 70) return "bg-yellow-400 text-black";
    return "bg-red-500 text-white";
  };

  const getStatusBadge = (isDeleted: boolean) => {
    return (
      <Badge variant={isDeleted ? "destructive" : "default"}>
        {isDeleted ? "Inactive" : "Active"}
      </Badge>
    );
  };

  const renderCandidateRows = (candidates: ShortListedCandidate[]) => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (candidates.length === 0) {
      return (
        <EmptyState
          title="No candidates found"
          description={
            searchTerm
              ? `No candidates match your search for "${searchTerm}". Try adjusting your search terms.`
              : "No candidates have been shortlisted yet. Candidates will appear here once they are added to the system."
          }
          icon={searchTerm ? Search : Users}
        />
      );
    }

    return (
      <>
        {candidates.map((candidate) => (
          <TableRow
            key={candidate._id}
            className="text-center hover:bg-muted/50 transition-colors"
          >
            <TableCell className="text-left pl-10 font-medium">
              {candidate.applicant_name}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                className={
                  candidate.job_matched === "No"
                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }
              >
                {candidate.job_matched}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {candidate.experience?.years_found > 0
                ? `${candidate.experience.years_found} years`
                : "N/A"}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                className={getBadgeClassName(candidate.match_score)}
              >{`${candidate.match_score}%`}</Badge>
            </TableCell>
            <TableCell className="text-center">
              {getStatusBadge(candidate.isDeleted)}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewClick(candidate)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {!candidate.isDeleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCandidateToDelete(candidate)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  if (isError) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        {!disableFilters && !disablePagination && (
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">
              {shortlistCandidateData.heading}
            </h2>
            <p className="text-muted-foreground">
              {shortlistCandidateData.subHeading}
            </p>
          </div>
        )}

        {/* Search and Filter Controls */}
        {!disableFilters && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Input
                placeholder={shortlistCandidateData.searchBar}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full sm:w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {!isLoading && allCandidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Candidates</p>
                  <p className="text-2xl font-bold">{allCandidates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold">
                    {
                      allCandidates.filter(
                        (c: ShortListedCandidate) => !c.isDeleted
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Inactive</p>
                  <p className="text-2xl font-bold">
                    {
                      allCandidates.filter(
                        (c: ShortListedCandidate) => c.isDeleted
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-left pl-10 font-semibold">
                    {shortlistCandidateData.tableColumn.tableColumnOne}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    {shortlistCandidateData.tableColumn.tableColumnTwo}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    {shortlistCandidateData.tableColumn.tableColumnThree}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    {shortlistCandidateData.tableColumn.tableColumnFour}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-center font-semibold w-[120px]">
                    {shortlistCandidateData.tableColumn.tableColumnFive}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderCandidateRows(allCandidates)}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {!isLoading && allCandidates.length > 0 && !disablePagination && (
        <RenderPagination
          lastPages={lastPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        />
      )}

      <DeleteConfirmationModal
        open={!!candidateToDelete}
        onOpenChange={() => setCandidateToDelete(null)}
        onClickConfirm={handleDeleteClick}
        loading={isDeleting}
        candidateId={candidateToDelete?._id || ""}
      />

      <ViewCandidateDetailModal
        open={!!candidateToView}
        onOpenChange={() => setCandidateToView(null)}
        candidate={candidateToView}
      />
    </div>
  );
}
