"use client";

import { restoreUser } from "@/api/requests/shortlisted-candidates-api";
import {
  changeUserRole,
  deleteUser,
  permanentDeleteUser,
  toggleUserStatus,
} from "@/api/requests/users-api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/hooks/use-admin";

import {
  MoreHorizontal,
  Edit,
  Trash2,
  RotateCcw,
  UserX,
  Shield,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted?: boolean;
}

interface UserActionsProps {
  user: User;
  onUserUpdated: () => void;
}

export function UserActions({ user, onUserUpdated }: UserActionsProps) {
  const { isAdmin: userIsAdmin } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (
    action: () => Promise<void>,
    successMessage: string
  ) => {
    setIsLoading(true);
    try {
      await action();
      toast.success(successMessage);
      onUserUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    handleAction(
      () => deleteUser(user.id),
      `${user.firstName} ${user.lastName} has been deleted`
    );
  };

  const handlePermanentDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      handleAction(
        () => permanentDeleteUser(user.id).then(() => onUserUpdated()),
        `${user.firstName} ${user.lastName} has been permanently deleted`
      );
    }
  };

  const handleRestore = () => {
    handleAction(
      () => restoreUser(user.id),
      `${user.firstName} ${user.lastName} has been restored`
    );
  };

  const handleToggleStatus = () => {
    const newStatus = !user.isActive;

    handleAction(async () => {
      await toggleUserStatus(user.id, newStatus); // discard returned User
    }, `${user.firstName} ${user.lastName} has been ${newStatus ? "activated" : "deactivated"}`);
  };

  const handleChangeRole = (newRole: string) => {
    handleAction(
      () => changeUserRole(user.id, newRole).then(() => onUserUpdated()),
      `${user.firstName} ${user.lastName}'s role changed to ${newRole}`
    );
  };

  if (!userIsAdmin) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("Edit user", user.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleToggleStatus}>
          {user.isActive ? (
            <>
              <UserX className="mr-2 h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <UserIcon className="mr-2 h-4 w-4" />
              Activate
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {user.role !== "admin" && (
          <DropdownMenuItem onClick={() => handleChangeRole("admin")}>
            <Shield className="mr-2 h-4 w-4" />
            Make Admin
          </DropdownMenuItem>
        )}

        {user.role !== "user" && (
          <DropdownMenuItem onClick={() => handleChangeRole("user")}>
            <UserIcon className="mr-2 h-4 w-4" />
            Make User
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {user.isDeleted ? (
          <>
            <DropdownMenuItem onClick={handleRestore}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handlePermanentDelete}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Permanently
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
