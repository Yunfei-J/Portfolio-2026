interface Geo {
  city?: string;
  region?: string;
  country?: string;
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/** City, region, and country from Cloudflare's IP location. */
export function placeFrom(request: Request) {
  const cf = (request as Request & { cf?: Geo }).cf;
  const city = text(cf?.city);
  const region = text(cf?.region);
  const country = text(cf?.country) || request.headers.get("CF-IPCountry") || "unknown";
  const parts = [city, region !== city ? region : "", country].filter(Boolean);
  return parts.join(", ");
}
