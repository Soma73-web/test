import React, { useState } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // WhatsApp configuration - you can move these to environment variables
  const phoneNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "919876543210"; // Default number
  const defaultMessage =
    process.env.REACT_APP_WHATSAPP_MESSAGE ||
    "Hello! I am interested in NEET coaching. Can you provide more information?";

  // Check if WhatsApp button should be hidden on certain pages
  const shouldHideWhatsApp = () => {
    const hiddenPaths = [
      "/results",
      "/student-dashboard",
      "/admin",
      "/admin-login",
    ];
    return hiddenPaths.some((path) => location.pathname.startsWith(path));
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  // Don't render if should be hidden
  if (shouldHideWhatsApp()) {
    return null;
  }

  return (
    <>
      {/* WhatsApp Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-50 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <FaWhatsapp className="text-green-500 text-xl" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="font-semibold text-gray-800">Chat with us</span>
            </div>
            <button
              onClick={toggleWidget}
              className="text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform duration-300"
            >
              <FaTimes />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Hi there! 👋 How can we help you today?
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Typically replies instantly
            </p>

            {/* Quick action buttons */}
            <div className="space-y-2 mb-3">
              <button
                onClick={() => {
                  const message = encodeURIComponent(
                    "I want to know about NEET coaching programs",
                  );
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${message}`,
                    "_blank",
                  );
                }}
                className="w-full text-left bg-gray-50 hover:bg-gray-100 p-2 rounded text-xs transition-colors"
              >
                📚 NEET Coaching Programs
              </button>
              <button
                onClick={() => {
                  const message = encodeURIComponent(
                    "I need information about admission process",
                  );
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${message}`,
                    "_blank",
                  );
                }}
                className="w-full text-left bg-gray-50 hover:bg-gray-100 p-2 rounded text-xs transition-colors"
              >
                📝 Admission Process
              </button>
              <button
                onClick={() => {
                  const message = encodeURIComponent(
                    "I want to know about fees and scholarships",
                  );
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${message}`,
                    "_blank",
                  );
                }}
                className="w-full text-left bg-gray-50 hover:bg-gray-100 p-2 rounded text-xs transition-colors"
              >
                💰 Fees & Scholarships
              </button>
            </div>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaWhatsapp className="text-lg" />
            Start Chat on WhatsApp
          </button>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={isOpen ? handleWhatsAppClick : toggleWidget}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40 group"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="text-2xl group-hover:animate-bounce" />

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
      </button>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
