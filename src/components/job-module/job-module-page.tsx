"use client";

import type React from "react";

import {
  FilePlus,
  Eye,
  Trash2,
  Search,
  Briefcase,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { jobModulePageData } from "@/utils/Content-Data/job-module-data";
import { CreateJobModal } from "@/components/job-module/create-job-modal";
import {
  useDeleteJob,
  useJobs,
  useRestoreJob,
} from "@/api/hooks/job-module/useJobs";
import { Job } from "@/api/requests/job-module-api";
import { DeleteConfirmationModal } from "./modals/delete-confirmation-modal";
import { ViewJobModal } from "./modals/view-job-modal";
import { RenderPagination } from "./pagination-job";
import { EmptyState, ErrorState, TableSkeleton } from "../Table";

const ITEMS_PER_PAGE = 7;

export function JobModulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [jobToView, setJobToView] = useState<Job | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Fetch jobs with React Query
  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
  } = useJobs({
    page: currentPage,
    search: searchTerm,
    limit: ITEMS_PER_PAGE,
  });

  // Mutations
  const deleteJobMutation = useDeleteJob();
  const restoreJobMutation = useRestoreJob();

  const jobs: Job[] = jobsResponse?.data || [];

  const totalCount = jobsResponse?.pagination.total ?? 0;
  const totalPages = Math.ceil(
    (jobsResponse?.pagination.total ?? 0) / ITEMS_PER_PAGE
  );

  // const totalPages = jobsResponse?.last_page || 1;
  // const totalItems = jobsResponse?.total || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewClick = (job: Job) => {
    setJobToView(job);
  };

  const handleDeleteClick = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete._id);
      setJobToDelete(null);
    }
  };

  const handleRestoreClick = (job: Job) => {
    restoreJobMutation.mutate(job._id);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const renderSkills = (skills: string[]) => {
    if (!skills || skills.length === 0) {
      return <span className="text-muted-foreground">No skills listed</span>;
    }

    // Show 2-3 skills per row
    const skillsToShow = skills.slice(0, 3);
    const remainingCount = skills.length - 3;

    return (
      <div className="flex flex-wrap gap-1 justify-center max-w-xs mx-auto">
        {skillsToShow.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="outline" className="text-xs">
            +{remainingCount} more
          </Badge>
        )}
      </div>
    );
  };

  const renderJobRows = (jobs: Job[]) => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (jobs.length === 0) {
      return (
        <EmptyState
          title="No jobs found"
          description={
            searchTerm
              ? `No jobs match your search for "${searchTerm}". Try adjusting your search terms.`
              : "No jobs have been created yet. Jobs will appear here once they are added to the system."
          }
          icon={searchTerm ? Search : Briefcase}
        />
      );
    }

    return (
      <>
        {jobs.map((job) => (
          <TableRow
            key={job._id}
            className="hover:bg-muted/50 transition-colors"
          >
            <TableCell className="text-left pl-10 font-medium">
              <div className="max-w-xs">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{job.title}</p>
                  {job.deletedAt && (
                    <Badge variant="destructive" className="text-xs">
                      Deleted
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {job.description}
                </p>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="font-medium">
                {job.experience_level}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {renderSkills(job.skills)}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewClick(job)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                  title="View job details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {job.deletedAt ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestoreClick(job)}
                    className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                    title="Restore job"
                    disabled={restoreJobMutation.isPending}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setJobToDelete(job)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    title="Delete job"
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {jobModulePageData.heading}
          </h2>
          <p className="text-muted-foreground">
            {jobModulePageData.subHeading}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            className="flex items-center bg-card-box hover:bg-blue-700"
            onClick={handleOpenModal}
          >
            <FilePlus className="h-4 w-4" />
            <div className="ml-2">{jobModulePageData.button}</div>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto ">
            <Table>
              <TableHeader className="">
                <TableRow className="">
                  <TableHead className="font-semibold text-left w-1/3 pl-10 ">
                    Job Title
                  </TableHead>
                  <TableHead className="text-center font-semibold w-1/4">
                    Job Experience
                  </TableHead>
                  <TableHead className="text-center font-semibold w-1/3">
                    Skills
                  </TableHead>
                  <TableHead className="text-center font-semibold w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderJobRows(jobs)}</TableBody>
            </Table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4 pl-10 pr-10">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {jobs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
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
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateJobModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <DeleteConfirmationModal
        open={!!jobToDelete}
        onOpenChange={() => setJobToDelete(null)}
        onClickConfirm={handleDeleteClick}
        loading={deleteJobMutation.isPending}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action will soft delete the job and it can be restored later."
      />

      <ViewJobModal
        open={!!jobToView}
        onOpenChange={() => setJobToView(null)}
        job={jobToView}
      />
    </div>
  );
}
