import { request, requestNoContent } from "./client";

export type LoginData = {
  email: string;
  password: string;
};

export async function loginUser(loginData: LoginData): Promise<void> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  };

  await request("/api/login", options);
}

export async function logoutUser(): Promise<void> {
  const options: RequestInit = {
    method: "POST",
  };

  await requestNoContent("/api/logout", options);
}
