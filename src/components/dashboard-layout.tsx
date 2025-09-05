import { Outlet, useLocation, useNavigate } from "react-router";
import {
  Settings,
  Users,
  BarChart3,
  ChevronDown,
  Briefcase,
  FileText,
  LogOut,
  File,
  Calendar,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCallback } from "react";
import { dashboardLayout } from "@/utils/Content-Data/dashboard-layout-data";
import useAuth from "@/hooks/useAuth";

export function DashboardLayout() {
  const { user } = useAuth();

  const data = {
    user: {
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    navMain: [
      {
        title: dashboardLayout.sideBar.sideBarOne,
        url: "/dashboard/home",
        icon: BarChart3,
      },
      {
        title: dashboardLayout.sideBar.sideBarTwo,
        url: "/dashboard/shortlist-candidates",
        icon: Users,
      },
      {
        title: dashboardLayout.sideBar.sideBarSix,
        url: "/dashboard/job-module",
        icon: Briefcase,
      },
      {
        title: dashboardLayout.sideBar.sideBarSeven,
        url: "/dashboard/resume-analyzer",
        icon: FileText,
      },
      {
        title: dashboardLayout.sideBar.sideBarEight,
        url: "/dashboard/hiring-pipeline",
        icon: File,
      },
      {
        title: dashboardLayout.sideBar.sideBarNine,
        url: "/dashboard/interview-calendar",
        icon: Calendar,
      },

      {
        title: dashboardLayout.sideBar.sideBarFour,
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: dashboardLayout.sideBar.sideBarFive,
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  };
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(url);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/agents/create")) return "Create AI Agent";
    if (path.startsWith("/agents/") && path !== "/shortlist-candidates")
      return "Aplicant Details";
    if (path.startsWith("/shortlist-candidates")) return "Applicants";
    if (path.startsWith("/analytics")) return "Analytics";
    if (path.startsWith("/users")) return "Users";
    if (path.startsWith("/settings")) return "Settings";
    return (
      <>
        Welcome <span className="font-bold">{user?.firstName || ""}</span>
      </>
    );
  };

  const handleLogout = useCallback(() => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  function getInitials(name: string): string {
    if (!name) return "";
    const [firstName = "", lastName = ""] = name.trim().split(" ");
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="flex flex-col items-center justify-center bg-transparent border-none shadow-none cursor-pointer hover:bg-transparent hover:shadow-none active:bg-transparent"
                asChild
              >
                <div
                  className="flex flex-col items-center justify-center rounded-2xl bg-white shadow-lg py-6 px-2 mt-4 mb-1 mx-auto w-full active:bg-transparent transition-colors cursor-pointer"
                  onClick={() => handleNavigation("/dashboard/home")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleNavigation("/dashboard");
                  }}
                >
                  <img
                    src={dashboardLayout.image}
                    alt="DAX Logo"
                    className="object-contain w-22 h-22 max-w-full max-h-32 mx-auto"
                  />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <button
                        onClick={() => handleNavigation(item.url)}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem></SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-18 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-sidebar-accent-foreground rounded-full flex items-center"></div>
              <div className="bg-sidebar-accent-foreground rounded-full flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-sidebar-accent-active px-2 py-1 bg-transparent"
                    >
                      <Avatar className="h-10 w-10 rounded-full ">
                        <AvatarImage
                          src={data.user.avatar || "/placeholder.svg"}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg bg-card-box text-white">
                          {getInitials(data.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                      <ChevronDown className="ml-2 size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="rounded-lg">
                            {getInitials(data.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {data.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {data.user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => handleNavigation("/dashboard/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-black"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        <Separator orientation="horizontal" className="mb-4 h-4" />
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
