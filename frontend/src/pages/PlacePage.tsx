import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Place, CreatePlace, UpdatePlace } from "../types/place";
import { createPlace, getPlaces, updatePlace } from "../api/places";

export default function PlacesPage() {
  const { tid } = useParams();
  const numericId = Number(tid);
  const navigate = useNavigate();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePlace>({
    name: "",
    address: "",
  });

  const [originalPlace, setOriginalPlace] = useState<Place | null>(null);
  const [editPlace, setEditPlace] = useState<Place | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isBusy = isCreating || isUpdating;

  useEffect(() => {
    async function loadPlaces() {
      setLoading(true);
      setError(null);

      if (!tid || !Number.isInteger(numericId) || numericId <= 0) {
        setError("ページが見つかりません");
        setLoading(false);
        return;
      }

      try {
        const data: Place[] = await getPlaces(numericId);
        setPlaces(data);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setError("場所一覧を取得できませんでした");
      } finally {
        setLoading(false);
      }
    }

    loadPlaces();
  }, [tid, navigate, numericId]);

  if (loading) {
    return <p>読み込み中</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  async function handleCreateSubmit() {
    setCreateError(null);
    setIsCreating(true);

    const createData = {
      name: createForm.name,
      address: createForm.address?.trim() || null,
    };

    try {
      try {
        await createPlace(numericId, createData);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setCreateError("場所を追加できませんでした");
        return;
      }

      try {
        const data: Place[] = await getPlaces(numericId);
        setPlaces(data);
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
          "場所を追加しましたが、場所一覧を取得できませんでした。再度場所を作成せず、ページを再読み込みしてください。",
        );
      } finally {
        setIsCreateOpen(false);
        setCreateForm({
          name: "",
          address: "",
        });
      }
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateSubmit() {
    setUpdateError(null);
    if (!originalPlace || !editPlace) return;

    const placeData: UpdatePlace = {};
    const oldAddress = originalPlace.address?.trim() || null;
    const newAddress = editPlace.address?.trim() || null;

    if (originalPlace.name !== editPlace.name) {
      placeData.name = editPlace.name;
    }
    if (oldAddress !== newAddress) {
      placeData.address = newAddress;
    }
    if (Object.keys(placeData).length === 0) {
      setEditPlace(null);
      return;
    }

    setIsUpdating(true);

    try {
      try {
        await updatePlace(editPlace.trip_id, editPlace.id, placeData);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setUpdateError("場所を編集できませんでした");
        return;
      }

      try {
        const data: Place[] = await getPlaces(editPlace.trip_id);
        setPlaces(data);
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
          "場所を編集しましたが、場所一覧を取得できませんでした。再度更新せず、ページを再読み込みしてください。",
        );
      } finally {
        setEditPlace(null);
      }
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      {places.length === 0 ? (
        <p>場所の登録がありません</p>
      ) : (
        <ul>
          {places.map((place) => (
            <li key={place.id}>
              {place.name}
              {place.address && `, ${place.address}`}
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setOriginalPlace({ ...place });
                  setEditPlace({ ...place });
                  setIsCreateOpen(false);
                  setUpdateError(null);
                  setCreateError(null);
                }}
              >
                編集
              </button>
            </li>
          ))}
        </ul>
      )}

      {editPlace && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleUpdateSubmit();
          }}
        >
          <div>
            <h3>場所を編集する</h3>
          </div>
          <div>
            <label>
              場所名：
              <input
                type="text"
                name="name"
                value={editPlace.name}
                disabled={isBusy}
                required
                onChange={(e) => {
                  setEditPlace((prev) => {
                    if (prev !== null) {
                      return {
                        ...prev,
                        name: e.target.value,
                      };
                    } else return null;
                  });
                }}
              />
            </label>
          </div>

          <div>
            <label>
              住所：
              <input
                type="text"
                name="address"
                value={editPlace.address ?? ""}
                disabled={isBusy}
                onChange={(e) => {
                  setEditPlace((prev) => {
                    if (prev !== null) {
                      return {
                        ...prev,
                        address: e.target.value,
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
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                setEditPlace(null);
                setUpdateError(null);
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
          setIsCreateOpen(!isCreateOpen);
          setCreateError(null);
          setEditPlace(null);
          setUpdateError(null);
        }}
        disabled={isBusy}
      >
        {isCreateOpen ? "閉じる" : "場所を登録"}
      </button>

      {isCreateOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateSubmit();
          }}
        >
          <div>
            <label>
              場所名：
              <input
                type="text"
                name="name"
                placeholder="場所名を入力"
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
              住所：
              <input
                type="text"
                name="address"
                placeholder="住所を入力"
                value={createForm.address ?? ""}
                disabled={isBusy}
                onChange={(e) => {
                  setCreateForm((prev) => {
                    return {
                      ...prev,
                      address: e.target.value,
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
    </>
  );
}
