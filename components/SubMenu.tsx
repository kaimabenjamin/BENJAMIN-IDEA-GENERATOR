
import React from 'react';

type View = 'generator' | 'developer' | 'live-chat';

interface SubMenuProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const SubMenu: React.FC<SubMenuProps> = ({ activeView, setActiveView }) => {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-tiktok-cyan/10 text-tiktok-cyan";
  const inactiveClasses = "text-gray-400 hover:bg-white/5 hover:text-white";

  return (
    <nav className="bg-tiktok-card/50 border-b border-tiktok-border">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex space-x-2 py-2">
          <button
            onClick={() => setActiveView('generator')}
            className={`${baseClasses} ${activeView === 'generator' ? activeClasses : inactiveClasses}`}
            aria-current={activeView === 'generator' ? 'page' : undefined}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveView('live-chat')}
            className={`${baseClasses} ${activeView === 'live-chat' ? activeClasses : inactiveClasses}`}
            aria-current={activeView === 'live-chat' ? 'page' : undefined}
          >
            Live Chat
          </button>
          <button
            onClick={() => setActiveView('developer')}
            className={`${baseClasses} ${activeView === 'developer' ? activeClasses : inactiveClasses}`}
             aria-current={activeView === 'developer' ? 'page' : undefined}
          >
            Developer
          </button>
        </div>
      </div>
    </nav>
  );
};
