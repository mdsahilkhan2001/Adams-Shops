import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../store/authApi.js";

const SuperAdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading, isError } = useGetMeQuery(undefined, { skip: !token });

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        Loading super admin access...
      </div>
    );
  }

  if (isError || !data || data.role !== "superadmin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default SuperAdminRoute;
