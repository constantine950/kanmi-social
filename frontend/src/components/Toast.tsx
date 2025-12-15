import { useEffect } from "react";
import { useUIStore } from "../zustand/uiStore";

export default function Toast() {
  const { message, type, show, hideToast } = useUIStore();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(hideToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, hideToast]);

  if (!show) return null;

  const color =
    type === "success"
      ? "border-green-600 text-green-400"
      : type === "error"
      ? "border-red-600 text-red-400"
      : "border-stone-600 text-stone-300";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`px-4 py-3 text-xs bg-stone-950 border ${color}`}>
        {message}
      </div>
    </div>
  );
}
