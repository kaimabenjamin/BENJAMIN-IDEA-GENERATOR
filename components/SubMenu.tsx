
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

type View = 'generator' | 'developer' | 'live-chat';

interface SubMenuProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const SubMenu: React.FC<SubMenuProps> = ({ activeView, setActiveView }) => {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2";
  const activeClasses = "bg-tiktok-cyan/10 text-tiktok-cyan shadow-[0_0_15px_rgba(42,242,255,0.15)] outline outline-1 outline-tiktok-cyan/30";
  const inactiveClasses = "text-gray-400 hover:bg-white/5 hover:text-white";

  return (
    <nav className="bg-tiktok-card/50 border-b border-tiktok-border sticky top-[60px] z-40 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex space-x-2 py-2 overflow-x-auto no-scrollbar">
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
          <motion.a
            href="?view=developer"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${baseClasses} ${inactiveClasses} border border-transparent hover:border-tiktok-cyan/50 hover:bg-tiktok-cyan/5 group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-tiktok-cyan/0 via-tiktok-cyan/10 to-tiktok-cyan/0 -translate-x-full group-hover:animate-shimmer" />
            Developer
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:text-tiktok-cyan transition-all" />
            <motion.span 
              className="absolute bottom-0 left-0 h-[2px] bg-tiktok-cyan"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </div>
      </div>
    </nav>
  );
};
