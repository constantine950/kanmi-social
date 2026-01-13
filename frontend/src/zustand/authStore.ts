import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  user_id: string;
  username: string;
  profilePicture?: { url: string; publicId: string };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setAuthLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      authLoading: true,

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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setAuthLoading(false);
      },
    }
  )
);
