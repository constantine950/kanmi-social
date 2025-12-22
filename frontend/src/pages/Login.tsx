import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AxiosError } from "axios";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../zustand/authStore";
import { useUIStore } from "../zustand/uiStore";
import Font from "../components/Font";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const showToast = useUIStore((s) => s.showToast);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({
        username,
        password,
      });

      setAuth(res.data.user, res.data.accessToken);

      showToast("Logged in successfully 👋", "success");
      navigate("/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(error.response?.data?.message || "Login failed", "error");
      } else {
        showToast("Something went wrong", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] flex items-center justify-center px-6">
      <Font />

      <div className="max-w-md w-full space-y-8 p-8 border border-stone-800 bg-stone-950">
        <div className="space-y-1">
          <h1 className="text-3xl font-[Playfair_Display] text-white">
            Login to Kanmi
          </h1>
          <p className="text-xs text-stone-400">Welcome back, minimalist.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-800 focus:border-stone-600 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-800 focus:border-stone-600 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-3 py-2 text-xs uppercase tracking-wide
              bg-white text-black hover:bg-stone-300 transition
              disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-stone-500 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-white underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
