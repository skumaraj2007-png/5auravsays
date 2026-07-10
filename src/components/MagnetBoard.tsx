/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, RotateCcw, Copy, Check, Save, HelpCircle, X } from 'lucide-react';
import { playTypewriterClick, playBellChime } from '../utils/audio';

interface MagnetBoardProps {
  onSavePoem: (poem: { title: string; author: string; content: string; theme: string; alignment: 'center' }) => void;
  onClose: () => void;
}

const SHAYARI_MAGNETS = [
  "Dil", "Pyaar", "Ishq", "Yaadein", "Tum", "Hum", "Dhadkan", "Zindagi", "Humsafar", "Chaand", "Sanam", 
  "Mohabbat", "Aankhein", "Sukoon", "Deewana", "Dua", "Dard", "Afsana", "Silsila", "Arzoo"
];

const WHIMSICAL_MAGNETS = [
  "cat", "coffee", "typewriter", "whiskeys", "dances", "screams", "glitches", "quantum", "chaos", "fluffy", 
  "hungry", "banana", "refrigerator", "muse", "ghost", "existential", "tea", "butterflies", "rain", 
  "shadows", "stars", "whispers", "gravity", "music", "silent", "lost", "wild", "softly", "forever", "today"
];

const CONNECTORS = [
  "is", "the", "with", "my", "your", "our", "under", "in", "and", "but", "or", "not", "always", "never", 
  "why", "so", "beautiful", "crazy", "romantic", "secretly", "singing", "dreaming", "burning", "floating"
];

