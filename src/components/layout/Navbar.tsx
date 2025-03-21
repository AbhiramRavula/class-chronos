
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CustomButton } from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";
import { CalendarClock, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Faculty", path: "/faculty" },
    { name: "Rooms", path: "/rooms" },
    { name: "Timetable", path: "/timetable" },
  ];

  const mobileMenuStyles = mobileMenuOpen
    ? "translate-x-0 opacity-100"
    : "translate-x-full opacity-0";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-medium text-foreground"
        >
          <CalendarClock className="h-7 w-7 text-primary" />
          <span className="animate-fade-in">Class Chronos</span>
        </Link>

        {!isMobile ? (
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all hover-lift",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <CustomButton variant="glass" size="sm">
              Generate
            </CustomButton>
          </nav>
        ) : (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-lg transition-all duration-300 ease-in-out pt-20",
            mobileMenuStyles
          )}
        >
          <nav className="flex flex-col items-center justify-center gap-6 p-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium transition-all py-2",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <CustomButton 
              variant="glass" 
              size="lg" 
              className="mt-4 w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Generate
            </CustomButton>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
