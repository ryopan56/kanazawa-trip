import type { CreatePlace, Place } from "../types/place";
import { requestJson } from "./client";

export async function getPlaces(tripId: number): Promise<Place[]> {
  return requestJson<Place[]>(`/api/trips/${tripId}/places`);
}

export async function createPlace(
  tripId: number,
  placeData: CreatePlace,
): Promise<Place> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(placeData),
  };
  return requestJson<Place>(`/api/trips/${tripId}/places`, options);
}
