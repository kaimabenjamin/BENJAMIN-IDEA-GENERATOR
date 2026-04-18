
import React from 'react';

const SkeletonRow: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-tiktok-input rounded animate-pulse ${className}`}></div>
);

export const IdeaCardSkeleton: React.FC = () => {
  return (
    <div className="bg-tiktok-card border border-tiktok-border rounded-lg p-6 shadow-lg">
      <div className="flex items-center">
        <SkeletonRow className="w-6 h-6 mr-3 rounded-full" />
        <SkeletonRow className="w-3/4 h-6" />
      </div>
      <div className="mt-3 space-y-2">
          <SkeletonRow className="w-full h-4" />
          <SkeletonRow className="w-5/6 h-4" />
      </div>
      
      <div className="mt-4 pt-4 border-t border-tiktok-border/50 space-y-4">
          <div className="flex items-start">
              <SkeletonRow className="w-5 h-5 mt-1 rounded-full flex-shrink-0" />
              <div className="ml-3 w-full">
                  <SkeletonRow className="w-1/4 h-4" />
                  <SkeletonRow className="w-1/2 h-4 mt-2" />
              </div>
          </div>
          <div className="flex items-start">
              <SkeletonRow className="w-5 h-5 mt-1 rounded-full flex-shrink-0" />
              <div className="ml-3 w-full">
                  <SkeletonRow className="w-1/3 h-4" />
                  <SkeletonRow className="w-3/4 h-4 mt-2" />
              </div>
          </div>
          <div className="flex items-start">
              <SkeletonRow className="w-5 h-5 mt-1 rounded-full flex-shrink-0" />
              <div className="ml-3 w-full">
                  <SkeletonRow className="w-1/4 h-4" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <SkeletonRow className="w-20 h-5 rounded-full" />
                    <SkeletonRow className="w-24 h-5 rounded-full" />
                    <SkeletonRow className="w-16 h-5 rounded-full" />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
