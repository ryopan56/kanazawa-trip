export type Activity = {
  id: number;
  trip_id: number;
  place_id: number | null;
  name: string;
  category: string;
  start_datetime: string;
  end_datetime: string | null;
  memo: string | null;
};
