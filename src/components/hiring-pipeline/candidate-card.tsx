"use client";

import type React from "react";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Candidate } from "@/api/requests/hiring-pipeline-api";
import { ShortListedCandidate } from "../shortlisted-candidates-page";

interface CandidateCardProps {
  candidate: Candidate;
  isDragging?: boolean;
  onClick?: (candidate: ShortListedCandidate) => void;
}

export function CandidateCard({
  candidate,
  isDragging = false,
  onClick,
}: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: candidate._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(candidate as unknown as ShortListedCandidate);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
        (isBeingDragged || isDragging) && "opacity-50 shadow-lg rotate-2",
        candidate.isDuplicated &&
          "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
        onClick && "hover:bg-muted/50" // Added hover effect for clickable cards
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="text-sm">
              {getInitials(candidate.applicant_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm text-foreground truncate">
                {candidate.applicant_name}
              </h4>
              {candidate.isDuplicated && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  Dup
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span
                className={cn(
                  "text-sm font-medium",
                  getMatchScoreColor(candidate.match_score)
                )}
              >
                {candidate.match_score}% Match
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
