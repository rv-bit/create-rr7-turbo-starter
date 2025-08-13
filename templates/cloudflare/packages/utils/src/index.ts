export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.RAILWAY_PUBLIC_DOMAIN)
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}