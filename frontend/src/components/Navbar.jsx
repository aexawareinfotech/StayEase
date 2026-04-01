import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaHotel } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Strict restriction: Admin should not be on non-admin routes
  React.useEffect(() => {
    if (user && user.role === "admin" && !isAdminRoute) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, isAdminRoute, navigate]);

  if (isAdminRoute) {
    return null; // Admin Layout provides its own navigation
  }

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center text-2xl font-bold text-blue-600 text-decoration-none hover:text-blue-700 transition"
            >
              <FaHotel className="me-2" size={28} />
              <span>StayEase</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/#home"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-150 text-decoration-none"
            >
              Home
            </a>
            <a
              href="/#about"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-150 text-decoration-none"
            >
              About
            </a>
            <div className="dropdown">
              <span className="text-gray-700 hover:text-blue-600 font-medium transition duration-150 py-2 inline-flex items-center">
                Services ▾
              </span>
              <ul className="dropdown-menu">
                <li>
                  <a href="/#services">All Services</a>
                </li>
                <li>
                  <Link to="/rooms">Rooms</Link>
                </li>
              </ul>
            </div>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-150 text-decoration-none"
            >
              Contact
            </a>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-150 text-decoration-none"
                >
                  My Profile
                </Link>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-150 text-decoration-none"
                >
                  My Bookings
                </Link>
                <Link
                  to="/email-history"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-150 text-decoration-none"
                >
                  Email History
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-150 shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-150 shadow-sm text-decoration-none"
              >
                Account
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Options */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg border-t border-gray-100">
          <a
            href="/#home"
            className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md text-decoration-none"
            onClick={toggleMenu}
          >
            Home
          </a>
          <a
            href="/#about"
            className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md text-decoration-none"
            onClick={toggleMenu}
          >
            About
          </a>
          <div className="px-3 py-2">
            <span className="block text-gray-700 font-medium mb-1">
              Services ▾
            </span>
            <div className="pl-4 space-y-1">
              <a
                href="/#services"
                className="block py-1 text-gray-600 font-medium hover:text-blue-600 text-decoration-none"
                onClick={toggleMenu}
              >
                All Services
              </a>
              <Link
                to="/rooms"
                className="block py-1 text-gray-600 font-medium hover:text-blue-600 text-decoration-none"
                onClick={toggleMenu}
              >
                Rooms
              </Link>
            </div>
          </div>
          <a
            href="#contact"
            className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md text-decoration-none"
            onClick={toggleMenu}
          >
            Contact
          </a>
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md"
                onClick={toggleMenu}
              >
                My Bookings
              </Link>
              <Link
                to="/email-history"
                className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md"
                onClick={toggleMenu}
              >
                Email History
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-500 font-medium hover:bg-gray-50 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="block px-3 py-2 text-blue-600 font-medium hover:bg-gray-50 rounded-md text-decoration-none"
              onClick={toggleMenu}
            >
              Account
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
