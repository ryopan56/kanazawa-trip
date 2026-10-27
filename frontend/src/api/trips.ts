import type { Trip, CreateTrip } from "../types/trip";
import { requestJson } from "./client";

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
