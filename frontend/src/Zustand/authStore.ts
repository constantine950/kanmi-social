import { create } from "zustand";

interface User {
  _id: string;
  username: string;
  profilePicture?: { url: string; publicId: string };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  authLoading: boolean; // 🔥 NEW

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setAuthLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authLoading: true, // 🔥 start loading

  setAuth: (user, token) =>
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      authLoading: false,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      authLoading: false,
    }),

  setAuthLoading: (val) => set({ authLoading: val }),
}));
