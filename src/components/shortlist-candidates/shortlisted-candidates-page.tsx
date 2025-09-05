"use client";

import type React from "react";
import { useDeleteShortListedCandidates } from "@/api/hooks/useDeleteShortListedCandidate";
import {
  useRestoreUser,
  useShortListedCandidates,
} from "@/api/hooks/useShortListedCandidates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortlistCandidateData } from "@/utils/Content-Data/shortlist-candidate-data";
import {
  Eye,
  Filter,
  Search,
  Trash2,
  Users,
  UserX,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { FilterPopover, FilterState } from "../modals/filter-modal";
import DashboardCard from "../dashboard/dashboard-card";
import { RenderPagination } from "./pagination";
import { DeleteConfirmationModal } from "../modals/delete-confirmation";
import { ViewCandidateDetailModal } from "./view-details";
import { EmptyState, ErrorState, TableSkeleton } from "../Table";

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
    [key: string]: unknown;
  };
  bonus_matches: unknown[];
  match_score: number;
  jobs_matched: unknown[];
  outlook_details?: {
    message_id: string;
    attachment_id: string;
  };
  cv_details: string;
  job_applied_for: string;
  deletedAt: string;
  isDeleted: boolean;
  status?: string;
}

const ITEMS_PER_PAGE = 7;

// Skeleton Components

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    matchScoreMin: null,
    matchScoreMax: null,
    summaryMatched: null,
    title: "",
  });

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

  const restoreUserMutation = useRestoreUser();

  const handleRestoreClick = (candidate: ShortListedCandidate) => {
    restoreUserMutation.mutate(candidate._id);
  };

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

  const filteredCandidates = allCandidates.filter(
    (candidate: ShortListedCandidate) => {
      const { matchScoreMin, matchScoreMax, summaryMatched, title } = filters;

      const score = candidate.match_score;

      const matchScoreMatch =
        (matchScoreMin === null || score >= matchScoreMin) &&
        (matchScoreMax === null || score <= matchScoreMax);

      const summaryMatch =
        summaryMatched === null ||
        (summaryMatched
          ? candidate.job_matched === "Yes"
          : candidate.job_matched === "No");

      const jobTitleMatch =
        title === "" ||
        candidate.applicant_name.toLowerCase().includes(title.toLowerCase());

      return matchScoreMatch && summaryMatch && jobTitleMatch;
    }
  );

  // const lastPages = shortListedCandidates?.last_page || 1;

  const totalCount = shortListedCandidates?.pagination.total ?? 0;
  const totalPages = Math.ceil(
    (shortListedCandidates?.pagination.total ?? 0) / ITEMS_PER_PAGE
  );

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

  const cardData = {
    stats: [
      {
        title: "Total Candidates",
        value: allCandidates.length,
        icon: Users,
      },
      {
        title: "Active",
        value: allCandidates.filter((c: ShortListedCandidate) => !c.isDeleted)
          .length,
        icon: UserCheck,
      },
      {
        title: "Inactive",
        value: allCandidates.filter((c: ShortListedCandidate) => c.isDeleted)
          .length,
        icon: UserX,
      },
    ],
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
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">
                  {candidate.applicant_name}
                </p>
                {candidate.deletedAt && (
                  <Badge variant="destructive" className="text-xs">
                    Deleted
                  </Badge>
                )}
              </div>
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
              {getStatusBadge(candidate.status, candidate.isDeleted)}
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
                {candidate.deletedAt ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestoreClick(candidate)}
                    className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                    title="Restore candidate"
                    disabled={restoreUserMutation.isPending}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCandidateToDelete(candidate);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    title="Delete candidate"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {/* {!candidate.isDeleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCandidateToDelete(candidate);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )} */}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {shortlistCandidateData.heading}
              </h1>
              <p className="text-muted-foreground">
                {shortlistCandidateData.subHeading}
              </p>
            </div>
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
                className="pl-10 w-full sm:w-80"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FilterPopover
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              filters={filters}
              onApplyFilters={(newFilters) => {
                setFilters(newFilters);
                setIsFilterOpen(false);
              }}
            >
              <Button variant="secondary">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </FilterPopover>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {!isLoading && allCandidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cardData.stats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
              <TableBody>{renderCandidateRows(filteredCandidates)}</TableBody>
            </Table>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4 pl-10 pr-10">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  {allCandidates.length === 0
                    ? 0
                    : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
                  to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{" "}
                  {totalCount} users
                </div>
                <RenderPagination
                  currentPage={currentPage}
                  lastPages={totalPages}
                  handlePageChange={handlePageChange}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        open={!!candidateToDelete}
        onOpenChange={() => setCandidateToDelete(null)}
        onClickConfirm={handleDeleteClick}
        loading={isDeleting}
        candidateId={candidateToDelete ? candidateToDelete._id : ""}
      />

      <ViewCandidateDetailModal
        open={!!candidateToView}
        onOpenChange={() => setCandidateToView(null)}
        candidate={candidateToView}
      />
    </div>
  );
}
