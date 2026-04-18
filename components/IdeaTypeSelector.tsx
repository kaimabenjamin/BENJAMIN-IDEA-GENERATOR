import React from 'react';
import { LightbulbIcon, BriefcaseIcon, BookOpenIcon, LaughIcon } from './icons';

export type IdeaType = 'Creative' | 'Business' | 'Educational' | 'Humorous';

const ideaTypes: { id: IdeaType; name: string; icon: React.ReactElement }[] = [
  { id: 'Creative', name: 'Creative', icon: <LightbulbIcon className="w-5 h-5" /> },
  { id: 'Business', name: 'Business', icon: <BriefcaseIcon className="w-5 h-5" /> },
  { id: 'Educational', name: 'Educational', icon: <BookOpenIcon className="w-5 h-5" /> },
  { id: 'Humorous', name: 'Humorous', icon: <LaughIcon className="w-5 h-5" /> },
];

interface IdeaTypeSelectorProps {
  activeType: IdeaType;
  onTypeChange: (type: IdeaType) => void;
}

export const IdeaTypeSelector: React.FC<IdeaTypeSelectorProps> = ({ activeType, onTypeChange }) => {
  const baseClasses = "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-tiktok-input focus-visible:ring-tiktok-cyan";
  const activeClasses = "bg-tiktok-card shadow-sm text-white";
  const inactiveClasses = "text-gray-400 hover:bg-white/5 hover:text-gray-200";

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Select Idea Type
      </label>
      <div className="flex items-center bg-tiktok-input p-1 rounded-lg" role="tablist" aria-orientation="horizontal">
        {ideaTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`${baseClasses} ${activeType === type.id ? activeClasses : inactiveClasses}`}
            role="tab"
            aria-selected={activeType === type.id}
          >
            {type.icon}
            <span>{type.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
