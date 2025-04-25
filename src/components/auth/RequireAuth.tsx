
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("staywise-auth") !== null;
  
  // If not authenticated, redirect to the landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default RequireAuth;
