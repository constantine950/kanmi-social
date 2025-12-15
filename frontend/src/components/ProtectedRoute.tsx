import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../zustand/authStore";

interface ProtectedRouteProps {
  guestOnly?: boolean;
}

export default function ProtectedRoute({
  guestOnly = false,
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  // If guestOnly, redirect logged-in users away
  if (guestOnly && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If protected, redirect unauthenticated users to login
  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Otherwise, render the page
  return <Outlet />;
}
