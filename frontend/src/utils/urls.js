const isAbsoluteHttpUrl = (value) => /^https?:\/\//i.test(value);

const normalizeConfiguredUrl = (value) => {
  if (!value) {
    return null;
  }

  const trimmed = String(value).trim().replace(/\/$/, "");
  return trimmed || null;
};

const getLocalServiceUrl = (port, path) => {
  if (typeof window === "undefined") {
    return `http://localhost:${port}${path}`;
  }

  return `${window.location.protocol}//${window.location.hostname}:${port}${path}`;
};

const shouldUseConfiguredUrl = (configuredUrl) => {
  if (!configuredUrl || !isAbsoluteHttpUrl(configuredUrl)) {
    return false;
  }

  if (typeof window === "undefined") {
    return true;
  }

  try {
    const configuredHost = new URL(configuredUrl).hostname;
    const currentHost = window.location.hostname;
    const isLoopback = (hostname) => hostname === "localhost" || hostname === "127.0.0.1";

    if (isLoopback(configuredHost) && !isLoopback(currentHost)) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

export const getApiBaseUrl = () => {
  const configuredUrl = normalizeConfiguredUrl(import.meta.env.VITE_API_URL);
  if (shouldUseConfiguredUrl(configuredUrl)) {
    return configuredUrl;
  }

  return getLocalServiceUrl(8000, "/api");
};

export const getAuthApiBaseUrl = () => {
  const configuredUrl = normalizeConfiguredUrl(import.meta.env.VITE_AUTH_API_URL);
  if (shouldUseConfiguredUrl(configuredUrl)) {
    return configuredUrl;
  }

  return getLocalServiceUrl(4000, "/api");
};

export const getAdminUrl = () => getApiBaseUrl().replace(/\/api\/?$/, "/admin/");
