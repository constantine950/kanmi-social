import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";

interface DesktopNavProp {
  navItems: {
    label: string;
    link: string;
  }[];
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function DesktopNav({ navItems, setShowLogoutModal }: DesktopNavProp) {
  const { pathname } = useLocation();

  return (
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
  );
}

export default DesktopNav;
