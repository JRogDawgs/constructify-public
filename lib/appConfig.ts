export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://constructify-field.vercel.app";

/** Marketing landing site origin (this repo). For absolute demo video URLs and Ceebo links. */
export const PUBLIC_SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
