/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Feather, PenTool, CheckCircle, BookOpen, User, Archive } from 'lucide-react';
import { Poem } from '../types';
import { THEME_MOODS } from '../data';

interface PoemListProps {
  poems: Poem[];
  selectedPoemId: string | null;
  onSelectPoem: (poemId: string) => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onWriteClick: () => void;
  isWritingMode: boolean;
}

export const PoemList: React.FC<PoemListProps> = ({
  poems,
  selectedPoemId,
  onSelectPoem,
  activeTheme,
  setActiveTheme,
  searchQuery,
  setSearchQuery,
  onWriteClick,
  isWritingMode
}) => {
  // Filter poems by theme and search query
  const filteredPoems = poems.filter((poem) => {
    const matchesTheme =
      activeTheme === 'All' ||
      (activeTheme === 'My Works' && poem.isUserCreated) ||
      (activeTheme !== 'My Works' && poem.theme === activeTheme && !poem.isUserCreated);
    
    const matchesSearch =
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTheme && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex flex-col h-full pr-0 md:pr-6" id="poem-list-container">
      {/* Action panel */}
      <div className="mb-6 flex items-center justify-between" id="list-action-panel">
        <div>
          <h2 className="font-serif text-2xl font-light tracking-wide text-stone-800 dark:text-stone-100 transition-colors">
            Poetic Verses
          </h2>
          <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-1">
            {filteredPoems.length} {filteredPoems.length === 1 ? 'composition' : 'compositions'} found
          </p>
        </div>
        <button
          onClick={onWriteClick}
          id="btn-trigger-pad"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all duration-300 ${
            isWritingMode
              ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300'
              : 'bg-stone-900 border-stone-800 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:border-stone-200 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm cursor-pointer'
          }`}
        >
          <PenTool size={13} />
          {isWritingMode ? 'Viewing Pad' : 'Write Original'}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6" id="search-container">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 dark:text-stone-500">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Seek a phrase, title, or bard..."
          id="search-input"
          className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-lg placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-400 dark:focus:border-stone-700 transition-all font-sans"
        />
      </div>

      {/* Categories Filter Horizontal scroll */}
      <div className="mb-6 overflow-x-auto scrollbar-none flex gap-1.5 pb-2" id="categories-filter-strip">
        {THEME_MOODS.map((mood) => {
          const isActive = activeTheme === mood.name;
          return (
            <button
              key={mood.name}
              onClick={() => setActiveTheme(mood.name)}
              id={`filter-mood-${mood.name.toLowerCase()}`}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium border border-stone-300 dark:border-stone-700'
                  : 'bg-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 border border-transparent'
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.name}</span>
            </button>
          );
        })}
      </div>

      {/* Poem Index List */}
      <div className="flex-1 overflow-y-auto pr-1" id="scrolling-poem-index">
        {filteredPoems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center" id="empty-state">
            <Feather size={32} className="text-stone-300 dark:text-stone-700 mb-3 animate-pulse" />
            <p className="font-serif text-base text-stone-600 dark:text-stone-400">The page remains blank.</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 font-mono">Adjust your filtering or begin writing.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
            id="poem-index-grid"
          >
            {filteredPoems.map((poem) => {
              const isSelected = selectedPoemId === poem.id && !isWritingMode;
              return (
                <motion.div
                  key={poem.id}
                  variants={itemVariants}
                  onClick={() => onSelectPoem(poem.id)}
                  id={`poem-item-${poem.id}`}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 shadow-sm'
                      : 'bg-white/40 dark:bg-stone-950/20 border-stone-150 dark:border-stone-900/60 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 hover:border-stone-250 dark:hover:border-stone-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200 leading-tight">
                      {poem.title}
                    </h3>
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded-md text-stone-500 dark:text-stone-400">
                      {poem.theme}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <User size={11} className="text-stone-400" />
                    <p className="text-xs font-sans text-stone-500 dark:text-stone-400">
                      {poem.author}
                    </p>
                    {poem.isUserCreated && (
                      <span className="flex items-center gap-0.5 text-[9px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded ml-auto">
                        <PenTool size={9} />
                        Original
                      </span>
                    )}
                  </div>

                  <p className="text-stone-400 dark:text-stone-500 text-xs italic line-clamp-2 mt-3 font-serif whitespace-pre-line border-t border-stone-100 dark:border-stone-900/50 pt-2 leading-relaxed">
                    {poem.content.substring(0, 110)}...
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};
