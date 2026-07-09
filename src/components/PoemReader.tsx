/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlignLeft, 
  AlignCenter, 
  Type, 
  Copy, 
  Check, 
  Trash2, 
  Minimize2, 
  Maximize2, 
  BookOpen, 
  Compass, 
  Wind,
  Plus,
  Minus
} from 'lucide-react';
import { Poem } from '../types';

interface PoemReaderProps {
  poem: Poem | null;
  onDeletePoem?: (id: string) => void;
}

export const PoemReader: React.FC<PoemReaderProps> = ({ poem, onDeletePoem }) => {
  const [alignment, setAlignment] = useState<'left' | 'center'>('center');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBreathGuide, setShowBreathGuide] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [copied, setCopied] = useState(false);

  // Sync initial poem alignment preferences if present
  useEffect(() => {
    if (poem && poem.alignment) {
      setAlignment(poem.alignment);
    } else {
      setAlignment('center');
    }
    setCopied(false);
  }, [poem]);

  // Breathing Guide Loop Logic
  useEffect(() => {
    if (!showBreathGuide) return;
    
    setBreathPhase('in');
    
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'in') return 'hold';
        if (prev === 'hold') return 'out';
        return 'in';
      });
    }, 4000); // 4 seconds per phase: 4s inhale, 4s hold, 4s exhale

    return () => clearInterval(interval);
  }, [showBreathGuide]);

  if (!poem) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center" id="reader-empty">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex items-center justify-center mx-auto" id="reader-icon-container">
            <BookOpen className="text-stone-400 dark:text-stone-600" size={24} />
          </div>
          <h3 className="font-serif text-xl font-light text-stone-700 dark:text-stone-300">
            A Haven for Verses
          </h3>
          <p className="text-sm text-stone-400 dark:text-stone-500 font-sans leading-relaxed">
            Select an ink composition from the ledger on the left, or compose a new work to experience distraction-free reading.
          </p>
        </motion.div>
      </div>
    );
  }

  // Determine font size class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-base md:text-lg';
      case 'md': return 'text-lg md:text-xl leading-relaxed';
      case 'lg': return 'text-xl md:text-2xl leading-loose';
      case 'xl': return 'text-2xl md:text-3xl leading-loose';
    }
  };

  const handleCopy = () => {
    const textToCopy = `"${poem.title}"\nby ${poem.author}\n\n${poem.content}\n\n— Shared via Poetry App`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={poem.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        id={`reader-view-${poem.id}`}
        className={`relative h-full flex flex-col justify-between ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-stone-50 dark:bg-stone-950 p-6 md:p-12 overflow-y-auto' 
            : 'p-2 md:p-6'
        }`}
      >
        {/* Top toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-900 pb-4 mb-6" id="reader-toolbar">
          <div className="flex items-center gap-1.5" id="alignment-font-controls">
            {/* Font Family Toggle */}
            <button
              onClick={() => setFontFamily(prev => prev === 'serif' ? 'sans' : 'serif')}
              title="Toggle Font Style"
              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all cursor-pointer"
            >
              <Type size={16} />
            </button>

            {/* Alignment Toggles */}
            <button
              onClick={() => setAlignment('left')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                alignment === 'left' 
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200' 
                  : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
              title="Left Align"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                alignment === 'center' 
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200' 
                  : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
              title="Center Align"
            >
              <AlignCenter size={16} />
            </button>

            <span className="w-px h-4 bg-stone-200 dark:bg-stone-800 mx-1"></span>

            {/* Font Size Selector */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (fontSize === 'xl') setFontSize('lg');
                  else if (fontSize === 'lg') setFontSize('md');
                  else if (fontSize === 'md') setFontSize('sm');
                }}
                disabled={fontSize === 'sm'}
                className="p-1 rounded text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900 disabled:opacity-30 cursor-pointer"
                title="Decrease Size"
              >
                <Minus size={14} />
              </button>
              <span className="text-[10px] font-mono text-stone-400 w-6 text-center uppercase">
                {fontSize}
              </span>
              <button
                onClick={() => {
                  if (fontSize === 'sm') setFontSize('md');
                  else if (fontSize === 'md') setFontSize('lg');
                  else if (fontSize === 'lg') setFontSize('xl');
                }}
                disabled={fontSize === 'xl'}
                className="p-1 rounded text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900 disabled:opacity-30 cursor-pointer"
                title="Increase Size"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2" id="utility-controls">
            {/* Breath Guide Toggle */}
            <button
              onClick={() => setShowBreathGuide(!showBreathGuide)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer ${
                showBreathGuide
                  ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/30 dark:border-teal-900 dark:text-teal-300'
                  : 'bg-transparent border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              title="Toggle Rhythmic Breathing Cadence Helper"
            >
              <Wind size={12} className={showBreathGuide ? 'animate-spin-slow' : ''} />
              <span>{showBreathGuide ? 'Breathing Guide ON' : 'Pace Guide'}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all cursor-pointer flex items-center justify-center"
              title="Copy to Clipboard"
            >
              {copied ? <Check size={16} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={16} />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all cursor-pointer flex items-center justify-center"
              title={isFullscreen ? "Exit Focus Mode" : "Focus Mode"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Delete button (only for user-created poems) */}
            {poem.isUserCreated && onDeletePoem && (
              <button
                onClick={() => {
                  if (confirm('Are you certain you wish to purge this composition from your archives?')) {
                    onDeletePoem(poem.id);
                  }
                }}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                title="Delete Poem"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Poem Core Content Page */}
        <div className="flex-1 flex flex-col justify-center py-6 overflow-y-auto max-w-2xl mx-auto w-full select-text" id="poetry-scrollable-sheet">
          <div className="text-center mb-8" id="poem-title-section">
            <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-stone-900 dark:text-stone-50 transition-colors">
              {poem.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-6 h-px bg-stone-300 dark:bg-stone-700"></span>
              <p className="font-serif italic text-sm text-stone-500 dark:text-stone-400">
                {poem.author}
              </p>
              <span className="w-6 h-px bg-stone-300 dark:bg-stone-700"></span>
            </div>
            {poem.createdAt && (
              <p className="text-[10px] font-mono text-stone-400 mt-2">
                Drafted on {poem.createdAt}
              </p>
            )}
          </div>

          <div
            id="poem-verse-content"
            className={`font-serif ${getFontSizeClass()} ${
              alignment === 'center' ? 'text-center' : 'text-left pl-4 md:pl-12'
            } ${
              fontFamily === 'serif' ? 'font-serif' : 'font-sans'
            } text-stone-700 dark:text-stone-300 whitespace-pre-line tracking-wide leading-relaxed max-w-xl mx-auto transition-all`}
          >
            {poem.content}
          </div>
        </div>

        {/* Breath Guide Display overlay */}
        {showBreathGuide && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center justify-center p-4 border border-teal-100 dark:border-teal-950 bg-teal-50/40 dark:bg-teal-950/10 rounded-2xl max-w-sm mx-auto w-full mt-6"
            id="breath-cadence-meter"
          >
            <div className="relative flex items-center justify-center w-14 h-14" id="breath-circle-container">
              {/* Pulsing breathing bubble */}
              <motion.div
                animate={{
                  scale: breathPhase === 'in' ? 1.5 : breathPhase === 'hold' ? 1.5 : 0.8,
                  opacity: breathPhase === 'hold' ? 0.9 : 0.5
                }}
                transition={{
                  duration: 4,
                  ease: 'easeInOut'
                }}
                className="absolute w-8 h-8 rounded-full bg-teal-300/40 dark:bg-teal-700/30"
              />
              <Wind className="text-teal-600 dark:text-teal-400 absolute" size={18} />
            </div>
            
            <p className="text-xs font-mono font-medium tracking-widest text-teal-800 dark:text-teal-300 uppercase mt-2">
              {breathPhase === 'in' && 'Breathe In Slowly...'}
              {breathPhase === 'hold' && 'Pause & Reflect...'}
              {breathPhase === 'out' && 'Exhale Gently...'}
            </p>
            <p className="text-[10px] font-sans text-stone-400 dark:text-stone-500 mt-1">
              Synchronize your cadence to absorb the rhyme deeply
            </p>
          </motion.div>
        )}

        {/* Footer info decoration */}
        <div className="text-center text-[10px] font-mono text-stone-400 dark:text-stone-600 border-t border-stone-100 dark:border-stone-900 pt-4 mt-6" id="reader-footer-decor">
          🖋️ THE SILENT INK LEDGER • ALL TIMELESS COMPOSITIONS
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
