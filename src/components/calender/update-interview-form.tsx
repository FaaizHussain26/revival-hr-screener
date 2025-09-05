"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateInterview } from "@/api/hooks/useCalender";
import type {
  Interview,
  UpdateInterviewData,
} from "@/api/requests/calender-api";

import { toast } from "sonner";
import { FileText, MapPin, Users } from "lucide-react";

const updateInterviewSchema = z.object({
  scheduledAt: z.string().min(1, "Scheduled date and time is required"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  type: z.enum(["hr", "clinical", "administration/leadership"]),
  interviewer: z
    .array(z.string().email("Invalid email format"))
    .min(1, "At least one interviewer is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"]),
  notes: z.string().optional(),
});

type UpdateInterviewFormData = z.infer<typeof updateInterviewSchema>;

interface UpdateInterviewFormProps {
  interview: Interview;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateInterviewForm({
  interview,
  onSuccess,
  onCancel,
}: UpdateInterviewFormProps) {
  const [newInterviewerEmail, setNewInterviewerEmail] = useState("");
  const updateInterviewMutation = useUpdateInterview();

  const form = useForm<UpdateInterviewFormData>({
    resolver: zodResolver(updateInterviewSchema),
    defaultValues: {
      scheduledAt: interview.scheduledAt,
      duration: interview.duration,
      type: interview.type,
      interviewer: interview.interviewer,
      location: interview.location,
      status: interview.status,
      notes: interview.notes || "",
    },
  });

  const currentStatus = form.watch("status");
  // const scheduledDate = form.watch("scheduledAt");

  // Business logic for field enabling/disabling
  const isFieldDisabled = (fieldName: string) => {
    // If status is cancelled, disable all fields except status
    if (currentStatus === "cancelled" && fieldName !== "status") {
      return true;
    }

    if (currentStatus === "rescheduled") {
      return false;
    }

    // For all other statuses (scheduled, completed), allow most fields
    if (currentStatus === "scheduled" || currentStatus === "completed") {
      // Allow date/time, duration, interviewer, status, and notes for scheduled/completed
      const allowedFields = [
        "scheduledAt",
        "duration",
        "interviewer",
        "status",
        "notes",
        "location",
        "type",
      ];
      return !allowedFields.includes(fieldName);
    }

    // Default: allow all fields
    return false;
  };

  // Check if date is in the past

  const addInterviewer = () => {
    if (
      newInterviewerEmail &&
      !form.getValues("interviewer").includes(newInterviewerEmail)
    ) {
      const currentInterviewers = form.getValues("interviewer");
      form.setValue("interviewer", [
        ...currentInterviewers,
        newInterviewerEmail,
      ]);
      setNewInterviewerEmail("");
    }
  };

  const removeInterviewer = (email: string) => {
    const currentInterviewers = form.getValues("interviewer");
    form.setValue(
      "interviewer",
      currentInterviewers.filter((i) => i !== email)
    );
  };

  const onSubmit = async (data: UpdateInterviewFormData) => {
    try {
      const updateData: UpdateInterviewData = {
        scheduledAt: data.scheduledAt,
        duration: data.duration,
        type: data.type,
        interviewer: data.interviewer,
        location: data.location,
        status: data.status,
        notes: data.notes,
      };

      await updateInterviewMutation.mutateAsync({
        id: interview._id,
        data: updateData as Record<string, unknown>,
      });

      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update interview. Please try again.");
      console.error("Failed to update interview:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Status, Type, Date & Duration Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || interview.status}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interview Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || interview.type}
                      disabled={isFieldDisabled("type")}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hr">HR Interview</SelectItem>
                        <SelectItem value="clinical">
                          Clinical Interview
                        </SelectItem>
                        <SelectItem value="administration/leadership">
                          Final Interview
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Scheduled Date & Time */}
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={
                          field.value
                            ? field.value.slice(0, 16)
                            : interview.scheduledAt.slice(0, 16)
                        }
                        onChange={field.onChange}
                        min={new Date().toISOString().slice(0, 16)}
                        disabled={isFieldDisabled("scheduledAt")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        step="15"
                        value={field.value || interview.duration}
                        disabled={isFieldDisabled("duration")}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Interviewers */}
            <FormField
              control={form.control}
              name="interviewer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interviewers</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter interviewer email"
                        value={newInterviewerEmail}
                        onChange={(e) => setNewInterviewerEmail(e.target.value)}
                        disabled={isFieldDisabled("interviewer")}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInterviewer();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInterviewer}
                        disabled={isFieldDisabled("interviewer")}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((email) => (
                        <Badge
                          key={email}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Users className="h-3 w-3" />
                          {email}
                          {!isFieldDisabled("interviewer") && (
                            <button
                              type="button"
                              onClick={() => removeInterviewer(email)}
                              className="ml-1 text-xs hover:text-destructive"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g., Zoom, Google Meet, or Office Room A"
                        disabled={isFieldDisabled("location")}
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        placeholder="Additional notes about the interview..."
                        disabled={isFieldDisabled("notes")}
                        className="pl-10 min-h-[100px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={updateInterviewMutation.isPending}
                className="flex-1 bg-card-box hover:bg-blue-700"
              >
                {updateInterviewMutation.isPending
                  ? "Updating..."
                  : "Update Interview"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
