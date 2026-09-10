/**
 * OoT3D Nintendo 3DS Web Audio Synthesizer Engine
 * Generates authentic tones for Ocarina, Chiptune, Harp, Strings, and custom sequences.
 */

// Note to frequency map
export const NOTE_FREQUENCIES: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66, // OoT Ocarina 'A'
  E4: 329.63,
  F4: 349.23, // OoT Ocarina 'C-Down'
  G4: 392.0,
  A4: 440.0, // OoT Ocarina 'C-Right'
  B4: 493.88, // OoT Ocarina 'C-Left'
  C5: 523.25,
  D5: 587.33, // OoT Ocarina 'C-Up'
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
};

export type InstrumentType = 'ocarina' | 'chiptune' | 'harp' | 'strings' | 'brass';

export interface NoteEvent {
  note: string;
  duration: number; // in beats, e.g. 0.5 or 1
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private activeOscillators: { stop: () => void }[] = [];
  private isPlayingSequence = false;
  private sequenceTimer: any = null;

  public getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol / 100));
      this.masterGain.gain.setValueAtTime(clamped * 0.4, this.ctx.currentTime);
    }
  }

  public playNote(
    note: string,
    durationSec: number = 0.4,
    instrument: InstrumentType = 'ocarina',
    volume: number = 1.0
  ) {
    const ctx = this.getContext();
    const freq = NOTE_FREQUENCIES[note] || 440;
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.connect(this.masterGain!);

    if (instrument === 'ocarina') {
      // Primary sine + subtle triangle harmonic for sweet breathy ocarina flute
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const harmGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now);
      harmGain.gain.setValueAtTime(0.12, now);

      // Vibrato LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz subtle vibrato
      lfoGain.gain.setValueAtTime(4, now);
      lfo.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + durationSec);

      // ADSR Envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.8 * volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.5 * volume, now + durationSec * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      oscHarmonic.connect(harmGain);
      harmGain.connect(gain);
      osc.connect(gain);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + durationSec);
      oscHarmonic.stop(now + durationSec);

      this.activeOscillators.push({
        stop: () => {
          try {
            osc.stop();
            oscHarmonic.stop();
            lfo.stop();
          } catch {}
        },
      });
    } else if (instrument === 'chiptune') {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + durationSec);

      this.activeOscillators.push({
        stop: () => {
          try {
            osc.stop();
          } catch {}
        },
      });
    } else if (instrument === 'harp') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Quick plucked attack
      gain.gain.setValueAtTime(0.8 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.8);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + durationSec);

      this.activeOscillators.push({
        stop: () => {
          try {
            osc.stop();
          } catch {}
        },
      });
    } else if (instrument === 'strings') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.004, now); // slight chorus detune

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4 * volume, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec);
      osc2.stop(now + durationSec);

      this.activeOscillators.push({
        stop: () => {
          try {
            osc1.stop();
            osc2.stop();
          } catch {}
        },
      });
    } else {
      // Brass / default
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5 * volume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + durationSec);

      this.activeOscillators.push({
        stop: () => {
          try {
            osc.stop();
          } catch {}
        },
      });
    }
  }

  public playMelody(
    notes: NoteEvent[],
    bpm: number = 130,
    instrument: InstrumentType = 'ocarina',
    onStepChange?: (index: number) => void,
    onComplete?: () => void
  ) {
    this.stop();
    this.isPlayingSequence = true;

    const beatDurationSec = 60 / bpm;
    let noteIndex = 0;

    const playNext = () => {
      if (!this.isPlayingSequence || noteIndex >= notes.length) {
        this.isPlayingSequence = false;
        if (onComplete) onComplete();
        return;
      }

      const item = notes[noteIndex];
      const durationSec = item.duration * beatDurationSec;

      if (onStepChange) onStepChange(noteIndex);
      if (item.note && item.note !== 'REST') {
        this.playNote(item.note, durationSec * 0.9, instrument);
      }

      noteIndex++;
      this.sequenceTimer = setTimeout(playNext, durationSec * 1000);
    };

    playNext();
  }

  public playStepMatrix(
    steps: { step: number; pitches: string[] }[],
    bpm: number = 120,
    instrument: InstrumentType = 'ocarina',
    isLooping: boolean = true,
    onStepChange?: (step: number) => void
  ) {
    this.stop();
    this.isPlayingSequence = true;

    const stepDurationMs = (60 / bpm / 4) * 1000; // 16th notes
    let currentStep = 0;

    const stepTick = () => {
      if (!this.isPlayingSequence) return;

      const current = steps[currentStep];
      if (onStepChange) onStepChange(currentStep);

      if (current && current.pitches.length > 0) {
        for (const pitch of current.pitches) {
          this.playNote(pitch, (stepDurationMs / 1000) * 1.5, instrument);
        }
      }

      currentStep++;
      if (currentStep >= steps.length) {
        if (isLooping) {
          currentStep = 0;
        } else {
          this.isPlayingSequence = false;
          return;
        }
      }

      this.sequenceTimer = setTimeout(stepTick, stepDurationMs);
    };

    stepTick();
  }

  public stop() {
    this.isPlayingSequence = false;
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    for (const osc of this.activeOscillators) {
      try {
        osc.stop();
      } catch {}
    }
    this.activeOscillators = [];
  }

  public isPlaying(): boolean {
    return this.isPlayingSequence;
  }
}

export const soundEngine = new SoundEngine();
