import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 mt-12 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-[#85d5c8] mb-2">Celebrity Booking</h2>
          <p className="text-sm text-muted-foreground">
            Book your dream celebrity for events, shoutouts, and special moments.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#85d5c8] transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/my-bookings" className="hover:text-[#85d5c8] transition-colors">My Bookings</Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-[#85d5c8] transition-colors">Sign In / Register</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-[#85d5c8] transition-colors">Admin Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-muted-foreground">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#85d5c8]">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#85d5c8]">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#85d5c8]">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="mailto:support@celebritybooking.com" className="hover:text-[#85d5c8]">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Celebrity Booking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
