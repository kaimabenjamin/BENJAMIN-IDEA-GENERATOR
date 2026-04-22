
import React from 'react';
import { SparklesIcon, MenuIcon, MailIcon } from './icons';

interface HeaderProps {
  onMenuClick: () => void;
  onFeedbackClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onFeedbackClick }) => {
  return (
    <header className="py-4 border-b border-tiktok-border/50 shadow-lg bg-tiktok-bg/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Open menu">
          <MenuIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative flex items-center">
            <SparklesIcon className="w-6 h-6 text-tiktok-cyan absolute -left-8 top-1/2 -translate-y-1/2 sparkle" style={{ animationDelay: '0s' }} />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center animate-text-gradient">
              BENJAMIN IDEA GENERATOR
            </h1>
            <SparklesIcon className="w-6 h-6 text-tiktok-red absolute -right-8 top-1/2 -translate-y-1/2 sparkle" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="mt-2 text-sm text-gray-400 text-center">
            Your AI partner with viral contents on platforms
          </p>
          <p className="mt-2 text-sm text-gray-400 text-center">
          Join the kai-webdevelopers, build your career And enjoy lots of developers
          </p>
        </div>

        <a 
          href="mailto:benjakaimax425@gmail.com?subject=Benjamin Idea Generator Feedback"
          className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm font-medium" 
          aria-label="Send feedback"
        >
          <MailIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Feedback</span>
        </a>
      </div>
    </header>
  );
};
