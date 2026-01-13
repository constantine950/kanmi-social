import { BrowserRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Messages from "./pages/Messages.js";
import Notifications from "./pages/Notifications.js";
import Explore from "./pages/Explore.js";
import AppLayout from "./components/AppLayout.js";
import Toast from "./components/Toast.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import { useAuthStore } from "./zustand/authStore.js";
import { useEffect } from "react";
import { refreshToken } from "./api/authApi.js";
import { disconnectSocket, initSocket } from "./socket.js";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);

  useEffect(() => {
    const restoreSession = async () => {
      if (!isAuthenticated) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await refreshToken();
        setAuth(res.data.user, res.data.newAccessToken);
      } catch {
        useAuthStore.getState().clearAuth();
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [isAuthenticated, setAuth, setAuthLoading]);

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
