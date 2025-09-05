"use client";

import type React from "react";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export type FilterState = {
  title: string;
  matchScoreMin: number | null;
  matchScoreMax: number | null;
  summaryMatched: boolean | null;
};

interface FilterPopoverProps {
  filters: FilterState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterState) => void;
  children?: React.ReactNode;
}

export function FilterPopover({
  filters,
  onApplyFilters,
  children,
}: FilterPopoverProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      matchScoreMin: null,
      matchScoreMax: null,
      summaryMatched: null,
      title: "",
    };
    setLocalFilters(resetFilters);
  };

  const hasActiveFilters =
    localFilters.matchScoreMin !== null ||
    localFilters.matchScoreMax !== null ||
    localFilters.summaryMatched !== null ||
    localFilters.title !== "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {hasActiveFilters && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                •
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Candidates</h4>
            <p className="text-sm text-muted-foreground">
              Apply filters to narrow down your candidate search.
            </p>
          </div>

          {/* Match Score Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Match Score Range (%)</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                min="0"
                max="100"
                value={localFilters.matchScoreMin || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    matchScoreMin: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="w-20"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <Input
                type="number"
                placeholder="Max"
                min="0"
                max="100"
                value={localFilters.matchScoreMax || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    matchScoreMax: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="w-20"
              />
            </div>
          </div>

          {/* Summary Matched */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Summary Matched</Label>
            <Select
              value={
                localFilters.summaryMatched === null
                  ? "all"
                  : localFilters.summaryMatched
                  ? "yes"
                  : "no"
              }
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  summaryMatched: value === "all" ? null : value === "yes",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Title */}
          {/* <div className="space-y-2">
            <Label className="text-sm font-medium">Job Title</Label>
            <Input
              placeholder="Enter job title..."
              value={localFilters.title}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  title: e.target.value,
                })
              }
            />
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex-1 bg-transparent"
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 bg-card-box"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
