"use client";

import * as React from "react";
import { X, PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateSkill, useSkills } from "@/api/hooks/job-module/useSkills";
import { Skill } from "@/api/requests/job-module-api";

export default function SkillManager() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSkills, setSelectedSkills] = React.useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = React.useState("");
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = React.useState(false);

  const { data: availableSkills, isLoading: isLoadingSkills } =
    useSkills(searchQuery);
  const createSkillMutation = useCreateSkill();
  // const deleteSkillMutation = useDeleteSkill();

  const handleSelectSkill = (skill: Skill) => {
    if (!selectedSkills.some((s) => s._id === skill._id)) {
      setSelectedSkills((prev) => [...prev, skill]);
      setSearchQuery(""); // Clear search after selection
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s._id !== skillId));
    // Optionally, you can call the delete API here if removing from selected list means deleting from DB
    // For a LinkedIn-like experience, removing from selected list usually doesn't delete from DB.
    // If you want to delete from DB, uncomment the line below and adjust logic.
    // deleteSkillMutation.mutate(skillId);
  };

  const handleCreateNewSkill = async () => {
    if (!newSkillName.trim()) {
      toast.error("Skill name cannot be empty.");
      return;
    }
    try {
      await createSkillMutation.mutateAsync(newSkillName.trim());
      // After successful creation, add it to selected skills and close dialog
      // Invalidate queries to refetch the list including the new skill
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setIsAddSkillDialogOpen(false);
      setNewSkillName("");
      toast.success("Skill added successfully!");
    } catch (error) {
      // Error handling is already in useCreateSkill hook
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    // If the user types something that doesn't exist, open the dialog to add it
    if (
      value.trim() &&
      !availableSkills?.some(
        (s) => s.name.toLowerCase() === value.toLowerCase()
      )
    ) {
      setNewSkillName(value.trim());
    } else {
      setNewSkillName("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Manage Skills</h2>

      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] border rounded-md p-2">
        {selectedSkills.length === 0 && (
          <span className="text-muted-foreground text-sm">
            No skills selected.
          </span>
        )}
        {selectedSkills.map((skill) => (
          <Badge key={skill._id} className="flex items-center gap-1 pr-1">
            {skill.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 rounded-full hover:bg-accent"
              onClick={() => handleRemoveSkill(skill._id)}
              aria-label={`Remove ${skill.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search for skills or add new ones..."
          value={searchQuery}
          onValueChange={handleSearchInputChange}
        />
        <CommandList>
          {isLoadingSkills && <CommandEmpty>Loading skills...</CommandEmpty>}
          {!isLoadingSkills &&
            availableSkills?.length === 0 &&
            searchQuery.trim() !== "" && (
              <CommandEmpty>
                No skills found for "{searchQuery}".
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => {
                    setNewSkillName(searchQuery.trim());
                    setIsAddSkillDialogOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add "{searchQuery}" as
                  a new skill
                </Button>
              </CommandEmpty>
            )}
          {!isLoadingSkills &&
            availableSkills?.length === 0 &&
            searchQuery.trim() === "" && (
              <CommandEmpty>Start typing to search for skills.</CommandEmpty>
            )}
          <CommandGroup heading="Available Skills">
            {availableSkills?.map((skill) => (
              <CommandItem
                key={skill._id}
                value={skill.name}
                onSelect={() => handleSelectSkill(skill)}
              >
                {skill.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>

      <Dialog
        open={isAddSkillDialogOpen}
        onOpenChange={setIsAddSkillDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Enter the name of the new skill you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newSkill" className="text-right">
                Skill Name
              </Label>
              <Input
                id="newSkill"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., React.js"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateNewSkill}
              disabled={createSkillMutation.isPending || !newSkillName.trim()}
            >
              {createSkillMutation.isPending ? "Adding..." : "Add Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
