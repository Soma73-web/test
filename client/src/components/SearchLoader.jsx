import React from "react";
import logoCircle from "../assets/logoCircle.jpg";
import "./SearchLoader.css";

const SearchLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Logo with rotating ring and blur effect */}
        <div className="relative">
          {/* Soft blue glow/blur effect */}
          <div className="absolute inset-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-15"></div>
          
          {/* Rotating blue ring - thicker and more prominent */}
          <div className="absolute inset-0 w-56 h-56 border-8 border-blue-500 rounded-full animate-spin-slow shadow-lg"></div>
          
          {/* Logo image - perfectly centered, standard size */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            <img
              src={logoCircle}
              alt="Vagus Logo"
              className="w-40 h-40 rounded-full object-cover z-10"
              loading="lazy"
              onLoad={(e) => {
                e.target.style.opacity = '1';
              }}
              style={{ opacity: 0, transition: 'opacity 0.3s ease-in' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoader; 