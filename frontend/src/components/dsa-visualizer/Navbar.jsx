import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-300 group"
            onClick={closeMenu}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-1.5 sm:p-2 
              shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/40 transition-all duration-300 
              group-hover:scale-105"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-full h-full text-white drop-shadow-sm"
              >
                <path 
                  d="M12 3v18M3 12h18M3 6h18M3 18h18" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
              bg-clip-text text-transparent drop-shadow-sm"
            >
              Algorithm Visualizer
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/" current={location.pathname === "/"} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/visualizer" current={location.pathname === "/visualizer"} onClick={closeMenu}>
              Visualizer
            </NavLink>
            <NavLink to="/race-mode" current={location.pathname === "/race-mode"} onClick={closeMenu}>
              Race Mode
            </NavLink>
            <NavLink to="/leaderboard" current={location.pathname === "/leaderboard"} onClick={closeMenu}>
              Leaderboard
            </NavLink>
            <NavLink to="/about" current={location.pathname === "/about"} onClick={closeMenu}>
              About
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 border-t border-gray-200">
            <MobileNavLink to="/" current={location.pathname === "/"} onClick={closeMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/visualizer" current={location.pathname === "/visualizer"} onClick={closeMenu}>
              Visualizer
            </MobileNavLink>
            <MobileNavLink to="/race-mode" current={location.pathname === "/race-mode"} onClick={closeMenu}>
              Race Mode
            </MobileNavLink>
            <MobileNavLink to="/leaderboard" current={location.pathname === "/leaderboard"} onClick={closeMenu}>
              Leaderboard
            </MobileNavLink>
            <MobileNavLink to="/about" current={location.pathname === "/about"} onClick={closeMenu}>
              About
            </MobileNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced NavLink component for desktop
const NavLink = ({ to, current, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium transition-all duration-300
      ${current 
        ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
      }
      relative overflow-hidden group
    `}
  >
    {/* Background shine effect for active links */}
    {current && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
      />
    )}
    <span className="relative z-10">{children}</span>
  </Link>
);

// Mobile NavLink component
const MobileNavLink = ({ to, current, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300
      ${current 
        ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-md' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }
    `}
  >
    {children}
  </Link>
);

export default Navbar;

