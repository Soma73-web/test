import React from "react";

const EmptyState = ({
  icon = "📄",
  title = "No data available",
  message = "Content will appear here once available",
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-sm mb-6">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
