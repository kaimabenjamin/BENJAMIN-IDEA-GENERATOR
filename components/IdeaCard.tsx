import React from 'react';
import { motion } from 'framer-motion';
import { 
    Lightbulb, 
    KeyRound, 
    AlignLeft, 
    ExternalLink 
} from 'lucide-react';
import { type Idea, type BlogPostIdea } from '../types';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
    const renderValue = () => {
        if (!Array.isArray(value)) {
            return <p className="text-white text-sm">{value}</p>;
        }

        const lowerLabel = label.toLowerCase();
        const areKeywords = lowerLabel.includes('keywords');

        return (
            <div className="flex flex-wrap gap-2 mt-1">
                {value.map((item, index) => {
                    const cleanItem = item.replace(/#/g, '');
                    let link = '';
                    let displayItem = cleanItem;

                    if (areKeywords) {
                        link = `https://www.google.com/search?q=${encodeURIComponent(cleanItem)}`;
                    }

                    if (link) {
                         return (
                            <a 
                                key={index} 
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-tiktok-cyan hover:text-tiktok-bg transition-colors duration-200 flex items-center gap-1.5"
                            >
                                {displayItem}
                                <ExternalLink className="w-3 h-3 opacity-70" />
                            </a>
                        );
                    }
                    
                    return (
                        <span key={index} className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
                           {cleanItem}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex items-start mt-4">
            <div className="flex-shrink-0 text-tiktok-cyan mt-1">{icon}</div>
            <div className="ml-3 w-full">
                <h4 className="text-sm font-semibold text-gray-400">{label}</h4>
                {renderValue()}
            </div>
        </div>
    );
};


const BlogPostDetails: React.FC<{ idea: BlogPostIdea }> = ({ idea }) => (
    <>
        <InfoRow icon={<AlignLeft className="w-5 h-5" />} label="Meta Description" value={idea.metaDescription} />
        <InfoRow icon={<AlignLeft className="w-5 h-5" />} label="Outline" value={idea.outline.join(' -> ')} />
        <InfoRow icon={<KeyRound className="w-5 h-5" />} label="Keywords" value={idea.keywords} />
    </>
);

export const IdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => {
    const imageUrl = idea.imageKeyword 
        ? `https://loremflickr.com/800/450/${encodeURIComponent(idea.imageKeyword)}`
        : null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-tiktok-card border border-tiktok-border rounded-lg p-0 shadow-lg transition-all duration-300 hover:border-tiktok-cyan hover:shadow-2xl hover:shadow-tiktok-cyan/10 group flex flex-col relative overflow-hidden"
        >
            {imageUrl && (
                <div className="w-full h-48 overflow-hidden relative">
                    <img 
                        src={imageUrl} 
                        alt={idea.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tiktok-bg to-transparent opacity-60"></div>
                </div>
            )}
            <div className="p-6">
                <h3 className="text-lg font-bold text-white leading-tight flex items-center">
                    <Lightbulb className="w-5 h-5 mr-3 text-tiktok-red flex-shrink-0" />
                    {idea.title}
                </h3>
                <p className="text-gray-300 mt-2 text-sm flex-grow">{idea.concept}</p>
                
                {idea.visualSuggestion && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 italic text-xs text-gray-400">
                        <span className="font-semibold not-italic text-tiktok-cyan mr-1">Visual Idea:</span>
                        {idea.visualSuggestion}
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-tiktok-border/50">
                    <BlogPostDetails idea={idea} />
                </div>
            </div>

            {/* Scan animation in footer */}
            <div className="footer-scan-line" />
        </motion.div>
    );
};
