
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SubMenu } from './components/SubMenu';
import { SideMenu } from './components/SideMenu';
import { DeveloperInfo } from './components/DeveloperInfo';
import { InputForm } from './components/InputForm';
import { IdeaCard } from './components/IdeaCard';
import { IdeaCardSkeleton } from './components/IdeaCardSkeleton';
import { AlertTriangleIcon, LightbulbIcon, MailIcon } from './components/icons';
import { generateIdeas } from './services/geminiService';
import { type Idea, type Platform } from './types';
import { IdeaTypeSelector, type IdeaType } from './components/IdeaTypeSelector';
import { LiveChatView } from './components/LiveChatView';

type View = 'generator' | 'developer' | 'live-chat';

// --- Components moved outside of App to prevent re-rendering issues ---

const InitialState: React.FC = () => (
  <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
    <LightbulbIcon className="w-16 h-16 mb-4 text-tiktok-cyan" />
    <h2 className="text-2xl font-bold text-white">Unlock Your Next Viral Hit</h2>
    <p className="max-w-md mt-2">Enter a topic and let our AI generate fresh, creative blog post ideas for you.</p>
  </div>
);

const ErrorState: React.FC<{ error: string | null }> = ({ error }) => (
  <div className="text-center text-tiktok-red bg-red-900/20 border border-tiktok-red/30 p-6 rounded-lg mt-10 flex flex-col items-center">
    <AlertTriangleIcon className="w-12 h-12 mb-4" />
    <h3 className="text-xl font-semibold text-white">An Error Occurred</h3>
    <p className="mt-2">{error}</p>
  </div>
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
      <Header onMenuClick={() => setIsMenuOpen(true)} onFeedbackClick={handleFeedbackClick} />
      <SubMenu activeView={activeView} setActiveView={setActiveView} />
       {isMenuOpen && (
          <SideMenu 
            onClose={() => setIsMenuOpen(false)} 
            onSelectTopic={handleSelectTopic} 
            recentTopics={recentTopics}
            onClearRecentTopics={handleClearRecentTopics}
          />
        )}
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow z-10">
        {activeView === 'generator' && (
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
        )}
        {activeView === 'developer' && <DeveloperInfo />}
        {activeView === 'live-chat' && <LiveChatView />}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm z-10 relative overflow-hidden">
        <div className="footer-scan-line"></div>
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <p>Powered by kai-webdevelopers</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 border-t sm:border-t-0 sm:border-l border-tiktok-border pt-4 sm:pt-0 sm:pl-6">
            <MailIcon className="w-5 h-5" />
            <a href="mailto:benjakaimax425@gmail.com" className="hover:text-tiktok-cyan transition-colors">benjakaimax425@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
