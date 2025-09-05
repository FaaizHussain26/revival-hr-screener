"use client";

import { useUpdateProfile } from "@/api/hooks/useUpdateProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Home,
  Lock,
  Mail,
  Phone,
  Save,
  Settings,
  // Camera,
  // Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { UpdatePasswordForm } from "./update-password-form";

// Zod validation schema
const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phoneNumber: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  address: z.string(),
  isActive: z.boolean(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfilePageProps {
  initialData?: Partial<ProfileFormData & { profileImage?: string }>;
}

const sidebarItems = [
  {
    id: "profile",
    label: "My Profile",
    icon: User,
  },
  {
    id: "password",
    label: "Update Password",
    icon: Lock,
  },
];

export function ProfilePage({ initialData }: ProfilePageProps) {
  // const [profileImage, setProfileImage] = useState<string | null>(
  //   initialData?.profileImage || null
  // );
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      address: initialData?.address || "",
      isActive: initialData?.isActive ?? false,
    },
  });

  const { mutate, isPending } = useUpdateProfile();

  const onSubmit = async (data: ProfileFormData) => {
    mutate(data, {
      onSuccess: (res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = res as any;
        console.log(result);
        toast(result.message, {});

        if (result.token) {
          localStorage.setItem("token", result.data.token);
        }
        if (result.refreshToken) {
          localStorage.setItem("refreshToken", result.refreshToken);
        }

        localStorage.setItem(
          "user",
          JSON.stringify(result.data.user || result)
        );
        form.reset();
        window.location.reload();
      },
      onError: () => {
        toast("Error Occur", {
          description: "Something went wrong. Try again.",
        });
      },
    });
  };
  const renderProfileContent = () => (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Enter your first name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Enter your last name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          disabled
                          type="email"
                          placeholder="Enter your email address"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="tel"
                          placeholder="Enter your Address"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Status
                      </FormLabel>
                      <p className="text-xs text-gray-500">
                        Toggle to set as Active or Inactive
                      </p>
                    </div>
                    <FormControl>
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          field.value ? "bg-green-500" : "bg-gray-300"
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            field.value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-card-box hover:bg-blue-700"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 " />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  const renderPasswordContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Update Password</CardTitle>
        <p className="text-sm text-gray-600">
          Update your password to keep your account secure
        </p>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-1 gap-6 p-5 bg-white rounded-lg h-full p ">
      {/* Left Sidebar */}
      <div className="w-70 shadow-none ">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setActiveTab(item.id as "profile" | "password")
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-50 text-card-box border-r-2 border-card-box"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "profile" ? "My Profile" : "Update Password"}
          </h1>
          <p className="text-gray-600">
            {activeTab === "profile"
              ? "Manage your personal information and profile settings"
              : "Update your password to keep your account secure"}
          </p>
        </div>

        {activeTab === "profile"
          ? renderProfileContent()
          : renderPasswordContent()}
      </div>
    </div>
  );
}
