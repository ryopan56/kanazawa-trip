import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Place } from "../types/place";
import { getPlaces } from "../api/places";

export default function PlacesPage() {
  const { tid } = useParams();
  const numericId = Number(tid);
  const navigate = useNavigate();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (places.length === 0) {
    return <p>場所の登録がありません</p>;
  }

  return (
    <>
      <ul>
        {places.map((place) => (
          <li key={place.id}>
            {place.name}
            {place.address && `, ${place.address}`}
          </li>
        ))}
      </ul>
    </>
  );
}
