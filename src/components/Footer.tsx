import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">Tag along</span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
          </div>

          <p className="text-sm text-gray-300">
            © 2026 Tag along. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
