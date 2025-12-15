import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Font from "../components/Font";
import { registerUser } from "../api/authApi";
import { useUIStore } from "../zustand/uiStore";
import { AxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      if (file) formData.append("file", file);

      const res = await registerUser(formData);

      if (res.data?.message?.toLowerCase().includes("exists")) {
        showToast("Account already exists. Please login.", "info");
        return;
      }

      showToast("Account created successfully 🎉", "success");
      navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(
          error.response?.data?.message || "Registration failed",
          "error"
        );
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
            Create your account
          </h1>
          <p className="text-xs text-stone-400">
            Join Kanmi — quiet moments, shared.
          </p>
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

          {/* Optional profile image */}
          <div className="space-y-1">
            <label className="text-xs text-stone-500">
              Profile image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              className="w-full text-xs text-stone-400
                file:bg-stone-900 file:border file:border-stone-800
                file:px-3 file:py-1 file:text-xs file:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-3 py-2 text-xs uppercase tracking-wide
              bg-white text-black hover:bg-stone-300 transition
              disabled:opacity-50"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-xs text-stone-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
