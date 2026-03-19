export function getApiBase() {
    const raw = import.meta.env.VITE_API_URL?.toString().trim();
  
    if (raw) {
      const normalized = raw.replace(/\/+$/, "");
  
      // If you set VITE_API_URL to ".../api" (or ".../api/") => use as-is
      if (/\/api$/i.test(normalized)) return normalized;
  
      // If you set it to something that already contains "/api/" in the path => use as-is
      if (/\/api\//i.test(normalized)) return normalized;
  
      // Otherwise assume it's just the domain/origin and append "/api"
      return `${normalized}/api`;
    }
  
    // Fallback (this will usually cause 404 if backend is on a different domain)
    const fallback = `${window.location.origin.replace(/\/+$/, "")}/api`;
    console.warn("[apiBase] VITE_API_URL is not set. Falling back to:", fallback);
    return fallback;
  }