// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

// Create a React Query client
export const queryClient = new QueryClient();

// -------------------- API Request Helper --------------------
export async function apiRequest(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  // Return parsed JSON if possible
  return res.json().catch(() => ({}));
}


