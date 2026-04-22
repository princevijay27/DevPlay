const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers
    },
    credentials: "include"
  });

  if (response.status === 401 && typeof window !== "undefined") {
    window.location.href = "/sign-in";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const requestId = response.headers.get("x-request-id");
  if (requestId) {
    console.info("API request completed", { path, requestId });
  }

  return (await response.json()) as T;
}

export function createAuthedApiClient(getToken: () => Promise<string | null>) {
  return {
    fetch: async <T>(path: string, init: RequestInit = {}) => {
      const token = await getToken();
      return apiFetch<T>(path, init, token);
    }
  };
}
