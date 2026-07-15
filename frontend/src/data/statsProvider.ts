import type { Stats } from "./types";

const API_URL = "https://running-journey-v2.onrender.com";

export async function getStats(): Promise<Stats> {
  const response = await fetch(`${API_URL}/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return await response.json();
}
