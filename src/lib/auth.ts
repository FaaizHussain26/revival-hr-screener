// Simple admin authentication context and utilities
export interface User {
  id: string;
  email: string;
  role: "admin" | "user" | "moderator";
  firstName: string;
  lastName: string;
}

// Mock current user - in a real app, this would come from JWT/session
export const getCurrentUser = (): User | null => {
  // For demo purposes, return an admin user
  // In production, this would decode JWT token or check session
  return {
    id: "1",
    email: "john.doe@example.com",
    role: "admin",
    firstName: "John",
    lastName: "Doe",
  };
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin";
};

export const getAuthHeaders = (): Record<string, string> => {
  const user = getCurrentUser();
  return user?.role === "admin" ? { "x-admin-role": "admin" } : {};
};
