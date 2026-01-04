import { Briefcase, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const dashboardItems = [
    { name: "User Dashboard", path: "/user-dashboard" },
    { name: "Admin Dashboard", path: "/admin-dashboard" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-white/70" : "bg-white"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-black">
            <div className="p-2 rounded-lg bg-black">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            HireFlow
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 py-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-black border-b-2 border-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {dashboardItems.map((item) => (
              <Button
                key={item.name}
                size="sm"
                variant={isActive(item.path) ? "default" : "outline"}
                asChild
              >
                <Link to={item.path}>{item.name}</Link>
              </Button>
            ))}

            <Button size="sm" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path) ? "text-black" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-4 border-t">
                {dashboardItems.map((item) => (
                  <Button
                    key={item.name}
                    size="sm"
                    variant={isActive(item.path) ? "default" : "outline"}
                    asChild
                  >
                    <Link to={item.path}>{item.name}</Link>
                  </Button>
                ))}

                <Button size="sm" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
