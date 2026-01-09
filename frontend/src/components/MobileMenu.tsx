import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";

interface MobileMenuProp {
  navItems: {
    label: string;
    link: string;
  }[];
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

function MobileMenu({ navItems, setShowLogoutModal, setOpen }: MobileMenuProp) {
  const { pathname } = useLocation();

  return (
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
  );
}
export default MobileMenu;
