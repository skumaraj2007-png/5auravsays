/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Volume2, VolumeX, BookOpen, Feather, PenTool, Compass } from 'lucide-react';
import { Poem, ThemeMode } from './types';
import { CURATED_POEMS } from './data';
import { PoemList } from './components/PoemList';
import { PoemReader } from './components/PoemReader';
import { PoemWriter } from './components/PoemWriter';
import { startAmbientDrone, stopAmbientDrone, playTypewriterClick } from './utils/audio';

export default function App() {
  const [userPoems, setUserPoems] = useState<Poem[]>([]);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'detail' | 'write'>('list');

  // Load user poems & theme preferences on mount
  useEffect(() => {
    // Poems
    try {
      const saved = localStorage.getItem('user_poems');
      if (saved) {
        setUserPoems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not retrieve locally archived poems:", e);
    }

    // Theme
    const savedTheme = localStorage.getItem('poetry_theme_mode') as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme);
      updateDocumentTheme(savedTheme);
    } else {
      // Default to beautiful light warm mode, or dark if preferred
      setThemeMode('light');
      updateDocumentTheme('light');
    }

    // Default select first curated poem
    if (CURATED_POEMS.length > 0) {
      setSelectedPoemId(CURATED_POEMS[0].id);
    }
  }, []);

  const updateDocumentTheme = (mode: ThemeMode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleThemeToggle = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
    localStorage.setItem('poetry_theme_mode', nextMode);
    updateDocumentTheme(nextMode);
    
    // Play subtle audio confirmation
    playTypewriterClick();
  };

  const handleAmbientToggle = () => {
    if (isAmbientPlaying) {
      stopAmbientDrone();
      setIsAmbientPlaying(false);
    } else {
      startAmbientDrone();
      setIsAmbientPlaying(true);
    }
  };

  // Combine curated list and user items
  const allPoems = [...userPoems, ...CURATED_POEMS];

  const activePoem = allPoems.find((p) => p.id === selectedPoemId) || null;

  const handleSelectPoem = (id: string) => {
    setSelectedPoemId(id);
    setIsWritingMode(false);
    setMobileView('detail');
  };

  const handleSaveNewPoem = (newPoemData: Omit<Poem, 'id'>) => {
    const newPoem: Poem = {
      ...newPoemData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    const updated = [newPoem, ...userPoems];
    setUserPoems(updated);
    localStorage.setItem('user_poems', JSON.stringify(updated));

    // Focus on the newly written poem
    setSelectedPoemId(newPoem.id);
    setIsWritingMode(false);
    setMobileView('detail');
  };

  const handleDeletePoem = (id: string) => {
    const updated = userPoems.filter((p) => p.id !== id);
    setUserPoems(updated);
    localStorage.setItem('user_poems', JSON.stringify(updated));

    // Reset view to default curated poem
    if (selectedPoemId === id) {
      if (CURATED_POEMS.length > 0) {
        setSelectedPoemId(CURATED_POEMS[0].id);
      } else {
        setSelectedPoemId(null);
      }
      setMobileView('list');
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#FAF7F2] text-stone-800 dark:bg-[#0E0D0C] dark:text-stone-100 transition-colors duration-500 flex flex-col font-sans selection:bg-amber-100 dark:selection:bg-amber-950/50"
      id="app-root"
    >
      {/* Primary Global Navigation Header */}
      <header className="border-b border-stone-200/60 dark:border-stone-900 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#FAF7F2]/90 dark:bg-[#0E0D0C]/90 backdrop-blur-sm z-40 transition-colors" id="app-header">
        <div className="flex items-center gap-2.5" id="logo-block">
          <div className="w-8 h-8 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-50 dark:text-stone-950 flex items-center justify-center shadow-xs" id="logo-icon">
            <Feather size={14} className="transform rotate-45" />
          </div>
          <div>
            <h1 className="font-serif text-lg tracking-wider font-light uppercase">The Silent Ink</h1>
            <p className="text-[9px] font-mono tracking-widest text-stone-400 uppercase mt-0.5">Mindful Poetry Sanctuary</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3" id="global-control-toolbar">
          {/* Ambient Audio Synth Switcher */}
          <button
            onClick={handleAmbientToggle}
            id="global-ambient-toggle"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer ${
              isAmbientPlaying
                ? 'bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-300'
                : 'bg-transparent border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            title="Toggle soothing meditative background synthesizer"
          >
            {isAmbientPlaying ? (
              <>
                <Volume2 size={13} className="text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">Sound Active</span>
                <span className="flex gap-0.5 items-end h-3 pb-0.5">
                  <span className="w-0.5 bg-teal-600 dark:bg-teal-400 rounded-xs animate-bar-pulse h-1.5" />
                  <span className="w-0.5 bg-teal-600 dark:bg-teal-400 rounded-xs animate-bar-pulse-delayed h-3" />
                  <span className="w-0.5 bg-teal-600 dark:bg-teal-400 rounded-xs animate-bar-pulse h-2" />
                </span>
              </>
            ) : (
              <>
                <VolumeX size={13} />
                <span className="hidden sm:inline">Play Ambient</span>
              </>
            )}
          </button>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={handleThemeToggle}
            id="global-theme-toggle"
            className="p-2 rounded-full border border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer"
            title={themeMode === 'light' ? 'Set Dark Atmosphere' : 'Set Warm Paper Atmosphere'}
          >
            {themeMode === 'light' ? (
              <Moon size={14} className="text-stone-600" />
            ) : (
              <Sun size={14} className="text-stone-200" />
            )}
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden" id="main-content-grid">
        
        {/* Left Column: Index (PoemList) */}
        {/* On mobile, hidden unless mobileView is 'list' */}
        <section 
          className={`md:col-span-5 lg:col-span-4 h-[calc(100vh-140px)] border-r-0 md:border-r border-stone-200/50 dark:border-stone-900/60 overflow-hidden ${
            mobileView === 'list' ? 'block' : 'hidden md:block'
          }`}
          id="panel-left-index"
        >
          <PoemList
            poems={allPoems}
            selectedPoemId={selectedPoemId}
            onSelectPoem={handleSelectPoem}
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isWritingMode={isWritingMode}
            onWriteClick={() => {
              setIsWritingMode(true);
              setMobileView('write');
            }}
          />
        </section>

        {/* Right Column: Stage (PoemReader or PoemWriter) */}
        {/* On mobile, hidden unless mobileView is 'detail' or 'write' */}
        <section 
          className={`md:col-span-7 lg:col-span-8 h-[calc(100vh-140px)] flex flex-col justify-between overflow-y-auto ${
            mobileView !== 'list' ? 'block' : 'hidden md:block'
          }`}
          id="panel-right-stage"
        >
          {/* Back Button for mobile view overlays */}
          {mobileView !== 'list' && (
            <div className="md:hidden mb-4" id="mobile-back-button-bar">
              <button
                onClick={() => setMobileView('list')}
                id="btn-mobile-back"
                className="flex items-center gap-1 text-xs font-mono text-stone-500 hover:text-stone-850 dark:hover:text-stone-200"
              >
                <span>← Back to ledger</span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isWritingMode ? (
              <PoemWriter
                key="poetry-writer"
                onSavePoem={handleSaveNewPoem}
                onCancel={() => {
                  setIsWritingMode(false);
                  setMobileView('detail');
                }}
              />
            ) : (
              <PoemReader
                key={activePoem ? activePoem.id : 'empty-reader'}
                poem={activePoem}
                onDeletePoem={handleDeletePoem}
              />
            )}
          </AnimatePresence>
        </section>

      </main>
    </div>
  );
}
