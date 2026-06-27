import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../store/authApi.js";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading, isError } = useGetMeQuery(undefined, { skip: !token });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        Loading your account...
      </div>
    );
  }

  if (isError || !data) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
