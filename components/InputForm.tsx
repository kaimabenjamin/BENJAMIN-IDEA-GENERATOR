
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wand2Icon, LoaderCircleIcon } from './icons';
import { generateSuggestions } from '../services/geminiService';

interface InputFormProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
  topic: string;
  setTopic: (topic: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading, topic, setTopic }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const debounceTimeout = useRef<number | null>(null);

  const fetchSuggestions = useCallback(async () => {
    if (!topic.trim() || topic.trim().length < 3) return;
    setIsSuggesting(true);
    const newSuggestions = await generateSuggestions(topic);
    setSuggestions(newSuggestions);
    setIsSuggesting(false);
  }, [topic]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (topic.trim().length > 2 && !isLoading) {
      debounceTimeout.current = window.setTimeout(() => {
        fetchSuggestions();
      }, 500);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [topic, isLoading, fetchSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]);
    onGenerate(topic);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="topic-input" className="block text-sm font-medium text-gray-300 mb-2">
        Enter a Topic or Keyword
      </label>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          id="topic-input"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'summer recipes', 'AI productivity hacks', 'travel vlog ideas'"
          className="flex-grow bg-tiktok-input border border-tiktok-border rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tiktok-cyan transition-all duration-200"
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="flex items-center justify-center bg-gradient-to-r from-tiktok-red to-tiktok-cyan text-white font-bold py-3 px-6 rounded-md transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            'Generating...'
          ) : (
            <>
              <Wand2Icon className="w-5 h-5 mr-2" />
              Generate Ideas
            </>
          )}
        </button>
      </div>

      {(isSuggesting || suggestions.length > 0) && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              AI Suggestions
            </h4>
            {isSuggesting && <LoaderCircleIcon className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-tiktok-input border border-tiktok-border text-gray-300 text-sm px-3 py-1.5 rounded-full hover:bg-tiktok-cyan/10 hover:text-tiktok-cyan hover:border-tiktok-cyan/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};
