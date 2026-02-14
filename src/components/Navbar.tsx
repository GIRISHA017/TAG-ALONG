import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusOneLogo } from "@/components/PlusOneLogo";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Explore Events" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <PlusOneLogo size="sm" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/chat"
              className="p-2.5 rounded-lg text-gray-300 hover:text-primary hover:bg-secondary/50 transition-colors"
              title="Chat"
            >
              <MessageCircle className="w-5 h-5 md:w-5 md:h-5" strokeWidth={2} />
            </Link>
            <Link
              to="/notifications"
              className="p-2.5 rounded-lg text-gray-300 hover:text-primary hover:bg-secondary/50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 md:w-5 md:h-5" strokeWidth={2} />
            </Link>
            {user && (
              <Link
                to="/profile"
                className="hidden md:inline text-sm text-muted-foreground ml-1 hover:text-primary transition-colors"
              >
                @{user.username}
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={logout} className="hidden md:inline-flex">
              <LogOut className="w-4 h-4" /> Log out
            </Button>
          </div>

          {/* Mobile: menu toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/30"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors ${
                    location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/chat"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium py-2 flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="w-4 h-4" /> Chat
              </Link>
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium py-2 flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Bell className="w-4 h-4" /> Notifications
              </Link>
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-muted-foreground py-1 hover:text-primary transition-colors"
                >
                  @{user.username}
                </Link>
              )}
              <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); setIsOpen(false); }}>
                <LogOut className="w-4 h-4" /> Log out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
