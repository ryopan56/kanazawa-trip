async function request(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response;
}

export async function requestJson<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await request(url, options);
  const data: T = await response.json();
  return data;
}

export async function requestNoContent(
  url: string,
  options: RequestInit,
): Promise<void> {
  await request(url, options);
}
