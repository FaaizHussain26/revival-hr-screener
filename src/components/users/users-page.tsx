"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Search, Shield, Users, UserCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useAdmin } from "@/hooks/use-admin";
import { useUsers } from "@/api/hooks/job-module/useUsers";
import { UserActions } from "./user-actions";
import { RenderPagination } from "../pagination/pagination";
import { EmptyState, ErrorState, TableSkeleton } from "../Table";

// Constants
const ITEMS_PER_PAGE = 5;

// Types (adjust to match your API response)

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser, isAdmin } = useAdmin();

  const { data, isLoading, isError, refetch } = useUsers({
    page: currentPage,
    search: searchTerm,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    console.log("[UsersPage] State:", {
      currentPage,
      searchTerm,
      isLoading,
      isError,
    });
    if (data) console.log("[UsersPage] Data received:", data);
  }, [currentPage, searchTerm, isLoading, isError, data]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page when searching
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleUserUpdated = () => refetch();

  // Derived data
  const users = data?.data ?? [];
  const totalCount = data?.pagination.total ?? 0;
  const totalPages = Math.ceil((data?.pagination.total ?? 0) / ITEMS_PER_PAGE);
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  const renderRows = useCallback(() => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (users.length === 0) {
      return (
        <EmptyState
          title="No Users found"
          description={
            searchTerm
              ? `No Users match your search for "${searchTerm}". Try adjusting your search terms.`
              : "No Users have been shortlisted yet. Candidates will appear here once they are added to the system."
          }
          icon={searchTerm ? Search : Users}
        />
      );
    }

    return (
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-8 text-muted-foreground"
            >
              {searchTerm
                ? `No users found matching "${searchTerm}"`
                : "No users found"}
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <UserActions user={user} onUserUpdated={handleUserUpdated} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    );
  }, [isLoading, users, searchTerm, handleUserUpdated]);

  if (isError) {
    return <ErrorState error={isError} />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage and monitor all users in your system
          </p>
          {currentUser && (
            <p className="text-sm text-muted-foreground mt-1">
              Logged in as:
              {isAdmin && (
                <Badge variant="default" className="ml-2">
                  Admin
                </Badge>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Users",
            value: totalCount,
            icon: <Users className="h-6 w-6 text-white" />,
          },
          {
            label: "Active Users",
            value: activeUsers,
            icon: <UserCheck className="h-6 w-6 text-white" />,
          },
          {
            label: "Admins",
            value: adminUsers,
            icon: <Shield className="h-6 w-6 text-white" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 rounded-xl p-3 flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                A list of all users including their name, email, role and
                status.
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderRows()}
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {users.length === 0
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
        </CardContent>
      </Card>
    </div>
  );
}
