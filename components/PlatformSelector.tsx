import React from 'react';
import { TikTokIcon, YouTubeIcon, FileTextIcon } from './icons';

export type Platform = 'TikTok' | 'YouTube' | 'Blog';

// Fix: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'".
const platforms: { id: Platform; name: string; icon: React.ReactElement }[] = [
  { id: 'TikTok', name: 'TikTok', icon: <TikTokIcon className="w-5 h-5" /> },
  { id: 'YouTube', name: 'YouTube', icon: <YouTubeIcon className="w-5 h-5" /> },
  { id: 'Blog', name: 'Blog Post', icon: <FileTextIcon className="w-5 h-5" /> },
];

interface PlatformSelectorProps {
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ activePlatform, onPlatformChange }) => {
  const baseClasses = "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-tiktok-input focus-visible:ring-tiktok-cyan";
  const activeClasses = "bg-tiktok-card shadow-sm text-white";
  const inactiveClasses = "text-gray-400 hover:bg-white/5 hover:text-gray-200";

  return (
    <div className="flex items-center bg-tiktok-input p-1 rounded-lg mb-6" role="tablist" aria-orientation="horizontal">
      {platforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onPlatformChange(platform.id)}
          className={`${baseClasses} ${activePlatform === platform.id ? activeClasses : inactiveClasses}`}
          role="tab"
          aria-selected={activePlatform === platform.id}
          aria-controls={`tabpanel-${platform.id}`}
        >
          {platform.icon}
          <span>{platform.name}</span>
        </button>
      ))}
    </div>
  );
};
