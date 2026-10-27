import { useEffect, useState } from "react";
import type { Trip, CreateTrip } from "../types/trip";
import { createTrip, getTrips } from "../api/trips";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "作成中..." : "作成"}
    </button>
  );
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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

  async function handleFormAction(formData: FormData) {
    setCreateError(null);

    const rawData = Object.fromEntries(formData.entries());

    const newTrip: CreateTrip = {
      name: String(rawData.name),
      start_date: String(rawData.start_date),
      end_date: String(rawData.end_date),
    };

    try {
      await createTrip(newTrip);
    } catch (errorMessage) {
      console.log(errorMessage);
      setCreateError("旅行を追加できませんでした");
      return;
    }

    try {
      const data: Trip[] = await getTrips();
      setTrips(data);
      setCreateOpen(false);
    } catch (errorMessage) {
      console.error(errorMessage);
      setCreateError(
        "旅行を追加しましたが、旅行一覧を取得できませんでした。再度旅行を作成せず、ページを再読み込みしてください。",
      );
    }
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

      <button
        onClick={() => {
          setCreateOpen(!isCreateOpen);
        }}
      >
        新規旅行
      </button>

      {isCreateOpen && (
        <form action={handleFormAction}>
          <div>
            <label>
              旅行名：
              <input
                type="text"
                name="name"
                placeholder="旅行名を入力"
                required
              />
            </label>
          </div>

          <div>
            <label>
              旅行開始日：
              <input type="date" name="start_date" required />
            </label>
          </div>

          <div>
            <label>
              旅行終了日：
              <input type="date" name="end_date" required />
            </label>
          </div>
          <div>
            {createError && <p style={{ color: "red" }}>{createError}</p>}
          </div>
          <SubmitButton />
        </form>
      )}
    </>
  );
}