export const MagnetBoard: React.FC<MagnetBoardProps> = ({ onSavePoem, onClose }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [poemTitle, setPoemTitle] = useState('My Magnetic Verse');
  const [activeTab, setActiveTab] = useState<'hindi' | 'english' | 'connectors'>('hindi');

  const addWord = (word: string) => {
    setSelectedWords([...selectedWords, word]);
    playTypewriterClick();
  };

  const removeWordAtIndex = (index: number) => {
    const updated = [...selectedWords];
    updated.splice(index, 1);
    setSelectedWords(updated);
    playTypewriterClick();
  };

  const clearBoard = () => {
    setSelectedWords([]);
    playTypewriterClick();
  };

  const handleCopy = () => {
    if (selectedWords.length === 0) return;
    const content = selectedWords.join(' ');
    navigator.clipboard.writeText(`"${poemTitle}"\n\n${content}\n\n— Composed via Refrigerator Magnets`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (selectedWords.length === 0) return;
    const content = selectedWords.join(' ');
    onSavePoem({
      title: poemTitle || 'Magnetic Composition',
      author: 'Magnet Poet',
      content,
      theme: 'My Works',
      alignment: 'center'
    });
    playBellChime();
    setSelectedWords([]);
  };

  const handleAddCustomWord = () => {
    const custom = prompt("Enter a custom magnetic word:");
    if (custom && custom.trim()) {
      addWord(custom.trim());
    }
  };

  // Premade funny combinations to spark creativity
  const handleInjectFunny = () => {
    const combos = [
      ["Tum", "is", "my", "beautiful", "dhadkan", "and", "coffee", "is", "my", "zindagi"],
      ["Dil", "is", "secretly", "dreaming", "with", "a", "hungry", "refrigerator", "cat"],
      ["Sanam", "dances", "under", "the", "quantum", "chaos", "stars"],
      ["Mohabbat", "is", "always", "floating", "in", "tea", "and", "shadows"],
      ["Hum", "are", "lost", "in", "existential", "pyaar", "with", "fluffy", "butterflies"]
    ];
    const random = combos[Math.floor(Math.random() * combos.length)];
    setSelectedWords(random);
    playTypewriterClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white dark:bg-stone-950 p-6 rounded-2xl border border-stone-200 dark:border-stone-850 shadow-md flex flex-col justify-between h-full"
      id="magnet-board-container"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-900 pb-3 mb-4" id="magnet-header">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-light text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>🧲</span> Magnetic Poetry Refrigerator
            </h2>
            <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full font-mono">
              Funny & Cool
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Build romantic shayari or whimsical verses by picking magnetic words.
          </p>
        </div>
        <button
          onClick={onClose}
          id="btn-close-magnet-board"
          className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full text-stone-400 hover:text-stone-600 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0" id="magnet-grid-layout">
        
        {/* Left Side: The "Refrigerator" Canvas */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-stone-50 dark:bg-stone-900/40 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-4 min-h-[220px] lg:min-h-0 overflow-y-auto" id="fridge-refrigerator-canvas">
          <div className="space-y-4" id="fridge-editor">
            {/* Title */}
            <input
              type="text"
              value={poemTitle}
              onChange={(e) => setPoemTitle(e.target.value)}
              placeholder="Name your magnetic creation..."
              className="w-full text-center font-serif text-lg bg-transparent border-b border-transparent hover:border-stone-200 dark:hover:border-stone-800 focus:border-stone-300 dark:focus:border-stone-700 pb-1 text-stone-800 dark:text-stone-100 focus:outline-none placeholder-stone-400"
            />

            {/* Magnets Placement Container */}
            <div className="min-h-[140px] p-4 bg-white/70 dark:bg-stone-950/50 rounded-xl border border-stone-150 dark:border-stone-900 flex flex-wrap gap-2 items-center justify-center content-center relative" id="fridge-magnet-plate">
              {selectedWords.length === 0 ? (
                <div className="text-center text-xs text-stone-400 dark:text-stone-500 font-mono py-8 pointer-events-none">
                  [ Click any word below to stick it to the fridge ]
                </div>
              ) : (
                <AnimatePresence>
                  {selectedWords.map((word, index) => (
                    <motion.button
                      key={`${word}-${index}`}
                      initial={{ scale: 0.8, y: 5 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      onClick={() => removeWordAtIndex(index)}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-rose-50 dark:bg-stone-850 dark:hover:bg-rose-950/20 text-stone-800 dark:text-stone-200 hover:text-rose-700 dark:hover:text-rose-300 rounded text-xs font-mono border-b-2 border-stone-300 dark:border-stone-950 active:translate-y-0.5 transition-all cursor-pointer shadow-xs flex items-center gap-1 shrink-0"
                      title="Click to peel off"
                    >
                      <span>{word}</span>
                      <span className="text-[8px] opacity-40 text-rose-500">×</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Fridge Options Bar */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 dark:border-stone-900" id="fridge-options">
            <button
              onClick={handleInjectFunny}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-lg transition-colors cursor-pointer"
              title="Inject a random romantic or funny line"
            >
              <Sparkles size={11} />
              <span>Surprise Combo</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={clearBoard}
                disabled={selectedWords.length === 0}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 disabled:opacity-40 cursor-pointer"
                title="Clear Refrigerator"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={handleCopy}
                disabled={selectedWords.length === 0}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 disabled:opacity-40 cursor-pointer"
                title="Copy verses"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleSave}
                disabled={selectedWords.length === 0}
                className="flex items-center gap-1 px-3 py-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 disabled:opacity-40 rounded-lg text-xs font-mono cursor-pointer"
              >
                <Save size={12} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Magnets Drawer */}
        <div className="lg:col-span-5 flex flex-col justify-start" id="magnets-drawer">
          {/* Subtabs selection */}
          <div className="flex border-b border-stone-100 dark:border-stone-900 mb-3 text-xs font-mono" id="magnet-drawer-tabs">
            <button
              onClick={() => setActiveTab('hindi')}
              className={`flex-1 pb-2 border-b-2 font-medium transition-all cursor-pointer ${
                activeTab === 'hindi'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              Shayari 🥀
            </button>
            <button
              onClick={() => setActiveTab('english')}
              className={`flex-1 pb-2 border-b-2 font-medium transition-all cursor-pointer ${
                activeTab === 'english'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              Whimsy 🐾
            </button>
            <button
              onClick={() => setActiveTab('connectors')}
              className={`flex-1 pb-2 border-b-2 font-medium transition-all cursor-pointer ${
                activeTab === 'connectors'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              Connectors ⛓️
            </button>
          </div>

          {/* Words Box */}
          <div className="flex-1 overflow-y-auto max-h-[220px] lg:max-h-[300px] p-2 bg-stone-50/50 dark:bg-stone-950/20 rounded-xl border border-stone-150 dark:border-stone-900" id="magnet-scrollable-pool">
            <div className="flex flex-wrap gap-1.5" id="magnets-pool">
              {activeTab === 'hindi' &&
                SHAYARI_MAGNETS.map((word) => (
                  <button
                    key={word}
                    onClick={() => addWord(word)}
                    className="px-2 py-1 bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 rounded text-xs border border-stone-200/60 dark:border-stone-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    {word}
                  </button>
                ))}

              {activeTab === 'english' &&
                WHIMSICAL_MAGNETS.map((word) => (
                  <button
                    key={word}
                    onClick={() => addWord(word)}
                    className="px-2 py-1 bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 rounded text-xs border border-stone-200/60 dark:border-stone-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    {word}
                  </button>
                ))}

              {activeTab === 'connectors' &&
                CONNECTORS.map((word) => (
                  <button
                    key={word}
                    onClick={() => addWord(word)}
                    className="px-2 py-1 bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 rounded text-xs border border-stone-200/60 dark:border-stone-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
            </div>
          </div>

          <button
            onClick={handleAddCustomWord}
            className="mt-3 text-center text-xs font-mono border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 py-1.5 rounded-lg text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer"
          >
            + Forge Custom Magnet Word
          </button>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-900 text-center text-[9px] font-mono text-stone-400 uppercase tracking-widest" id="magnet-footer-decoration">
        ✨ MIX LANGUAGES • DISCOVER BEAUTIFUL NONSENSE
      </div>
    </motion.div>
  );
};
