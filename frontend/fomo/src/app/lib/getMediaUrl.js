export const getMediaUrl = (path) => {
  if (!path) return null;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || "http://127.0.0.1:8000";
  return `${BASE_URL}${path}`;
};
