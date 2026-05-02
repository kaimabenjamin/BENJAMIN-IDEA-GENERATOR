
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lightbulb, Mail, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { SubMenu } from './components/SubMenu';
import { SideMenu } from './components/SideMenu';
import { DeveloperInfo } from './components/DeveloperInfo';
import { InputForm } from './components/InputForm';
import { IdeaCard } from './components/IdeaCard';
import { IdeaCardSkeleton } from './components/IdeaCardSkeleton';
import { generateIdeas } from './services/geminiService';
import { type Idea, type Platform } from './types';
import { IdeaTypeSelector, type IdeaType } from './components/IdeaTypeSelector';
import { LiveChatView } from './components/LiveChatView';

type View = 'generator' | 'developer' | 'live-chat';

// --- Components moved outside of App to prevent re-rendering issues ---

const InitialState: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-center text-gray-400 mt-12 flex flex-col items-center"
  >
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg mb-8 rounded-2xl overflow-hidden shadow-2xl border border-tiktok-border/50 group"
    >
      <img 
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" 
        alt="Developer Workspace" 
        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tiktok-bg via-tiktok-bg/20 to-transparent"></div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-tiktok-cyan/20 backdrop-blur-md px-4 py-1 rounded-full border border-tiktok-cyan/30 text-tiktok-cyan text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          AI-Powered Creativity
        </div>
      </div>
    </motion.div>
    <h2 className="text-3xl font-extrabold text-white tracking-tight">Unlock Your Next Viral Hit</h2>
    <p className="max-w-md mt-4 text-base text-gray-400 leading-relaxed italic">
      "Great ideas start with a spark. Let our AI be your engine for content that resonates and engages."
    </p>
  </motion.div>
);

const ErrorState: React.FC<{ error: string | null }> = ({ error }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center text-tiktok-red bg-red-900/20 border border-tiktok-red/30 p-6 rounded-lg mt-10 flex flex-col items-center"
  >
    <AlertTriangle className="w-12 h-12 mb-4" />
    <h3 className="text-xl font-semibold text-white">An Error Occurred</h3>
    <p className="mt-2">{error}</p>
  </motion.div>
);

const TechStreamOverlay: React.FC = () => (
  <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 animate-tech-scan"></div>
    {[10, 25, 40, 55, 70, 85].map((left, i) => (
       <div 
         key={i}
         className={`stream-line ${i % 2 === 0 ? 'red' : ''}`} 
         style={{ 
           left: `${left}%`, 
           animationDelay: `${i * 0.4}s`,
           animationDuration: `${2.5 + (i % 3)}s` 
         }} 
       />
    ))}
  </div>
);

interface GeneratorViewProps {
  isLoading: boolean;
  error: string | null;
  ideas: Idea[];
  onGenerate: (topic: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  ideaType: IdeaType;
  setIdeaType: (ideaType: IdeaType) => void;
}

const QUICK_CATEGORIES = [
  'Tech Trends 2024',
  'Sustainable Living',
  'Remote Work Hacks',
  'Digital Marketing',
];

const GeneratorView: React.FC<GeneratorViewProps> = ({
  isLoading,
  error,
  ideas,
  onGenerate,
  topic,
  setTopic,
  ideaType,
  setIdeaType,
}) => (
  <>
    <div className="bg-tiktok-card p-6 rounded-xl shadow-lg border border-tiktok-border z-20 relative">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quick Start Topics
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setTopic(cat);
                onGenerate(cat);
              }}
              disabled={isLoading}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400 hover:bg-tiktok-cyan/10 hover:text-tiktok-cyan hover:border-tiktok-cyan/50 transition-all disabled:opacity-50"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <IdeaTypeSelector activeType={ideaType} onTypeChange={setIdeaType} />
      <InputForm 
        onGenerate={onGenerate} 
        isLoading={isLoading}
        topic={topic}
        setTopic={setTopic}
      />
    </div>

    <div className="mt-8 relative z-20">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IdeaCardSkeleton />
          <IdeaCardSkeleton />
        </div>
      ) : error ? (
        <ErrorState error={error} />
      ) : ideas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea, index) => (
            <IdeaCard key={index} idea={idea} />
          ))}
        </div>
      ) : (
        <InitialState />
      )}
    </div>
  </>
);


