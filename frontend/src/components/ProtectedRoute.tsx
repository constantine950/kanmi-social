import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../zustand/authStore";
import Spinner from "./Spinner";

export default function ProtectedRoute({ guestOnly = false }) {
  const { isAuthenticated, authLoading } = useAuthStore();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
