
import React from 'react';
import { 
    X, 
    ExternalLink, 
    Lightbulb, 
    CircleUser,
    History,
    Trash2,
    Video
} from 'lucide-react';
import { 
    GoogleIcon,
    AppleIcon,
    TikTokIcon,
    ChatGPTIcon,
    MetaIcon,
} from './icons';

interface SideMenuProps {
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
  recentTopics: string[];
  onClearRecentTopics: () => void;
}

const ideaStarters = [
    { name: "Gaming Highlights", icon: <Lightbulb/> },
    { name: "Cooking Tutorials", icon: <Lightbulb/> },
    { name: "DIY Crafts", icon: <Lightbulb/> },
    { name: "Comedy Skits", icon: <Lightbulb/> },
    { name: "Fashion Trends", icon: <Lightbulb/> },
    { name: "Travel Vlogs", icon: <Lightbulb/> },
    { name: "Tech & Apps", icon: <Lightbulb/> },
    { name: "Websites & Digital Projects", icon: <Lightbulb/> },
    { name: "Business & Startups", icon: <Lightbulb/> },
    { name: "Personal Development", icon: <Lightbulb/> },
    { name: "Hobbies & Creativity", icon: <Lightbulb/> },
];

const researchLinks = [
    { name: "Google", href: "https://google.com", icon: <GoogleIcon className="w-5 h-5"/> },
    { name: "Apple", href: "https://www.apple.com/app-store/", icon: <AppleIcon className="w-5 h-5"/> },
    { name: "ChatGPT", href: "https://chat.openai.com/", icon: <ChatGPTIcon className="w-5 h-5"/> },
    { name: "Meta", href: "https://www.meta.com/", icon: <MetaIcon className="w-5 h-5"/> },
    { name: "TikTok", href: "https://www.tiktok.com/search", icon: <TikTokIcon className="w-5 h-5"/> },
    { name: "YouTube", href: "https://youtube.com", icon: <Video className="w-5 h-5"/> },
    { name: "Developer Site", href: "https://www.kaimax-in-technology.mystrikingly.com", icon: <CircleUser className="w-5 h-5"/> },
];

export const SideMenu: React.FC<SideMenuProps> = ({ onClose, onSelectTopic, recentTopics, onClearRecentTopics }) => {
  return (
    <div className="fixed inset-0 z-30" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Side Menu Panel */}
      <div className="fixed top-0 left-0 bottom-0 w-72 bg-tiktok-card border-r border-tiktok-border shadow-2xl flex flex-col animate-slide-in-left">
        <div className="flex items-center justify-between p-4 border-b border-tiktok-border">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-8">
            
            {/* Recent Topics */}
            {recentTopics.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Topics</h3>
                        <button 
                            onClick={onClearRecentTopics}
                            className="p-1 text-gray-500 hover:text-tiktok-red transition-colors"
                            title="Clear Recent Topics"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {recentTopics.map((topic, index) => (
                            <button 
                                key={`${topic}-${index}`} 
                                onClick={() => onSelectTopic(topic)} 
                                className="w-full flex items-center text-left px-3 py-2 text-gray-200 hover:bg-tiktok-cyan/10 hover:text-tiktok-cyan rounded-md transition-colors group"
                            >
                                <span className="mr-3 text-gray-500 group-hover:text-tiktok-cyan">
                                    <History className="w-4 h-4" />
                                </span>
                                <span className="truncate">{topic}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Idea Starters */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Idea Starters</h3>
                <div className="space-y-2">
                    {ideaStarters.map(starter => (
                        <button key={starter.name} onClick={() => onSelectTopic(starter.name)} className="w-full flex items-center text-left px-3 py-2 text-gray-200 hover:bg-tiktok-cyan/10 hover:text-tiktok-cyan rounded-md transition-colors">
                            <span className="mr-3 text-tiktok-cyan/80">{React.cloneElement(starter.icon, { className: 'w-5 h-5' })}</span>
                            <span>{starter.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Research Directory */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Research Directory</h3>
                 <div className="space-y-2">
                    {researchLinks.map(link => (
                        <a 
                            key={link.name} 
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-between text-left px-3 py-2 text-gray-200 hover:bg-white/5 rounded-md transition-colors group"
                        >
                            <div className="flex items-center">
                                <span className="mr-3 text-gray-400">{link.icon}</span>
                                <span>{link.name}</span>
                            </div>
                           <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
