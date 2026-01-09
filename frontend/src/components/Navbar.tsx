import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../zustand/authStore";
import { logoutUser } from "../api/authApi";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import LogoutModal from "./LogoutModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
        <Logo />

        {/* DESKTOP NAV */}
        <DesktopNav
          navItems={navItems}
          setShowLogoutModal={setShowLogoutModal}
        />

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
            <MobileMenu
              navItems={navItems}
              setOpen={setOpen}
              setShowLogoutModal={setShowLogoutModal}
            />
          </div>
        )}
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <LogoutModal
            handleLogout={handleLogout}
            setShowLogoutModal={setShowLogoutModal}
          />
        </div>
      )}
    </>
  );
}
