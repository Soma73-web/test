import React from "react";

const SiteLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="text-center">
        {/* Logo placeholder or institute name */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            NEET Academy
          </h1>
          <p className="text-gray-600">Excellence in Medical Education</p>
        </div>

        {/* Animated loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="flex space-x-1 justify-center">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>

        <p className="text-gray-500 mt-4 text-sm">Loading excellence...</p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-blue-600 h-1 rounded-full animate-pulse"
            style={{
              width: "100%",
              animation: "loading 2s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SiteLoader;
