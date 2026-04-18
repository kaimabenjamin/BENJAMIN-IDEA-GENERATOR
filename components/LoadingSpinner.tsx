
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-tiktok-border rounded-full"></div>
        <div className="w-16 h-16 border-4 border-tiktok-cyan border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        <div className="w-16 h-16 border-4 border-tiktok-red border-t-transparent rounded-full animate-spin absolute top-0 left-0" style={{ animationDelay: '0.2s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-6 text-lg text-white font-semibold">Generating viral ideas...</p>
    </div>
  );
};
