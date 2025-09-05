"use client"

import { HiringPipelineBoard } from "@/components/hiring-pipeline/hiring-pipeline-board"

export default function Pipeline() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Hiring Pipeline</h1>
          <p className="text-muted-foreground">
            Track candidates through each stage of your hiring process. Drag candidates between stages to update their
            status.
          </p>
        </div>
        <HiringPipelineBoard />
      </div>
    </div>
  )
}
