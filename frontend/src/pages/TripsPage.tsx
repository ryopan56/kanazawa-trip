import { useEffect, useState } from "react";
import type { Trip } from "../types/trip";
import { getTrips } from "../api/trips";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        const data: Trip[] = await getTrips();
        setTrips(data);
      } catch (errorMessage) {
        console.error(errorMessage);
        setError("旅行一覧を取得できませんでした");
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, []);

  if (loading) {
    return <p>読み込み中</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            {trip.name}:{trip.start_date} ~ {trip.end_date}
          </li>
        ))}
      </ul>
    </>
  );
}