const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('generator');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');
  const [ideaType, setIdeaType] = useState<IdeaType>('Creative');

  // Load recent topics from localStorage
  const [recentTopics, setRecentTopics] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('recentTopics');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const handleClearRecentTopics = () => {
    setRecentTopics([]);
    localStorage.removeItem('recentTopics');
  };

  const handleGenerateIdeas = useCallback(async (currentTopic: string) => {
    if (!currentTopic.trim()) {
      setError('Please enter a topic to get started.');
      return;
    }
    
    // Add to recent topics
    setRecentTopics(prev => {
        const filtered = prev.filter(t => t.toLowerCase() !== currentTopic.trim().toLowerCase());
        const updated = [currentTopic.trim(), ...filtered].slice(0, 10); // Limit to 10
        localStorage.setItem('recentTopics', JSON.stringify(updated));
        return updated;
    });

    setIsLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const generatedIdeas = await generateIdeas(currentTopic, ideaType);
      setIdeas(generatedIdeas);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while generating ideas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [ideaType]);

  const handleIdeaTypeChange = (newIdeaType: IdeaType) => {
    setIdeaType(newIdeaType);
    setIdeas([]);
    setError(null);
  };

  const handleSelectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setIsMenuOpen(false);
    setActiveView('generator');
  };
  
  const handleFeedbackClick = () => {
    setActiveView('developer');
  };

  return (
    <div className="min-h-screen bg-tiktok-bg text-white font-sans flex flex-col relative">
      {isLoading && <TechStreamOverlay />}
      <Header 
        onMenuClick={() => setIsMenuOpen(true)} 
        onFeedbackClick={handleFeedbackClick} 
        onHomeClick={() => setActiveView('generator')}
        activeView={activeView}
      />
      {activeView !== 'live-chat' && (
        <SubMenu activeView={activeView} setActiveView={setActiveView} />
      )}
       {isMenuOpen && (
          <SideMenu 
            onClose={() => setIsMenuOpen(false)} 
            onSelectTopic={handleSelectTopic} 
            recentTopics={recentTopics}
            onClearRecentTopics={handleClearRecentTopics}
          />
        )}
      <main className={`container mx-auto px-4 ${activeView === 'live-chat' ? 'py-0 max-w-full h-[calc(100vh-60px)]' : 'py-8 max-w-6xl'} flex-grow z-10 transition-all duration-500`}>
        {activeView === 'generator' && (
          <div className="animate-fade-in w-full">
            <GeneratorView
              isLoading={isLoading}
              error={error}
              ideas={ideas}
              onGenerate={handleGenerateIdeas}
              topic={topic}
              setTopic={setTopic}
              ideaType={ideaType}
              setIdeaType={handleIdeaTypeChange}
            />
          </div>
        )}
        {activeView === 'developer' && <div className="w-full"><DeveloperInfo /></div>}
        {activeView === 'live-chat' && <div className="w-full h-full pt-4 pb-2"><LiveChatView /></div>}
      </main>
      {activeView !== 'live-chat' && (
        <footer className="bg-tiktok-bg/80 backdrop-blur-xl border-t border-tiktok-border/30 py-12 mt-auto z-10 relative overflow-hidden">
          <div className="footer-scan-line opacity-30"></div>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tiktok-red to-tiktok-cyan flex items-center justify-center font-black text-white text-xl shadow-[0_0_20px_rgba(42,242,255,0.4)]">
                    B
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                    Benjamin <span className="text-tiktok-cyan">Generator</span>
                  </h2>
                </div>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                  Empowering content creators with next-generation AI viral content strategies. 
                  <span className="block mt-1 font-bold text-gray-600 uppercase text-[10px] tracking-widest leading-none">High-Powered Production</span>
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <a 
                    href="mailto:benjakaimax425@gmail.com" 
                    className="text-gray-400 hover:text-tiktok-cyan transition-all duration-300 flex items-center gap-2 group bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-tiktok-cyan/30"
                  >
                    <Mail className="w-5 h-5 group-hover:scale-110 group-hover:text-tiktok-cyan transition-transform" />
                    <span className="text-sm font-semibold tracking-tight">benjakaimax425@gmail.com</span>
                  </a>
                </div>
                
                <div className="flex flex-col items-center md:items-end text-[10px] uppercase font-bold tracking-[0.3em] text-gray-600 gap-2 w-full pt-6 border-t border-tiktok-border/20 md:border-t-0 md:pt-0">
                  <p className="text-gray-500">© {new Date().getFullYear()} Ben Kaima. All Rights Reserved.</p>
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">ENGINEERED BY</span>
                    <span className="text-tiktok-cyan opacity-80 hover:opacity-100 transition-opacity cursor-default">KAI-WEBDEVELOPERS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
