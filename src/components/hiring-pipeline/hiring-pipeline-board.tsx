"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useHiringPipeline } from "@/api/hooks/useHiringPipeline";
import { Candidate } from "@/api/requests/hiring-pipeline-api";
import { PipelineColumn } from "./pipeline-coloumn";
import { CandidateCard } from "./candidate-card";
import { ViewCandidateDetailModal } from "../shortlist-candidates/view-details";
import { ShortListedCandidate } from "../shortlisted-candidates-page";

const PIPELINE_STAGES = [
  { id: "applied", label: "Applied" },
  { id: "phone_screen", label: "Phone Screen" },
  { id: "interview", label: "Interview" },
  { id: "final_interview", label: "Final Interview" },
  { id: "offer", label: "Offer" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

export function HiringPipelineBoard() {
  const { stages, loading, error, moveCandidateToStatus, isMoving } =
    useHiringPipeline();
  const { toast } = useToast();
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedCandidate, setSelectedCandidate] =
    useState<ShortListedCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidateId = active.id as string;

    // Find the candidate being dragged
    for (const stage of stages) {
      const candidate = stage.data.find((c) => c._id === candidateId);
      if (candidate) {
        setActiveCandidate(candidate);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const candidateId = active.id as string;
    const newStatus = over.id as string;

    // Find current status using .find
    const currentStage = stages.find((stage) =>
      stage.data.some((c) => c._id === candidateId)
    );
    const currentStatus = currentStage?._id;

    // If not found or no change, do nothing
    if (!currentStatus || currentStatus === newStatus) return;

    try {
      await moveCandidateToStatus(candidateId, currentStatus, newStatus);
      toast({
        title: "Success",
        description: "Candidate status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error && error.message
            ? error.message
            : "Failed to update candidate status",
      });
    }
  };

  const handleCandidateClick = (candidate: ShortListedCandidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedCandidate(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {PIPELINE_STAGES.map((stage) => {
          const stageData = stages.find((s) => s._id === stage.id);
          const count = stageData?.count || 0;
          const isHired = stage.id === "hired";

          return (
            <Card key={`summary-${stage.id}`} className="border-2">
              <CardContent className="p-4 text-center">
                <div className="text-sm font-medium text-muted-foreground mb-1 ">
                  {stage.label}
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isHired ? "px-2 py-1 rounded" : ""
                  }`}
                >
                  {count}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className={isMoving ? "opacity-75 pointer-events-none" : ""}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {PIPELINE_STAGES.map((stage) => {
              const stageData = stages.find((s) => s._id === stage.id);
              return (
                <PipelineColumn
                  key={stage.id}
                  id={stage.id}
                  title={stage.label}
                  count={stageData?.count || 0}
                  candidates={stageData?.data || []}
                  onCandidateClick={handleCandidateClick}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeCandidate ? (
              <CandidateCard candidate={activeCandidate} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <ViewCandidateDetailModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        candidate={selectedCandidate || null}
      />
    </>
  );
}
