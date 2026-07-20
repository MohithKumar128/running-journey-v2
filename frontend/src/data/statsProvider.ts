import type { Stats } from "./types";

export const API_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:5000"
    : "https://running-journey-v2.onrender.com";

export async function getStats(): Promise<Stats> {
  const response = await fetch(`${API_URL}/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return await response.json();
}

