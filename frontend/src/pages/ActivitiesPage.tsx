import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { Activity } from "../types/activity";
import { getActivities } from "../api/activities";

export default function ActivitiesPage() {
  const { tid } = useParams();
  const numericId = Number(tid);
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadActivities() {
      setLoading(true);
      setError(null);

      if (!tid || !Number.isInteger(numericId) || numericId <= 0) {
        setError("ページが見つかりません");
        setLoading(false);
        return;
      }

      try {
        const data: Activity[] = await getActivities(numericId);
        setActivities(data);
      } catch (errorMessage) {
        console.error(errorMessage);
        // JWTなし/有効期限切れの場合`/login` に遷移させる
        if (errorMessage instanceof Error) {
          if (errorMessage.message === "HTTP 401") {
            navigate("/login", { replace: true });
            return;
          }
        }
        setError("予定一覧を取得できませんでした");
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [tid, numericId, navigate]);

  if (loading) {
    return <p>読み込み中</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {activities.length === 0 ? (
        <p>予定の登録がありません</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              {activity.name}
              {activity.category}
              {activity.start_datetime}
              {activity.end_datetime && `~ ${activity.end_datetime}`}
              {activity.memo}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
