import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoading, isAuthenticated, isAdmin } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
