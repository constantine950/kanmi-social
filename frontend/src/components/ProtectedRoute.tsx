import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../zustand/authStore";

export default function ProtectedRoute({ guestOnly = false }) {
  const { isAuthenticated, authLoading } = useAuthStore();

  // ⏳ wait for refresh check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-stone-400 text-sm">
        Restoring session…
      </div>
    );
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
