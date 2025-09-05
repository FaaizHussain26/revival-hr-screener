"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save } from "lucide-react";

import { useDebounce } from "use-debounce";
import { useCreateJob } from "@/api/hooks/job-module/useJobs";
import { useCreateSkill, useSkills } from "@/api/hooks/job-module/useSkills";

const addJobSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employment_type: z.enum(["full-time", "part-time", "contract", "intern"], {
    required_error: "Employment type is required",
  }),
  experience_level: z.enum(
    ["entry level", "mid level", "senior level", "executive"],
    {
      required_error: "Experience level is required",
    }
  ),
  salary: z.string().optional(),
  description: z
    .string()
    .min(20, "Job description must be at least 20 characters"),
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters"),
  responsibilities: z
    .string()
    .min(10, "Responsibilities must be at least 10 characters"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
});

export type AddJobFormData = z.infer<typeof addJobSchema>;

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AddJobFormData>;
}

export const CreateJobModal = ({
  isOpen,
  onClose,
  initialData = {},
}: CreateJobModalProps) => {
  const form = useForm<AddJobFormData>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
      title: initialData.title || "",
      department: initialData.department || "",
      location: initialData.location || "",
      employment_type: initialData.employment_type ?? undefined,
      experience_level: initialData.experience_level ?? undefined,
      salary: initialData.salary || "",
      description: initialData.description || "",
      requirements: initialData.requirements || "",
      responsibilities: initialData.responsibilities || "",
      skills: initialData.skills || [],
    },
  });

  const [skillInput, setSkillInput] = useState("");
  const skills = form.watch("skills");

  // Hooks
  const createJobMutation = useCreateJob();
  const createSkillMutation = useCreateSkill();
  const [debouncedSkillInput] = useDebounce(skillInput, 300);
  const { data: suggestedSkills = [] } = useSkills(debouncedSkillInput ?? "");

  // Filter out already selected skills
  const filteredSuggestions = suggestedSkills.filter(
    (skill) => !skills.includes(skill.name)
  );

  const handleAddSkill = async (value: string) => {
    const skill = value.trim();
    if (!skill || skills.includes(skill)) return;

    // Check if skill exists in suggestions
    const existingSkill = suggestedSkills.find(
      (s) => s.name.toLowerCase() === skill.toLowerCase()
    );

    if (!existingSkill) {
      // Create new skill
      try {
        await createSkillMutation.mutateAsync(skill);
      } catch (error) {
        console.error("Failed to create skill:", error);
        return;
      }
    }

    form.setValue("skills", [...skills, skill], {
      shouldValidate: true,
    });
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    form.setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: AddJobFormData) => {
    try {
      const payload = {
        ...data,
        salary: data.salary ?? "",
      };
      await createJobMutation.mutateAsync(payload);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSkillInput("");
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <FormField<AddJobFormData>
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField<AddJobFormData>
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<AddJobFormData>
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField<AddJobFormData>
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        typeof field.value === "string"
                          ? field.value
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<AddJobFormData>
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        typeof field.value === "string"
                          ? field.value
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entry level">Entry Level</SelectItem>
                        <SelectItem value="mid level">Mid Level</SelectItem>
                        <SelectItem value="senior level">
                          Senior Level
                        </SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField<AddJobFormData>
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="$90,000 - $120,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job Description */}
            <FormField<AddJobFormData>
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a comprehensive description of the role..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<AddJobFormData>
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the essential qualifications and requirements..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<AddJobFormData>
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Required Skills</FormLabel>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center outline-1 text-black rounded-full px-3 py-1 text-sm font-medium shadow-sm bg-secondary"
                        >
                          {skill}
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-black focus:outline-none"
                            onClick={() => handleRemoveSkill(skill)}
                            aria-label={`Remove ${skill}`}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="List technical and soft skills (comma-separated)..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            await handleAddSkill(skillInput);
                          }
                        }}
                        className="pr-24"
                        autoComplete="off"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded-sm"
                        onClick={async () => await handleAddSkill(skillInput)}
                        disabled={!skillInput.trim()}
                      >
                        Add
                      </Button>
                      {filteredSuggestions.length > 0 && skillInput.trim() && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-auto">
                          {filteredSuggestions.map((s) => (
                            <div
                              key={s.name}
                              className="px-4 py-2 cursor-pointer hover:bg-orange-50"
                              onClick={async () => await handleAddSkill(s.name)}
                            >
                              {s.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<AddJobFormData>
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the main duties and responsibilities..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createJobMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-card-box hover:bg-blue-700"
                type="submit"
                disabled={createJobMutation.isPending}
              >
                {createJobMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full mr-2 border-b-transparent " />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 " />
                    Create Job
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
