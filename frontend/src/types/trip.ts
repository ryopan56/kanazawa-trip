export type Trip = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
};

export type CreateTrip = {
  name: string;
  start_date: string;
  end_date: string;
};

export type UpdateTrip = {
  name?: string;
  start_date?: string;
  end_date?: string;
};
