import type { Stats } from "./types";

const API_URL = "http://127.0.0.1:5000";

export async function getStats(): Promise<Stats> {
  const response = await fetch(`${API_URL}/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return await response.json();
}