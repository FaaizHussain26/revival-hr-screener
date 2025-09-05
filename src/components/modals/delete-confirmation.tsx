"use client";

import { useDeleteCandidate } from "@/api/hooks/useShortListedCandidates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClickConfirm: () => void;
  loading: boolean;
  candidateId: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onClickConfirm,
  loading,
  candidateId,
}: DeleteConfirmationModalProps) {
  const deleteCandidateMutation = useDeleteCandidate();

  const handleDelete = (candidateId: string) => {
    deleteCandidateMutation.mutate(candidateId);
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this candidate? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onClickConfirm();
              handleDelete(candidateId);
            }}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
