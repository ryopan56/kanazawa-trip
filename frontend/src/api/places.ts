import type { CreatePlace, Place, UpdatePlace } from "../types/place";
import { requestJson, requestNoContent } from "./client";

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

export async function updatePlace(
  tripId: number,
  placeId: number,
  placeData: UpdatePlace,
): Promise<Place> {
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(placeData),
  };
  return requestJson<Place>(`/api/trips/${tripId}/places/${placeId}`, options);
}

export async function deletePlace(
  tripId: number,
  placeId: number,
): Promise<void> {
  const options: RequestInit = {
    method: "DELETE",
  };
  return requestNoContent(`/api/trips/${tripId}/places/${placeId}`, options);
}
