import type { Trip } from "../types/trip";
import { getJson } from "./client";

export async function getTrips(): Promise<Trip[]> {
  return getJson<Trip[]>("/api/trips");
}
