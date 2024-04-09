export function extractFilename(url?: string) {
  if (!url) {
    return null;
  }
  const match = url.match(/\/([^\/]+)$/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}