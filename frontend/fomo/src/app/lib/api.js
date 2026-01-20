const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(API_BASE + endpoint, {
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch {}
    throw { status: res.status, data: errorData };
  }

   const text = await res.text();
  return text ? JSON.parse(text) : {};
}
