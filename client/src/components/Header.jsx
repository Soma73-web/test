import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/", scrollTo: "courses" },
    { name: "Results", path: "/results" },
    { name: "Gallery", path: "/gallery" },
    { name: "Downloads", path: "/downloads" },
    { name: "Contact", path: "/contact" },
  ];

  const aboutDropdownItems = [
    { name: "About Us", path: "/about" },
    { name: "Director's Message", path: "/directors-message" },
    { name: "Testimonials", path: "/", scrollTo: "testimonials" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAboutDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavClick = (link) => {
    setMenuOpen(false);
    setAboutDropdownOpen(false);
    setMobileAboutOpen(false);
    if (link.scrollTo) {
      navigate(`/#${link.scrollTo}`);
    } else {
      navigate(link.path);
    }
  };

  const handleAboutDropdownClick = (item) => {
    setAboutDropdownOpen(false);
    handleNavClick(item);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white backdrop-blur-sm bg-opacity-95 shadow-lg border-b border-gray-100 z-50 h-[96px]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="VAGUS Logo"
            className="h-16 object-contain hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
          ))}

          {/* About Us Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1 relative group"
            >
              About Us
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${aboutDropdownOpen ? "rotate-180" : ""}`}
              />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </button>

            {/* Dropdown Menu */}
            {aboutDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                <div className="absolute -top-1 right-6 w-2 h-2 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                {aboutDropdownItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => handleAboutDropdownClick(item)}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium">{item.name}</div>
                    {item.name === "About Us" && (
                      <div className="text-xs text-gray-500 mt-1">
                        Learn about our mission
                      </div>
                    )}
                    {item.name === "Director's Message" && (
                      <div className="text-xs text-gray-500 mt-1">
                        Message from leadership
                      </div>
                    )}
                    {item.name === "Testimonials" && (
                      <div className="text-xs text-gray-500 mt-1">
                        Success stories
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {menuOpen ? (
              <FaTimes size={24} className="text-gray-700" />
            ) : (
              <FaBars size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/student-login"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Student Portal
          </Link>
          <Link
            to="/contact"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Enquire Now
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-150 font-medium"
              >
                {link.name}
              </button>
            ))}

            {/* Mobile About Us Dropdown */}
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-150 font-medium"
              >
                About Us
                <FaChevronDown
                  className={`text-xs transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileAboutOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {aboutDropdownItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item)}
                      className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-150"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Action Buttons */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <Link
                to="/student-login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Student Portal
              </Link>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
