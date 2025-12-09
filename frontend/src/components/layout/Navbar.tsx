import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Typed as HTMLElement or null
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: "Home", link: "/home" },
    { label: "Explore", link: "/explore" },
    { label: "Messages", link: "/messages" },
    { label: "Notifications", link: "/notifications" },
    { label: "Profile", link: "/profile/me" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (open && menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-stone-900
  flex items-center justify-between 
  px-4 md:px-10 lg:px-20 xl:px-32 
  z-50"
    >
      {/* LOGO */}
      <Link to="/home" className="text-white font-semibold tracking-tight">
        Kanmi
      </Link>

      {/* Desktop Nav */}
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
      </nav>

      {/* Mobile Toggle Button */}
      <button onClick={() => setOpen(!open)} className="md:hidden text-white">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Slide Menu */}
      {open && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 right-0 bg-black border-t border-stone-900 md:hidden animate-fadeIn"
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
          </nav>
        </div>
      )}
    </header>
  );
}
