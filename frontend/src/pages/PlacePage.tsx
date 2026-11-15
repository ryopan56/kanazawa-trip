import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Place, CreatePlace } from "../types/place";
import { createPlace, getPlaces } from "../api/places";

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

  const isBusy = isCreating;

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

  // if (places.length === 0) {
  //   return <p>場所の登録がありません</p>;
  // }

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
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => {
          setIsCreateOpen(!isCreateOpen);
          setCreateError(null);
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
