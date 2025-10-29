// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("[ProtectedRoute]", {
    user,
    loading,
    pathname: location.pathname,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    console.warn("[ProtectedRoute] No user found — redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("[ProtectedRoute] Authenticated — rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
