import { Briefcase, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getFullName } from "../../utils/storage";

const NAV_LINKS = [
  { path: "/home", label: "Home" },
  { path: "/jobs", label: "Jobs" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "recruiter" ? "/recruiter" : "/user";
  const dashboardLabel = user?.role === "admin" ? "Admin Panel" : user?.role === "recruiter" ? "Recruiter Panel" : "Dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur shadow-sm" : "bg-white border-b border-gray-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="p-1.5 bg-blue-600 rounded-lg"><Briefcase className="text-white h-5 w-5" /></div>
          HireVelocity
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ path, label }) => (
            <Link key={path} to={path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to={dashboardPath}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors">
            {dashboardLabel}
          </Link>
          <div ref={dropdownRef} className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(user?.firstName || user?.email || "U")[0].toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate">{getFullName(user)}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
                </div>

                {user?.role === "recruiter" && (
                  <Link
                    to="/recruiter/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                )}

                {user?.role === "user" && (
                  <Link
                    to="/user/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                )}

                <button onClick={() => { logout(); navigate("/login"); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <button className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 fade-in">
          {NAV_LINKS.map(({ path, label }) => (
            <Link key={path} to={path}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive(path) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}>
              {label}
            </Link>
          ))}
          <Link to={dashboardPath} className="block px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50">{dashboardLabel}</Link>
          <button onClick={() => { logout(); navigate("/login"); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50">
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
