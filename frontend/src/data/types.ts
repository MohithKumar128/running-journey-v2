export interface Activity {
  id: number;
  name: string;
  sport_type: string;
  distance_km: number;
  moving_time_min: number;
  elevation_gain: number;
  start_date: string;
  pace?: number;
}

export interface ActivitySummary {
  distance: number;
  activities: number;
  moving_time: number;
  formatted_time: string;
  avg_pace: string;
  elevation_gain: number;
  current_streak: number | null;
  longest_streak: number | null;
  average_weekly_distance: number | null;
  monthly_totals: Record<string, number> | null;
  yearly_totals: Record<string, number> | null;
  personal_records: Record<string, string> | null;
  achievements: any[] | null;
  latest_activity: any | null;
  ai_insights: string | null;
  recovery_score: number | null;
  training_load: number | null;
}

export interface OverallSummary {
  distance: number;
  activities: number;
}

export interface Summary {
  running: ActivitySummary;
  cycling: ActivitySummary;
  walking: ActivitySummary;
  hiking: ActivitySummary;
  trailRunning: ActivitySummary;
  overall: OverallSummary;
}

export interface Records {
  longestRun: Activity;
  fastestRun: Activity;
  highestElevationRun: Activity;
}

export interface Stats {
  summary: Summary;
  records: Records;
  monthlyDistance: Record<string, number>;
  weeklyDistance: Record<string, number>;
  activities: Activity[];
}