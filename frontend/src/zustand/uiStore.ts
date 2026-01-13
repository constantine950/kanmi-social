import { create } from "zustand";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  show: boolean;

  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useUIStore = create<ToastState>((set) => ({
  message: "",
  type: "info",
  show: false,

  showToast: (message, type = "info") => set({ message, type, show: true }),

  hideToast: () => set({ show: false }),
}));
