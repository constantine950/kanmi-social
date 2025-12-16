import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, LogOut } from "lucide-react";
import { useAuthStore } from "../zustand/authStore";
import { logoutUser } from "../api/authApi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const clearAuth = useAuthStore((s) => s.clearAuth);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: "Home", link: "/home" },
    { label: "Explore", link: "/explore" },
    { label: "Messages", link: "/messages" },
    { label: "Notifications", link: "/notifications" },
    { label: "Profile", link: "/profile/me" },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (open && menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-stone-900
        flex items-center justify-between
        px-4 md:px-10 lg:px-20 xl:px-32
        z-40"
      >
        {/* LOGO */}
        <Link to="/home" className="text-white font-semibold tracking-tight">
          Kanmi
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className={`${
                pathname === item.link ? "text-white" : "text-stone-400"
              } hover:text-white`}
            >
              {item.label}
            </Link>
          ))}

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1 text-stone-400 hover:text-red-400"
          >
            <LogOut size={14} />
            Logout
          </button>
        </nav>

        {/* MOBILE TOGGLE */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* MOBILE MENU */}
        {open && (
          <div
            ref={menuRef}
            className="absolute top-16 left-0 right-0 bg-black border-t border-stone-900 md:hidden"
          >
            <nav className="flex flex-col text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.link}
                  to={item.link}
                  onClick={() => setOpen(false)}
                  className={`px-6 py-4 border-b border-stone-900 ${
                    pathname === item.link ? "text-white" : "text-stone-400"
                  } hover:bg-stone-900`}
                >
                  {item.label}
                </Link>
              ))}

              {/* MOBILE LOGOUT */}
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setOpen(false);
                }}
                className="px-6 py-4 text-left text-red-400 hover:bg-stone-900 flex items-center gap-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-sm bg-stone-950 border border-stone-800 p-6 space-y-5">
            <h2 className="text-lg text-white font-medium">Log out?</h2>

            <p className="text-xs text-stone-400">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs border border-stone-700 text-stone-300 hover:bg-stone-900"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleLogout();
                  setShowLogoutModal(false);
                }}
                className="px-4 py-2 text-xs bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
