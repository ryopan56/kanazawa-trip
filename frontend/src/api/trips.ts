import type { Trip, CreateTrip, UpdateTrip } from "../types/trip";
import { requestJson, requestNoContent } from "./client";

export async function getTrips(): Promise<Trip[]> {
  return requestJson<Trip[]>("/api/trips");
}

export async function createTrip(tripData: CreateTrip): Promise<Trip> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  };
  return requestJson<Trip>("/api/trips", options);
}

export async function updateTrip(
  tripId: number,
  tripData: UpdateTrip,
): Promise<Trip> {
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  };
  return requestJson<Trip>(`/api/trips/${tripId}`, options);
}

export async function deleteTrip(tripId: number): Promise<void> {
  const options: RequestInit = {
    method: "DELETE",
  };
  return requestNoContent(`/api/trips/${tripId}`, options);
}
