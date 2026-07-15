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

export interface Summary {
  totalActivities: number;
  runningActivities: number;
  cyclingActivities: number;
  walkingActivities: number;
  hikingActivities: number;
  trailRunningActivities: number;

  totalDistance: number;
  runningDistance: number;
  cyclingDistance: number;
  walkingDistance: number;
  hikingDistance: number;
  trailRunningDistance: number;

  totalTime: number;
  averagePace: number;
  totalElevation: number;
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