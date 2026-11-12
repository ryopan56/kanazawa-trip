import type { Place } from "../types/place";
import { requestJson } from "./client";

export async function getPlaces(tripId: number): Promise<Place[]> {
  return requestJson<Place[]>(`/api/trips/${tripId}/places`);
}
