/**
 * Map Axios / FastAPI errors to a user-facing German message.
 * Keeps the real cause in the console during development.
 */
export function getApiErrorMessage(error, fallback = "Ein Fehler ist aufgetreten.") {
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("API error:", {
      message: error?.message,
      code: error?.code,
      url: error?.config?.baseURL + (error?.config?.url || ""),
      status: error?.response?.status,
      data: error?.response?.data,
    });
  }

  const detail = error?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  if (Array.isArray(detail) && detail.length) {
    const msgs = detail
      .map((item) => item?.msg || item?.message || "")
      .filter(Boolean);
    if (msgs.length) return msgs.join(" ");
  }

  if (error?.code === "ECONNABORTED") {
    return "Zeitüberschreitung bei der Verbindung. Bitte versuchen Sie es erneut.";
  }

  if (!error?.response) {
    return "Serververbindung fehlgeschlagen. Bitte versuchen Sie es in einem Moment erneut.";
  }

  if (error.response.status >= 500) {
    return "Der Server ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut.";
  }

  return fallback;
}
