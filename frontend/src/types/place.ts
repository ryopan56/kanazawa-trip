export type Place = {
  id: number;
  trip_id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type CreatePlace = {
  name: string;
  address?: string | null;
};

export type UpdatePlace = {
  name?: string;
  address?: string | null;
};
