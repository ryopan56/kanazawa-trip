import type { Activity } from "../types/activity";
import { requestJson } from "./client";

export async function getActivities(tripId: number): Promise<Activity[]> {
  return requestJson<Activity[]>(`/api/trips/${tripId}/activities`);
}
