
import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, Mail } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onFeedbackClick: () => void;
  onHomeClick?: () => void;
  activeView?: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onFeedbackClick, onHomeClick, activeView }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isChat = activeView === 'live-chat';

  const controlHeader = () => {
    if (typeof window !== 'undefined' && !isChat) {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !isChat) {
      window.addEventListener('scroll', controlHeader);
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    } else if (isChat) {
      setIsVisible(true);
    }
  }, [lastScrollY, isChat]);

  return (
    <header className={`py-3 border-b border-tiktok-border/30 shadow-2xl bg-tiktok-bg/90 backdrop-blur-md sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="p-2 text-tiktok-cyan hover:text-white bg-tiktok-cyan/10 hover:bg-tiktok-cyan/20 rounded-xl transition-all shadow-[0_0_15px_rgba(42,242,255,0.2)]" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
          
          {isChat && (
            <button 
              onClick={onHomeClick}
              className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest bg-white/5 px-2 py-1.5 rounded-lg border border-white/5 transition-all"
            >
              Back to Home
            </button>
          )}
        </div>

        {!isChat && (
          <div className="flex flex-col items-center">
            <div className="relative flex items-center">
              <Sparkles className="w-5 h-5 text-tiktok-cyan absolute -left-7 top-1/2 -translate-y-1/2 sparkle" style={{ animationDelay: '0s' }} />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-center animate-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white via-tiktok-cyan to-white bg-[length:200%_auto]">
                BENJAMIN IDEA GENERATOR
              </h1>
              <Sparkles className="w-5 h-5 text-tiktok-red absolute -right-7 top-1/2 -translate-y-1/2 sparkle" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="mt-1 text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-[0.2em]">
              AI Partner • Viral Content • kai-webdevelopers
            </p>
          </div>
        )}

        {!isChat && (
          <a 
            href="mailto:benjakaimax425@gmail.com?subject=Benjamin Idea Generator Feedback"
            className="flex items-center gap-2 text-white bg-gradient-to-r from-tiktok-red/20 to-tiktok-cyan/20 border border-tiktok-cyan/30 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(42,242,255,0.4)] relative group overflow-hidden" 
            aria-label="Send feedback"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-tiktok-red/10 to-tiktok-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Mail className="w-5 h-5 text-tiktok-cyan animate-pulse" />
            <span className="hidden sm:inline font-bold text-xs tracking-wide relative z-10">FEEDBACK</span>
          </a>
        )}

        {isChat && (
          <div className="flex-grow flex justify-center items-center">
             <div className="bg-tiktok-cyan/10 px-4 py-2 rounded-xl border border-tiktok-cyan/30 flex items-center gap-3 relative overflow-hidden tech-border-animate">
                <div className="tech-scan-overlay"></div>
                <div className="w-2.5 h-2.5 bg-tiktok-cyan rounded-full animate-pulse shadow-[0_0_15px_#2af2ff] relative z-10"></div>
                <div className="flex relative z-10">
                  {"Developer is Live".split('').map((char, i) => (
                    <span 
                      key={i} 
                      className={`text-[11px] font-black uppercase tracking-widest leading-none letter-animate ${char === ' ' ? 'mr-1' : ''}`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
             </div>
          </div>
        )}

        {/* Empty div to balance the layout when back button is present */}
        {isChat && <div className="w-24"></div>}
      </div>
    </header>
  );
};
