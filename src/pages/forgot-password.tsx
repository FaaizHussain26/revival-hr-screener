import React from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  ForgotPasswordData,
  forgotPasswordSchema,
} from "@/utils/validations/forget-password-schema";
import { toast } from "sonner";
import { useForgotPassword } from "@/api/hooks/useForgetPassword";

export const ForgotPassword: React.FC = () => {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });


  const {mutate, isPending} = useForgotPassword();
  const onSubmit = async (data: ForgotPasswordData) => {
   mutate(data, {
      onSuccess: (res) => {
        toast(res.message, {
        });
      },
      onError: (error: any) => {
       const apiErrorMessage =
      error.response?.data?.message || "Something went wrong. Try again.";
      toast("Error Occur", {
          description:apiErrorMessage,
        });

      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-sm bg-card-back">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-center">
            A code will be sent to your email to help reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-6 bg-card-box cursor-pointer"
                 disabled={isPending}
            >
              {isPending ? "Send Mail..." : "Send Mail"}
              
                
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center">
          <div className="text-center text-sm text-muted-foreground">
            {"Back to "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
