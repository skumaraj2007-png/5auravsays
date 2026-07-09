/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a beautiful retro mechanical typewriter keyboard keydown sound.
 * Highly satisfying for the creative distraction-free writing pad.
 */
export function playTypewriterClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Triangle wave sweep for the solid strike
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 40, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600 + Math.random() * 200, ctx.currentTime + 0.02);
    
    // Ultra-fast decay
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
    
    // Add friction/noise burst (paper/metal strike)
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.015, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.012, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1500, ctx.currentTime);
    
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noiseNode.start();
  } catch (e) {
    // Graceful fallback if audio context fails
  }
}

let ambientOscs: OscillatorNode[] = [];
let ambientGains: GainNode[] = [];
let lfo: OscillatorNode | null = null;
let filter: BiquadFilterNode | null = null;
let masterGain: GainNode | null = null;

/**
 * Start a lush, warm, slow-modulating meditative ambient synthesizer drone
 * mimicking wind, deep space, or rustling leaves.
 */
export function startAmbientDrone() {
  try {
    const ctx = getAudioContext();
    if (ambientOscs.length > 0) return; // Already running
    
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2.5); // Warm, slow fade-in
    
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);
    
    // Lush open chord (A2, E3, B3, C#4) for an nostalgic, reassuring soundscape
    const notes = [110.00, 164.81, 246.94, 277.18];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Slight detune to create a wide, beautiful chorusing effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 12, ctx.currentTime);
      
      const individualVol = idx === 0 ? 0.07 : 0.04;
      oscGain.gain.setValueAtTime(individualVol, ctx.currentTime);
      
      osc.connect(oscGain);
      oscGain.connect(filter!);
      
      osc.start();
      ambientOscs.push(osc);
      ambientGains.push(oscGain);
    });
    
    // Low frequency oscillator to slowly wave the filter cut-off like sea tides
    lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.06, ctx.currentTime); // Very slow frequency, 16s cycle
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(90, ctx.currentTime); // Sweeping cut-off up and down
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    lfo.start();
    
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
  } catch (e) {
    console.warn("Could not initiate ambient synthesizer:", e);
  }
}

/**
 * Fade out and terminate the ambient synthesizer drone gracefully.
 */
export function stopAmbientDrone() {
  try {
    const ctx = getAudioContext();
    if (masterGain) {
      const activeGain = masterGain;
      const activeOscs = [...ambientOscs];
      const activeLfo = lfo;
      
      activeGain.gain.setValueAtTime(activeGain.gain.value, ctx.currentTime);
      activeGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      
      setTimeout(() => {
        try {
          activeOscs.forEach(o => o.stop());
          if (activeLfo) activeLfo.stop();
        } catch (err) {}
      }, 1600);
    }
    ambientOscs = [];
    ambientGains = [];
    lfo = null;
    filter = null;
    masterGain = null;
  } catch (e) {}
}

/**
 * Play a high-quality double bell chime.
 * Used for satisfying creative feedback when a poem is saved or completed.
 */
export function playBellChime() {
  try {
    const ctx = getAudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // High A5
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6 (harmonic fifth)
    
    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.6);
    osc2.stop(ctx.currentTime + 1.6);
  } catch (e) {}
}
