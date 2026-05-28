export function getImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("blob.vercel-storage.com")) {
    return `/api/blob?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export async function fetchPrivateBlob(url: string): Promise<{
  data: ArrayBuffer;
  contentType: string;
  cacheControl: string;
}> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Failed to fetch blob: ${res.status}`);

  return {
    data: await res.arrayBuffer(),
    contentType: res.headers.get("content-type") || "image/jpeg",
    cacheControl: "public, max-age=31536000, immutable",
  };
}
