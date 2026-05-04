import React from 'react';
import { motion } from 'framer-motion';
import { 
    Lightbulb, 
    KeyRound, 
    AlignLeft, 
    ExternalLink,
    Share2,
    Download,
    Copy,
    Check,
    X,
    MessageCircle,
    Sparkles,
    Loader2
} from 'lucide-react';
import { type Idea, type BlogPostIdea } from '../types';
import { summarizeIdea } from '../services/geminiService';

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
    const [copied, setCopied] = React.useState(false);
    const [summary, setSummary] = React.useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = React.useState(false);

    const imageUrl = idea.imageKeyword 
        ? `https://loremflickr.com/800/450/${encodeURIComponent(idea.imageKeyword)}`
        : null;

    const handleSummarize = async () => {
        if (summary) {
            setSummary(null);
            return;
        }
        setIsSummarizing(true);
        try {
            const contentToSummarize = `Title: ${idea.title}\nConcept: ${idea.concept}\nOutline: ${idea.outline.join(' | ')}\nKeywords: ${idea.keywords.join(', ')}`;
            const result = await summarizeIdea(contentToSummarize);
            setSummary(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleCopy = () => {
        const text = `${idea.title.toUpperCase()}\n\n${idea.concept}\n\n${idea.visualSuggestion ? `[Visual Idea]: ${idea.visualSuggestion}\n` : ''}\nShared via Benjamin Idea Generator`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadImage = async () => {
        if (!imageUrl) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${idea.title.replace(/\s+/g, '-').toLowerCase()}-image.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    const handleShareBtn = async () => {
        try {
            const shareData: ShareData = {
                title: idea.title,
                text: `${idea.title.toUpperCase()}\n\n${idea.concept}\n\nShared via Benjamin Idea Generator`,
                url: window.location.href
            };

            // Attempt to include image file if supported
            if (imageUrl && navigator.canShare && navigator.canShare({ files: [] as File[] })) {
                try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const file = new File([blob], `${idea.title.replace(/\s+/g, '-').toLowerCase()}.jpg`, { type: 'image/jpeg' });
                    
                    if (navigator.canShare({ files: [file] })) {
                        shareData.files = [file];
                    }
                } catch (imgErr) {
                    console.warn('Could not fetch image for sharing', imgErr);
                }
            }

            await navigator.share(shareData);
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error('Error sharing', err);
                handleCopy();
            }
        }
    };

    const shareUrl = window.location.href;
    const shareText = `${idea.title} - Generated by Benjamin Idea Generator`;

    const socialLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };

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
                    
                    {/* Action buttons on image hover */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button 
                            onClick={handleDownloadImage}
                            className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-tiktok-cyan hover:text-black transition-all cursor-pointer"
                            title="Download Image"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight flex items-center pr-4">
                        <Lightbulb className="w-5 h-5 mr-3 text-tiktok-red flex-shrink-0" />
                        {idea.title}
                    </h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCopy}
                            className="text-gray-400 hover:text-tiktok-cyan transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                
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

                {summary && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-tiktok-cyan/5 border border-tiktok-cyan/20 rounded-xl relative overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-2 text-tiktok-cyan font-bold text-[10px] uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" />
                            Executive Summary
                        </div>
                        <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {summary}
                        </div>
                        <button 
                            onClick={() => setSummary(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-white"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}

                <div className="mt-6 pt-4 border-t border-tiktok-border/30 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="flex gap-3 mr-2">
                            <a 
                                href={socialLinks.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </a>
                            <a 
                                href={socialLinks.whatsapp} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-[#25D366] transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>
                        
                        <button 
                            onClick={handleSummarize}
                            disabled={isSummarizing}
                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${summary ? 'bg-tiktok-cyan text-black border-tiktok-cyan' : 'text-tiktok-cyan border-tiktok-cyan/30 hover:border-tiktok-cyan hover:bg-tiktok-cyan/5'}`}
                        >
                            {isSummarizing ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Sparkles className="w-3 h-3" />
                            )}
                            {summary ? 'Summary Ready' : 'Summarize'}
                        </button>
                    </div>
                    
                    <button 
                        onClick={handleShareBtn}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-tiktok-cyan hover:text-white transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Share Idea
                    </button>
                </div>
            </div>

            {/* Scan animation in footer */}
            <div className="footer-scan-line" />
        </motion.div>
    );
};
