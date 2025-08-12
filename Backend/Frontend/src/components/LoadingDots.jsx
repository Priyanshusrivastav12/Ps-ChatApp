import React from "react";

function LoadingDots({ size = "small", className = "" }) {
  const sizeClasses = {
    small: "w-2 h-2",
    medium: "w-3 h-3", 
    large: "w-4 h-4"
  };

  const dotSize = sizeClasses[size] || sizeClasses.small;

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <div className={`${dotSize} bg-blue-500 rounded-full animate-bounce`}></div>
      <div 
        className={`${dotSize} bg-blue-500 rounded-full animate-bounce`}
        style={{ animationDelay: '0.1s' }}
      ></div>
      <div 
        className={`${dotSize} bg-blue-500 rounded-full animate-bounce`}
        style={{ animationDelay: '0.2s' }}
      ></div>
    </div>
  );
}

export default LoadingDots;
