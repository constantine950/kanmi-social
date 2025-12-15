import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-16 px-4 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
