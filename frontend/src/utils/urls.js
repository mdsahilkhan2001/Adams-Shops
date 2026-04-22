export const getAdminUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  return apiUrl.replace(/\/api\/?$/, "/admin/");
};
