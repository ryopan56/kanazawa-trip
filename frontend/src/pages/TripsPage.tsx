import { useEffect, useState } from "react";
import type { Trip, CreateTrip, UpdateTrip } from "../types/trip";
import { createTrip, getTrips, updateTrip } from "../api/trips";
import { useFormStatus } from "react-dom";

function PostSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "作成中..." : "作成"}
    </button>
  );
}

function PatchSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "更新中..." : "更新"}
    </button>
  );
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

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

  async function handleUpdateAction(formData: FormData) {
    setUpdateError(null);
    if (!editingTrip) return;

    const rawData = Object.fromEntries(formData.entries());

    const updateData: UpdateTrip = {
      name: String(rawData.name),
      start_date: String(rawData.start_date),
      end_date: String(rawData.end_date),
    };

    try {
      await updateTrip(editingTrip.id, updateData);
    } catch (errorMessage) {
      console.log(errorMessage);
      setUpdateError("旅行を編集できませんでした");
      return;
    }

    try {
      const data: Trip[] = await getTrips();
      setTrips(data);
      setEditingTrip(null);
    } catch (errorMessage) {
      console.error(errorMessage);
      setUpdateError(
        "旅行を編集しましたが、旅行一覧を取得できませんでした。再度更新せず、ページを再読み込みしてください。",
      );
    }
  }

  return (
    <>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            {trip.name}:{trip.start_date} ~ {trip.end_date}
            <button
              type="button"
              onClick={() => {
                setEditingTrip(trip);
                setUpdateError(null);
                setCreateOpen(false);
              }}
            >
              編集
            </button>
          </li>
        ))}
      </ul>

      {editingTrip && (
        <form action={handleUpdateAction} key={editingTrip.id}>
          <div>
            <h3>旅行を編集する</h3>
          </div>
          <div>
            <label>
              旅行名：
              <input
                type="text"
                name="name"
                defaultValue={editingTrip.name}
                required
              />
            </label>
          </div>

          <div>
            <label>
              旅行開始日：
              <input
                type="date"
                name="start_date"
                defaultValue={editingTrip.start_date}
                required
              />
            </label>
          </div>

          <div>
            <label>
              旅行終了日：
              <input
                type="date"
                name="end_date"
                defaultValue={editingTrip.end_date}
                required
              />
            </label>
          </div>
          <div>
            <div>
              {updateError && <p style={{ color: "red" }}>{updateError}</p>}
            </div>
            <PatchSubmitButton />
            <button
              type="button"
              onClick={() => {
                setEditingTrip(null);
              }}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      <button
        type="button"
        onClick={() => {
          setCreateOpen(!isCreateOpen);
          setCreateError(null);
          setEditingTrip(null);
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
          <PostSubmitButton />
        </form>
      )}
    </>
  );
}
