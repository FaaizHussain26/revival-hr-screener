import { MoreHorizontal, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usersData } from "@/utils/Content-Data/users-data";
import { useUsers } from "@/api/hooks/useUsers";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import DashboardCard from "@/components/dashboard/dashboard-card";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
}

interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export function UsersPage() {
  const { data, isLoading, isError } = useUsers({} as UsersQueryParams);
  const users: User[] = data || [];
  console.log("Fetched users:", data);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Loading users...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-card-box">
        Failed to load users.
      </div>
    );
  }

  const cardData = {
    stats: [
      {
        title: usersData.cards.cardOne,
        value: users.length,
        icon: Users,
      },
      {
        title: usersData.cards.cardTwo,
        value: users.filter((u: User) => u.isActive).length,
        icon: Users,
      },
      {
        title: usersData.cards.cardThree,
        value: users.filter((u: User) => u.role === "admin").length,
        icon: Shield,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {usersData.heading}
          </h2>
          <p className="text-muted-foreground">{usersData.subHeading}</p>
        </div>
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

      <Card>
        <CardHeader>
          <CardTitle>{usersData.tableHeading}</CardTitle>
          <CardDescription>{usersData.tableSubheading}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{usersData.tableColumn.tableColumnOne}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnTwo}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnThree}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnFour}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnFive}</TableHead>
                <TableHead className="text-right">
                  {usersData.tableColumn.tableColumnSix}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? "active" : "inactive"}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {/* <Mail className="mr-2 h-4 w-4" /> */}
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
