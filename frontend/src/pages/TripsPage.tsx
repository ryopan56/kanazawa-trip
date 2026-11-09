import { useEffect, useState } from "react";
import type { Trip, CreateTrip, UpdateTrip } from "../types/trip";
import { createTrip, getTrips, updateTrip, deleteTrip } from "../api/trips";
import { useNavigate } from "react-router";
import { logoutUser } from "../api/auth";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CreateTrip>({
    name: "",
    start_date: "",
    end_date: "",
  });

  const [editTrip, setEditTrip] = useState<Trip | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<number | null>(null);

  const [isLogout, setIsLogout] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const isBusy =
    isCreating || isUpdating || isLogout || deletingTripId !== null;

  useEffect(() => {
    async function loadTrips() {
      try {
        const data: Trip[] = await getTrips();
        setTrips(data);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setError("旅行一覧を取得できませんでした");
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [navigate]);

  if (loading) {
    return <p>読み込み中</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  async function handleCreateSubmit() {
    setCreateError(null);
    setIsCreating(true);

    try {
      try {
        await createTrip(createForm);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setCreateError("旅行を追加できませんでした");
        return;
      }

      try {
        const data: Trip[] = await getTrips();
        setTrips(data);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setCreateError(
          "旅行を追加しましたが、旅行一覧を取得できませんでした。再度旅行を作成せず、ページを再読み込みしてください。",
        );
      } finally {
        setCreateOpen(false);
        setCreateForm({
          name: "",
          start_date: "",
          end_date: "",
        });
      }
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateSubmit() {
    setUpdateError(null);
    if (!editTrip) return;

    setIsUpdating(true);

    const updateData: UpdateTrip = {
      name: editTrip.name,
      start_date: editTrip.start_date,
      end_date: editTrip.end_date,
    };

    try {
      try {
        await updateTrip(editTrip.id, updateData);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setUpdateError("旅行を編集できませんでした");
        return;
      }

      try {
        const data: Trip[] = await getTrips();
        setTrips(data);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setUpdateError(
          "旅行を編集しましたが、旅行一覧を取得できませんでした。再度更新せず、ページを再読み込みしてください。",
        );
      } finally {
        setEditTrip(null);
      }
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(tripId: number) {
    setDeleteError(null);
    setDeletingTripId(tripId);

    try {
      try {
        await deleteTrip(tripId);
        if (tripId === editTrip?.id) {
          setEditTrip(null);
        }
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setDeleteError("旅行を削除できませんでした");
        return;
      }

      try {
        const data: Trip[] = await getTrips();
        setTrips(data);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setDeleteError(
          "指定の旅行を削除しましたが、旅行一覧を取得できませんでした。再度削除せず、ページを再読み込みしてください。",
        );
      }
    } finally {
      setDeletingTripId(null);
    }
  }

  async function handleLogout() {
    if (isLogout) return;
    setLogoutError(null);
    setIsLogout(true);

    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (errorMessage) {
      console.error(errorMessage);
      setLogoutError("ログアウトできませんでした");
    } finally {
      setIsLogout(false);
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
                setEditTrip({ ...trip });
                setUpdateError(null);
                setCreateOpen(false);
                setCreateError(null);
                setDeleteError(null);
              }}
              disabled={isBusy}
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => {
                const confirmed = window.confirm(
                  `${trip.name}を削除しますか？`,
                );
                if (confirmed) {
                  handleDelete(trip.id);
                }
              }}
              disabled={isBusy}
            >
              {deletingTripId === trip.id ? "削除中" : "削除"}
            </button>
          </li>
        ))}
      </ul>
      <div>{deleteError && <p style={{ color: "red" }}>{deleteError}</p>}</div>

      {editTrip && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleUpdateSubmit();
          }}
        >
          <div>
            <h3>旅行を編集する</h3>
          </div>
          <div>
            <label>
              旅行名：
              <input
                type="text"
                name="name"
                value={editTrip.name}
                disabled={isBusy}
                onChange={(e) => {
                  setEditTrip((prev) => {
                    if (prev !== null) {
                      return {
                        ...prev,
                        name: e.target.value,
                      };
                    } else return null;
                  });
                }}
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
                value={editTrip.start_date}
                disabled={isBusy}
                required
                onChange={(e) => {
                  setEditTrip((prev) => {
                    if (prev !== null) {
                      return {
                        ...prev,
                        start_date: e.target.value,
                      };
                    } else return null;
                  });
                }}
              />
            </label>
          </div>

          <div>
            <label>
              旅行終了日：
              <input
                type="date"
                name="end_date"
                value={editTrip.end_date}
                disabled={isBusy}
                required
                onChange={(e) => {
                  setEditTrip((prev) => {
                    if (prev !== null) {
                      return {
                        ...prev,
                        end_date: e.target.value,
                      };
                    } else return null;
                  });
                }}
              />
            </label>
          </div>
          <div>
            <button type="submit" disabled={isBusy}>
              {isUpdating ? "更新中" : "更新"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditTrip(null);
              }}
              disabled={isBusy}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
      {updateError && <p style={{ color: "red" }}>{updateError}</p>}

      <button
        type="button"
        onClick={() => {
          setCreateOpen(!isCreateOpen);
          setCreateError(null);
          setEditTrip(null);
          setUpdateError(null);
          setDeleteError(null);
        }}
        disabled={isBusy}
      >
        新規旅行
      </button>

      {isCreateOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreateSubmit();
          }}
        >
          <div>
            <label>
              旅行名：
              <input
                type="text"
                name="name"
                placeholder="旅行名を入力"
                value={createForm.name}
                disabled={isBusy}
                required
                onChange={(e) => {
                  setCreateForm((prev) => {
                    return {
                      ...prev,
                      name: e.target.value,
                    };
                  });
                }}
              />
            </label>
          </div>

          <div>
            <label>
              旅行開始日：
              <input
                type="date"
                name="start_date"
                value={createForm.start_date}
                disabled={isBusy}
                required
                onChange={(e) => {
                  setCreateForm((prev) => {
                    return {
                      ...prev,
                      start_date: e.target.value,
                    };
                  });
                }}
              />
            </label>
          </div>

          <div>
            <label>
              旅行終了日：
              <input
                type="date"
                name="end_date"
                value={createForm.end_date}
                disabled={isBusy}
                required
                onChange={(e) => {
                  setCreateForm((prev) => {
                    return {
                      ...prev,
                      end_date: e.target.value,
                    };
                  });
                }}
              />
            </label>
          </div>
          <button type="submit" disabled={isBusy}>
            {isCreating ? "作成中" : "作成"}
          </button>
        </form>
      )}
      {createError && <p style={{ color: "red" }}>{createError}</p>}

      <button
        type="button"
        onClick={() => {
          handleLogout();
        }}
        disabled={isBusy}
      >
        {isLogout ? "ログアウト中..." : "ログアウト"}
      </button>
      {logoutError && <p style={{ color: "red" }}>{logoutError}</p>}
    </>
  );
}
