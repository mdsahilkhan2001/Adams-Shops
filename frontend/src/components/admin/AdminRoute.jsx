import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../store/api.js";

const AdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !token
  });

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        Loading admin access...
      </div>
    );
  }

  if (isError || !data?.is_staff) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
