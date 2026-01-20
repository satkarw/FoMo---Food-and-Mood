export const getMediaUrl = (path) => {
  if (!path) return null;
  
  // Use the defined API_URL, or a fallback for local dev
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";
  
  // For media files, we need the base of the URL (without the /api/ part)
  const baseUrl = apiUrl.replace('api/', '');
  
  // Combine the base URL with the media path
  return `${baseUrl}${path}`;
};
