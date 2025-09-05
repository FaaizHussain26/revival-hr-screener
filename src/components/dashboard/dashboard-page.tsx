"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Search,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { useGetUserWithJobs } from "@/api/hooks/useGetUserWithJobs";

interface JobStats {
  _id: string;
  count: number;
  strongMatch: number;
  potentialMatch: number;
  irrelevant: number;
}

interface JobListProps {
  onJobSelect?: (job: JobStats) => void;
}

function convertUnderscoreToTitle(input: string): string {
  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const DashboardPage = ({ onJobSelect }: JobListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: apiJobs, isPending: loading, error } = useGetUserWithJobs();

  const validJobs: JobStats[] =
    apiJobs?.filter((job: JobStats) => job._id !== null) ?? [];

  const filteredJobs = validJobs.filter((job: JobStats) => {
    const matchesSearch = job?._id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Error loading jobs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header className="bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Open Jobs</h1>
            <p className="text-muted-foreground">
              Manage job postings and review applicants
            </p>
          </div>
          <div className="flex flex-col w-sm gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>
      {/* Search and Filters */}

      {/* Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job: JobStats) => (
          <Card
            key={job._id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {convertUnderscoreToTitle(job?._id) || "Not Found"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{job.count} Total applicants</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold text-green-700">
                      {job.strongMatch}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 font-medium">
                    Strong Match
                  </p>
                </div>

                <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-lg font-semibold text-yellow-700">
                      {job.potentialMatch}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 font-medium">
                    Potential
                  </p>
                </div>

                <div className="text-center p-2 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-lg font-semibold text-red-700">
                      {job.irrelevant}
                    </span>
                  </div>
                  <p className="text-xs text-red-600 font-medium">Irrelevant</p>
                </div>
              </div>

              <Button
                onClick={() => onJobSelect && onJobSelect(job)}
                className="w-full"
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Applicants
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && validJobs.length > 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No jobs found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {validJobs.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No valid jobs available. All jobs have null IDs and are considered
              irrelevant.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
