export function getApiOrigin() {
    const raw = import.meta.env.VITE_API_URL;
    const fallbackOrigin =
      typeof window !== "undefined" ? window.location.origin : "";
  
    const value =
      raw && raw.toString().trim() ? raw.toString().trim() : fallbackOrigin;
  
    // Normalize: remove trailing slashes and an optional "/api" suffix
    return value.replace(/\/+$/, "").replace(/\/api$/i, "");
  }
  
  export function getApiBase() {
    return `${getApiOrigin()}/api`;
  }