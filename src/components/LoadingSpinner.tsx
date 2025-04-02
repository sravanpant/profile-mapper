import React from "react";

export function LoadingSpinner({
  size = "medium",
  className = "",
}: {
  size?: "small" | "medium" | "large";
  className?: string;
}) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          border-4 
          border-t-4 
          border-blue-500 
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-inherit z-50">
      <LoadingSpinner size="large" />
    </div>
  );
}
