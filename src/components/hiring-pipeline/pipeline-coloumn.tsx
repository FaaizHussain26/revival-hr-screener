"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CandidateCard } from "./candidate-card";

import { cn } from "@/lib/utils";
import { Candidate } from "@/api/requests/hiring-pipeline-api";
import { ShortListedCandidate } from "../shortlisted-candidates-page";

interface PipelineColumnProps {
  id: string;
  title: string;
  count: number;
  candidates: Candidate[];
  onCandidateClick?: (candidate: ShortListedCandidate) => void;
}

export function PipelineColumn({
  id,
  title,
  count,
  candidates,
  onCandidateClick,
}: PipelineColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const getColumnColor = (id: string) => {
    switch (id) {
      case "hired":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "rejected":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
      case "offer":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
      default:
        return "bg-card border-border";
    }
  };

  const getBadgeColor = (id: string) => {
    switch (id) {
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "offer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "p-4 min-h-[400px] transition-colors",
        getColumnColor(id),
        isOver && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <Badge variant="secondary" className={getBadgeColor(id)}>
          {count}
        </Badge>
      </div>

      <div className="space-y-3">
        {candidates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No candidates
            <br />
            <span className="text-xs">Drop candidates here</span>
          </div>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              onClick={onCandidateClick}
            />
          ))
        )}
      </div>
    </Card>
  );
}
