/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Sparkles, Volume2, VolumeX, Eye, ArrowLeft, RefreshCw, Feather } from 'lucide-react';
import { Poem } from '../types';
import { playTypewriterClick, playBellChime } from '../utils/audio';

interface PoemWriterProps {
  onSavePoem: (poem: Omit<Poem, 'id'>) => void;
  onCancel: () => void;
}

const CREATIVE_PROMPTS = [
  "Begin with the sentence: 'The wind held an unwritten letter...'",
  "Draft a verse about a grandfather clock that ticks backward.",
  "Describe the quiet, microscopic world inside a single drop of morning dew.",
  "Weave a stanza using these three elements: *rusted key*, *constellation*, *tide*.",
  "Write about the nostalgia of a song you can't quite remember the lyrics to.",
  "Draft an ode to the light coming from a laptop screen in a completely silent room.",
  "Capture the sensory feeling of cold water meeting thirsty granite."
];

const WRITER_THEMES = ['Solitude', 'Nature', 'Love', 'Cosmos', 'Midnight'];

export const PoemWriter: React.FC<PoemWriterProps> = ({ onSavePoem, onCancel }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('Solitude');
  const [alignment, setAlignment] = useState<'left' | 'center'>('center');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePrompt, setActivePrompt] = useState(CREATIVE_PROMPTS[0]);
  const [showPromptBanner, setShowPromptBanner] = useState(true);
  const [error, setError] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Play satisfying mechanical click sound if enabled, skipping space/enter or repeated keys if desired
    if (soundEnabled) {
      playTypewriterClick();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and some verses for your poem.');
      return;
    }
    setError('');

    // Trigger physical bell chime
    if (soundEnabled) {
      playBellChime();
    }

    onSavePoem({
      title: title.trim(),
      author: author.trim() || 'Anonymous Writer',
      content: content.trim(),
      theme,
      alignment,
      isUserCreated: true
    });
  };

  const rotatePrompt = () => {
    const currentIndex = CREATIVE_PROMPTS.indexOf(activePrompt);
    const nextIndex = (currentIndex + 1) % CREATIVE_PROMPTS.length;
    setActivePrompt(CREATIVE_PROMPTS[nextIndex]);
    if (soundEnabled) playTypewriterClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="h-full flex flex-col justify-between p-2 md:p-6"
      id="creative-writer-root"
    >
      {/* Header and tools */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-900 pb-4 mb-6" id="writer-toolbar">
        <button
          onClick={onCancel}
          id="btn-writer-back"
          className="flex items-center gap-1.5 text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Exit Editor</span>
        </button>

        <div className="flex items-center gap-3" id="writer-utility-group">
          {/* Audio Keystrokes Switch */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            id="toggle-keystroke-sound"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                : 'bg-stone-50 dark:bg-stone-900/50 text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-800'
            }`}
            title="Togglesatisfying mechanical keystroke typewriter clicks"
          >
            {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>{soundEnabled ? 'Keystrokes: ON' : 'Keystrokes: Muted'}</span>
          </button>

          {/* Alignment toggle */}
          <div className="flex bg-stone-100 dark:bg-stone-900 p-0.5 rounded-lg" id="writer-alignment-tabs">
            <button
              onClick={() => setAlignment('left')}
              className={`px-2 py-1 rounded text-xs transition-all cursor-pointer ${
                alignment === 'left'
                  ? 'bg-white dark:bg-stone-850 shadow-xs text-stone-800 dark:text-stone-100'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              Left
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`px-2 py-1 rounded text-xs transition-all cursor-pointer ${
                alignment === 'center'
                  ? 'bg-white dark:bg-stone-850 shadow-xs text-stone-800 dark:text-stone-100'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              Center
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Inspiration banner */}
      <AnimatePresence mode="wait">
        {showPromptBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id="prompt-inspiration-banner"
            className="mb-6 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-150 dark:border-amber-900/40 text-stone-700 dark:text-stone-300 flex items-start gap-3 relative overflow-hidden"
          >
            <Sparkles size={16} className="text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="text-xs font-mono font-medium text-amber-800 dark:text-amber-400">
                Whisper of the Muse (Inspiration Prompt):
              </p>
              <p className="font-serif italic text-sm text-stone-800 dark:text-stone-200">
                {activePrompt}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={rotatePrompt}
                title="Next Prompt"
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
              </button>
              <button
                onClick={() => setShowPromptBanner(false)}
                className="text-[10px] font-mono text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Sheet */}
      <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between" id="poetry-write-form">
        <div className="space-y-6 flex-1 flex flex-col justify-start" id="form-inputs-group">
          {error && (
            <p className="text-xs font-mono text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900">
              ⚠️ {error}
            </p>
          )}

          {/* Title input */}
          <div className="text-center" id="writer-title-block">
            <input
              type="text"
              value={title}
              onKeyDown={handleKeyPress}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your poem a name..."
              id="write-title-input"
              className="w-full text-center font-serif text-3xl md:text-4xl font-light bg-transparent text-stone-900 dark:text-stone-50 border-b border-transparent focus:border-stone-200 dark:focus:border-stone-800 pb-2 focus:outline-none placeholder-stone-300 dark:placeholder-stone-700 transition-all"
            />
          </div>

          {/* Author & Theme Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-stone-500" id="writer-meta-inputs">
            {/* Author */}
            <div className="flex items-center gap-1.5 border-b border-transparent focus-within:border-stone-200 dark:focus-within:border-stone-800 pb-0.5">
              <span>by</span>
              <input
                type="text"
                value={author}
                onKeyDown={handleKeyPress}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Anonymous Writer"
                id="write-author-input"
                className="bg-transparent text-stone-700 dark:text-stone-300 focus:outline-none placeholder-stone-400 text-center sm:text-left min-w-[120px]"
              />
            </div>

            <span className="hidden sm:inline text-stone-300">•</span>

            {/* Theme Select */}
            <div className="flex items-center gap-1.5">
              <span>Theme:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                id="write-theme-select"
                className="bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 rounded px-2 py-0.5 focus:outline-none"
              >
                {WRITER_THEMES.map((themeOption) => (
                  <option key={themeOption} value={themeOption}>
                    {themeOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verses input */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full mt-4" id="write-verses-block">
            <textarea
              value={content}
              onKeyDown={handleKeyPress}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Pour your heart out here...

(The mechanical clicking sound will pace your rhythm.
Use the alignment switch above to align your lines.)`}
              id="write-verses-textarea"
              className={`w-full h-full min-h-[250px] bg-transparent font-serif text-lg leading-relaxed text-stone-800 dark:text-stone-200 resize-none focus:outline-none placeholder-stone-300 dark:placeholder-stone-700 ${
                alignment === 'center' ? 'text-center' : 'text-left pl-4 md:pl-8'
              }`}
            />
          </div>
        </div>

        {/* Action Panel bottom */}
        <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-900 pt-5 mt-6" id="writer-bottom-bar">
          <div className="text-[10px] font-mono text-stone-400" id="writer-stats">
            {content.split(/\s+/).filter(Boolean).length} words • {content.split('\n').length} lines
          </div>
          
          <button
            type="submit"
            id="btn-save-draft"
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-stone-100 px-5 py-2 rounded-xl text-xs font-mono font-medium shadow-sm transition-all cursor-pointer"
          >
            <Feather size={13} />
            <span>Preserve Composition</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};
