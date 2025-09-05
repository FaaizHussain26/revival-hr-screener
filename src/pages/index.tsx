import { DashboardLayout } from "@/components/dashboard-layout";
import AuthMiddleware from "@/components/middleware/auth-middleware";
import GuestMiddleware from "@/components/middleware/guest-middleware";
import { Route, Routes } from "react-router";

import { ForgotPassword } from "./forgot-password";
import LoginPage from "./login";
import RegisterPage from "./register";
import { ResetPassword } from "./reset-password";
import { SettingsPage } from "./settings";
import JobModule from "./job-module";
import { UsersPage } from "./users";
import ShorlistCandidates from "./shortlisted-candidates";
import Dashboard from "./dashboard";
import { ResumeAnalyzer } from "./resume-analyzer";
import ResumeAnalysisPage from "./resume-analysis-page";
import Pipeline from "./pipeline";
import CalendarPage from "./calendar";

export default function Main() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestMiddleware>
            <LoginPage />
          </GuestMiddleware>
        }
      />
      <Route
        path="login"
        element={
          <GuestMiddleware>
            <LoginPage />
          </GuestMiddleware>
        }
      />
      <Route
        path="forgot-password"
        element={
          <GuestMiddleware>
            <ForgotPassword />
          </GuestMiddleware>
        }
      />
      <Route
        path="reset-password"
        element={
          <GuestMiddleware>
            <ResetPassword />
          </GuestMiddleware>
        }
      />
      <Route
        path="register"
        element={
          <GuestMiddleware>
            <RegisterPage />
          </GuestMiddleware>
        }
      />
      <Route
        path="dashboard"
        element={
          <AuthMiddleware>
            <DashboardLayout />
          </AuthMiddleware>
        }
      >
        <Route
          path="home"
          element={
            <AuthMiddleware>
              <Dashboard />
            </AuthMiddleware>
          }
        />
        <Route path="shortlist-candidates" element={<ShorlistCandidates />} />
        <Route path="job-module" element={<JobModule />} />
        <Route
          path="resume-analyzer"
          element={<ResumeAnalyzer hasDescription />}
        />
        <Route path="resume-analysis" element={<ResumeAnalysisPage />} />
        <Route path="hiring-pipeline" element={<Pipeline />} />
        <Route path="interview-calendar" element={<CalendarPage />} />

        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
