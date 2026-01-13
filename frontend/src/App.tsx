import { BrowserRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Explore from "./pages/Explore";
import AppLayout from "./components/AppLayout";
import Toast from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { refreshToken } from "./api/authApi";
import { disconnectSocket, initSocket } from "./socket";
import { useAuthStore } from "./zustand/authStore";

function App() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const restoreSession = async () => {
      setAuthLoading(true);

      try {
        const res = await refreshToken();
        setAuth(res.data.user, res.data.newAccessToken);
      } catch {
        clearAuth();
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [setAuth, setAuthLoading, clearAuth]);

  useEffect(() => {
    if (user) {
      initSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  return (
    <Router>
      <Toast />

      <Routes>
        {/* Guest-only routes */}
        <Route element={<ProtectedRoute guestOnly />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
