import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "blue",
  text = "",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-blue-200 border-t-blue-600",
    green: "border-green-200 border-t-green-600",
    red: "border-red-200 border-t-red-600",
    gray: "border-gray-200 border-t-gray-600",
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-2 rounded-full animate-spin
        `}
      />
      {text && (
        <span className={`text-${color}-600 text-sm animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
