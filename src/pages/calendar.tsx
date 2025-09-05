"use client";

import type React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  useCreateInterview,
  useGetTodaysInterviews,
  useInterviews,
} from "@/api/hooks/useCalender";
import { useShortListedCandidates } from "@/api/hooks/useShortListedCandidates";
import type {
  CreateInterviewData,
  Interview,
} from "@/api/requests/calender-api";
import { UpdateInterviewForm } from "@/components/calender/update-interview-form";
import DashboardCard from "@/components/dashboard/dashboard-card";
import type { ShortListedCandidate } from "@/components/shortlist-candidates/shortlisted-candidates-page";
import {
  Calendar,
  CalendarXIcon as Calendar1Icon,
  Clock,
  Clock1,
  Edit,
  ExternalLink,
  MapPin,
  Plus,
  User,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { TodaysScheduleCard } from "@/components/calender/today-schedule-card";

const interviewSchema = z.object({
  candidate: z.string().min(1, "Please select a candidate"),
  scheduledAt: z.string().min(1, "Please select date and time"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  type: z.enum(["hr", "clinical", "administration/leadership"]),
  interviewer: z
    .string()
    .min(1, "Please enter interviewer email(s)")
    .refine((val) => {
      const emails = val.split(",").map((email) => email.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emails.every((email) => emailRegex.test(email));
    }, "Please enter valid email address(es), separated by commas"),
  location: z.string().min(1, "Please enter location"),
  notes: z.string().optional(),
});

const interviewTypes = [
  { value: "hr", label: "HR Interview" },
  { value: "clinical", label: "Clinical Interview" },
  { value: "administration/leadership", label: "Final Interview" },
];

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rescheduled: "bg-yellow-100 text-yellow-700",
};

export default function CalendarPage() {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [interviewToUpdate, setInterviewToUpdate] = useState<Interview | null>(
    null
  );

  const { data: shortlistData } = useShortListedCandidates({});
  const shortlistCandidates: ShortListedCandidate[] = shortlistData?.data || [];

  const { data: interviewsResponse, isLoading: interviewsLoading } =
    useInterviews();
  const interviews = interviewsResponse?.data || [];

  const { data: todaysInterviewsResponse, isLoading: todaysInterviewsLoading } =
    useGetTodaysInterviews();
  const todaysGetInterviews = todaysInterviewsResponse?.data || [];

  const createInterviewMutation = useCreateInterview();

  const form = useForm<z.infer<typeof interviewSchema>>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      candidate: "",
      scheduledAt: "",
      duration: 60,
      type: "hr",
      interviewer: "",
      location: "",
      notes: "",
    },
  });

  const upcomingInterviews = interviews
    .filter((interview) => {
      const interviewDate = new Date(interview.scheduledAt);
      return (
        interviewDate >= new Date() &&
        interviewDate <=
          new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    })
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

  const todaysInterviews = todaysGetInterviews.filter((interview) => {
    const interviewDate = new Date(interview.scheduledAt);
    return interviewDate.toDateString() === new Date().toDateString();
  });

  const cardData = {
    stats: [
      {
        title: "Today's Interviews",
        value: todaysInterviews.length,
        icon: Calendar1Icon,
      },
      {
        title: "This Week",
        value: upcomingInterviews.length || 0,
        icon: Clock1,
      },
      {
        title: "Total Scheduled",
        value: interviews.filter((i) => i.status === "scheduled").length,
        icon: User,
      },
    ],
  };

  const onSubmit = async (data: z.infer<typeof interviewSchema>) => {
    try {
      const interviewerEmails = data.interviewer
        .split(",")
        .map((email) => email.trim());

      const interviewData: CreateInterviewData = {
        candidate: data.candidate,
        scheduledAt: data.scheduledAt,
        duration: data.duration,
        type: data.type,
        interviewer: interviewerEmails,
        location: data.location,
        status: "rescheduled",
        notes: data.notes,
      };

      await createInterviewMutation.mutateAsync(interviewData);
      form.reset();
      setShowScheduleForm(false);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to schedule interview";
      toast.error(message);
    }
  };

  const handleUpdateClick = (interview: Interview, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click
    setInterviewToUpdate(interview);
    setShowUpdateForm(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateForm(false);
    setInterviewToUpdate(null);
    toast.success("Interview updated successfully");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interview Calendar</h1>
          <p className="text-muted-foreground">
            Manage and track all your interview schedules with Outlook
            integration
          </p>
        </div>
        <Button
          onClick={() => setShowScheduleForm(true)}
          className="bg-card-box hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cardData.stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-ms-neutral-600">
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interviewsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-ms-neutral-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview._id}
                      className="border border-ms-neutral-200 rounded-lg p-4 hover:bg-ms-neutral-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedInterview(interview)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gray-100">
                              {getInitials(interview.candidate.applicant_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-ms-neutral-600">
                              {interview.candidate.applicant_name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={
                              statusColors[
                                interview.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {interview.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleUpdateClick(interview, e)}
                            className="text-ms-blue hover:bg-ms-blue hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-ms-neutral-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(interview.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-ms-neutral-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(interview.scheduledAt).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center text-ms-neutral-500">
                          <User className="h-4 w-4 mr-2" />
                          {Array.isArray(interview.interviewer)
                            ? interview.interviewer.join(", ")
                            : interview.interviewer}
                        </div>
                        <div className="flex items-center text-ms-neutral-500">
                          {interview.location?.includes("http") ? (
                            <Video className="h-4 w-4 mr-2" />
                          ) : (
                            <MapPin className="h-4 w-4 mr-2" />
                          )}
                          {interview.location || "TBD"}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {interview.type.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-ms-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-ms-neutral-600 mb-2">
                    No upcoming interviews
                  </h3>
                  <p className="text-sm text-ms-neutral-400 mb-4">
                    Schedule your first interview to get started.
                  </p>
                  <Button
                    onClick={() => setShowScheduleForm(true)}
                    className="bg-ms-blue hover:bg-ms-blue-dark text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TodaysScheduleCard
            todaysInterviews={todaysInterviews}
            todaysInterviewsLoading={todaysInterviewsLoading}
            getCandidateName={(candidate: { applicant_name: string }) =>
              candidate.applicant_name
            }
            handleUpdateClick={handleUpdateClick}
          />
        </div>
      </div>

      <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="candidate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select candidate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shortlistCandidates.map(
                          (candidate: ShortListedCandidate) => (
                            <SelectItem
                              key={candidate._id}
                              value={candidate._id}
                            >
                              {candidate.applicant_name} -{" "}
                              {candidate.job_applied_for}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
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

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interviewTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer(s)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter interviewer email(s), separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Meeting room or video link"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes for the interview"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowScheduleForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createInterviewMutation.isPending}
                  className="bg-card-box hover:bg-blue-600 text-white"
                >
                  {createInterviewMutation.isPending
                    ? "Scheduling..."
                    : "Schedule Interview"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpdateForm} onOpenChange={setShowUpdateForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Update Interview
            </DialogTitle>
          </DialogHeader>
          {interviewToUpdate && (
            <UpdateInterviewForm
              interview={interviewToUpdate}
              key={interviewToUpdate._id}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setShowUpdateForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedInterview && (
        <Dialog
          open={!!selectedInterview}
          onOpenChange={() => setSelectedInterview(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Interview Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 ">
                  <AvatarFallback className="bg-gray-200">
                    {getInitials(selectedInterview.candidate.applicant_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-ms-neutral-600">
                    {selectedInterview.candidate.applicant_name}
                  </h3>

                  <Badge
                    variant="default"
                    className={
                      statusColors[
                        selectedInterview.status as keyof typeof statusColors
                      ]
                    }
                  >
                    {selectedInterview.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-ms-neutral-600 mb-2">
                    Interview Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-ms-neutral-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(
                        selectedInterview.scheduledAt
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-ms-neutral-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(
                        selectedInterview.scheduledAt
                      ).toLocaleTimeString()}{" "}
                      ({selectedInterview.duration} min)
                    </div>
                    <div className="flex items-center text-ms-neutral-500">
                      <User className="h-4 w-4 mr-2" />
                      {Array.isArray(selectedInterview.interviewer)
                        ? selectedInterview.interviewer.join(", ")
                        : selectedInterview.interviewer}
                    </div>
                    <div className="flex items-center text-ms-neutral-500">
                      {selectedInterview.location?.includes("http") ? (
                        <Video className="h-4 w-4 mr-2" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      {selectedInterview.location || "TBD"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-ms-neutral-600 mb-2">
                    Type & Status
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="capitalize">
                      {selectedInterview.type.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedInterview.notes && (
                <div>
                  <h4 className="font-medium text-ms-neutral-600 mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-ms-neutral-500 bg-ms-neutral-100 p-3 rounded-lg">
                    {selectedInterview.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInterview(null)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInterviewToUpdate(selectedInterview);
                    setShowUpdateForm(true);
                    setSelectedInterview(null);
                  }}
                  className="text-ms-blue hover:bg-ms-blue hover:transition-colors hover:text-gray-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Update Interview
                </Button>
                {selectedInterview.eventId && (
                  <Button className="bg-ms-blue hover:bg-ms-blue-dark text-white">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open in Outlook
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
