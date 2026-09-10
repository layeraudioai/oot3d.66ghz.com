import React, { useState, useEffect, useRef } from 'react';
import {
  AudioCategory,
  OoT3DMusicTrack,
  OoT3DScene,
  OoT3DTitleId,
  RomFsDirectory,
} from '../types/oot3d';
import {
  OCARINA_BUTTON_MAP,
  OCARINA_SONG_PRESETS,
  OcarinaPreset,
} from '../data/sampleMusic';
import {
  InstrumentType,
  NoteEvent,
  soundEngine,
} from '../utils/audioSynth';
import {
  Music,
  Play,
  Square,
  Volume2,
  VolumeX,
  Plus,
  Search,
  Sliders,
  Radio,
  Sparkles,
  Layers,
  Repeat,
  RotateCcw,
  CheckCircle2,
  Download,
  Upload,
  Disc3,
  Waves,
  Music2,
  BookmarkPlus,
  Info,
} from 'lucide-react';

interface MusicEditorProps {
  tracks: OoT3DMusicTrack[];
  onUpdateTracks: (tracks: OoT3DMusicTrack[]) => void;
  scenes: OoT3DScene[];
  onUpdateScenes: (scenes: OoT3DScene[]) => void;
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
  currentDirectory: RomFsDirectory | null;
}

const PITCH_ROWS = ['D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'A3'];

export const MusicEditor: React.FC<MusicEditorProps> = ({
  tracks,
  onUpdateTracks,
  scenes,
  onUpdateScenes,
  activeSceneId,
  onSelectScene,
  currentDirectory,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id || 'bgm_kokiri');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('ocarina');
  const [masterVolume, setMasterVolume] = useState<number>(85);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sequencer' | 'ocarina' | 'scene_matrix'>('sequencer');

  // Interactive 16-step grid state
  const [stepGrid, setStepGrid] = useState<Record<number, string[]>>({
    0: ['F4'],
    1: ['A4'],
    2: ['B4'],
    3: [],
    4: ['F4'],
    5: ['A4'],
    6: ['B4'],
    7: [],
    8: ['F4'],
    9: ['A4'],
    10: ['B4'],
    11: ['E5'],
    12: ['D5'],
    13: [],
    14: ['B4'],
    15: ['C5'],
  });

  const [sequencerBpm, setSequencerBpm] = useState<number>(130);
  const [playedNotesHistory, setPlayedNotesHistory] = useState<string[]>([]);
  const [detectedSongNotification, setDetectedSongNotification] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const selectedTrack = tracks.find((t) => t.id === selectedTrackId) || tracks[0];

  // Keep soundEngine master volume in sync
  useEffect(() => {
    soundEngine.setMasterVolume(masterVolume);
  }, [masterVolume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      soundEngine.stop();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderVisualizer = () => {
      const analyser = soundEngine.analyser;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw faint background grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let y = 10; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.85;

          // Gradient color: Cyan to Emerald
          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, '#38bdf8');
          gradient.addColorStop(0.5, '#34d399');
          gradient.addColorStop(1, '#059669');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }
      } else {
        // Idle line
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animFrameIdRef.current = requestAnimationFrame(renderVisualizer);
    };

    renderVisualizer();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying]);

  // Handle playing selected BGM track melody
  const handleTogglePlayTrack = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setCurrentStepIndex(-1);
    } else {
      if (!selectedTrack.notes || selectedTrack.notes.length === 0) return;
      setIsPlaying(true);
      soundEngine.playMelody(
        selectedTrack.notes,
        selectedTrack.bpm,
        selectedInstrument,
        (idx) => setCurrentStepIndex(idx),
        () => {
          if (isLooping) {
            // Restart
            setTimeout(handleTogglePlayTrack, 200);
          } else {
            setIsPlaying(false);
            setCurrentStepIndex(-1);
          }
        }
      );
    }
  };

  // Handle playing 16-step matrix
  const handleTogglePlayStepMatrix = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setCurrentStepIndex(-1);
    } else {
      setIsPlaying(true);
      const steps = Array.from({ length: 16 }, (_, i) => ({
        step: i,
        pitches: stepGrid[i] || [],
      }));

      soundEngine.playStepMatrix(
        steps,
        sequencerBpm,
        selectedInstrument,
        isLooping,
        (step) => setCurrentStepIndex(step)
      );
    }
  };

  // Handle Ocarina Button Click
  const handlePlayOcarinaNote = (buttonKey: 'A' | 'Down' | 'Right' | 'Left' | 'Up') => {
    const info = OCARINA_BUTTON_MAP[buttonKey];
    if (!info) return;

    soundEngine.playNote(info.note, 0.45, 'ocarina', 1.0);

    const newHistory = [...playedNotesHistory, buttonKey].slice(-8);
    setPlayedNotesHistory(newHistory);

    // Check if matching any known song
    for (const preset of OCARINA_SONG_PRESETS) {
      const needed = preset.ocarinaButtons;
      if (newHistory.length >= needed.length) {
        const slice = newHistory.slice(-needed.length);
        if (slice.every((val, idx) => val === needed[idx])) {
          setDetectedSongNotification(preset.name);
          setTimeout(() => setDetectedSongNotification(null), 3500);
          break;
        }
      }
    }
  };

  // Load a preset song into the step grid
  const handleLoadPresetSong = (preset: OcarinaPreset) => {
    const newGrid: Record<number, string[]> = {};
    for (let i = 0; i < 16; i++) {
      newGrid[i] = [];
    }

    let col = 0;
    for (const item of preset.notes) {
      if (col >= 16) break;
      if (item.note && item.note !== 'REST') {
        newGrid[col] = [item.note];
      }
      col += Math.max(1, Math.round(item.duration * 2));
    }

    setStepGrid(newGrid);
    setSequencerBpm(preset.bpm);
    setSelectedTrackId('bgm_custom_mod_01');
  };

  // Toggle note in step sequencer
  const toggleGridNote = (col: number, pitch: string) => {
    setStepGrid((prev) => {
      const current = prev[col] || [];
      const has = current.includes(pitch);
      const next = has ? current.filter((p) => p !== pitch) : [...current, pitch];
      return { ...prev, [col]: next };
    });
    // Preview clicked note
    soundEngine.playNote(pitch, 0.2, selectedInstrument, 0.9);
  };

  // Assign track to active scene
  const handleAssignTrackToScene = (track: OoT3DMusicTrack, targetSceneId: string) => {
    const updatedScenes = scenes.map((s) => {
      if (s.id === targetSceneId) {
        return {
          ...s,
          bgmId: track.seqId,
          bgmName: track.name,
        };
      }
      return s;
    });
    onUpdateScenes(updatedScenes);

    // Update track scene assignments
    const updatedTracks = tracks.map((t) => {
      if (t.id === track.id) {
        const current = new Set(t.assignedScenes);
        current.add(targetSceneId);
        return { ...t, assignedScenes: Array.from(current) };
      } else {
        return {
          ...t,
          assignedScenes: t.assignedScenes.filter((id) => id !== targetSceneId),
        };
      }
    });
    onUpdateTracks(updatedTracks);
  };

  // Filtered tracks
  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `0x${t.seqId.toString(16)}`.includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="music-editor-container" className="flex-1 flex flex-col bg-slate-950 text-slate-200 overflow-hidden select-none">
      {/* Top Banner / Toolstrip */}
      <div className="h-12 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Music2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">Music & Sound Studio</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-950 text-pink-300 border border-pink-800/60 font-mono">
                BCSAR / BCSEQ Driver
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveTab('sequencer');
              soundEngine.stop();
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sequencer'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Step Sequencer</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ocarina');
              soundEngine.stop();
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ocarina'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ocarina Player</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('scene_matrix');
              soundEngine.stop();
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scene_matrix'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Scene BGM Table</span>
          </button>
        </div>

        {/* Audio Driver Status & Volume */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>32,000 Hz CTR DSP</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Master Volume */}
          <div className="flex items-center gap-1.5">
            {masterVolume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="w-20 accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              title={`Master Volume: ${masterVolume}%`}
            />
            <span className="font-mono text-[10px] text-slate-400 w-7">{masterVolume}%</span>
          </div>
        </div>
      </div>

      {/* Main Content: 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: BGM Catalog & Sequences */}
        <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-xs text-slate-200">
                  OoT3D Tracks ({tracks.length})
                </span>
              </div>
              <button
                onClick={() => {
                  const newSeqId = 0x80 + tracks.filter((t) => t.isCustom).length;
                  const newTrack: OoT3DMusicTrack = {
                    id: `bgm_custom_${newSeqId.toString(16)}`,
                    seqId: newSeqId,
                    name: `Custom Track 0x${newSeqId.toString(16).toUpperCase()}`,
                    category: 'custom',
                    format: 'BCSEQ',
                    bpm: 120,
                    timeSignature: '4/4',
                    volume: 90,
                    reverb: 40,
                    pan: 0,
                    isCustom: true,
                    assignedScenes: [],
                    notes: OCARINA_SONG_PRESETS[1].notes,
                    fileSizeKb: 25.0,
                    filePath: `romfs/sound/custom_seq_0x${newSeqId.toString(16)}.bcseq`,
                  };
                  onUpdateTracks([...tracks, newTrack]);
                  setSelectedTrackId(newTrack.id);
                }}
                className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                title="Create a new custom sequence slot in BCSAR"
              >
                <Plus className="w-3 h-3" />
                <span>New Track</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
              <input
                type="text"
                placeholder="Search tracks, slot 0x18..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px]">
              {['all', 'overworld', 'town', 'dungeon', 'battle', 'custom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-700 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Track List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredTracks.map((track) => {
              const isSelected = track.id === selectedTrackId;
              const isCurrentlyPlayingThis = isSelected && isPlaying;
              const hasScenes = track.assignedScenes.length > 0;

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    if (selectedTrackId !== track.id) {
                      soundEngine.stop();
                      setIsPlaying(false);
                      setCurrentStepIndex(-1);
                      setSelectedTrackId(track.id);
                    }
                  }}
                  className={`p-2 rounded-lg border text-left flex items-start justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500/80 text-white ring-1 ring-sky-500/40 shadow-sm'
                      : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs truncate">{track.name}</span>
                      {track.isCustom && (
                        <span className="text-[8px] bg-purple-900/80 text-purple-300 px-1 py-0.2 rounded font-mono">
                          MOD
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-bold">
                        0x{track.seqId.toString(16).padStart(2, '0').toUpperCase()}
                      </span>
                      <span>{track.format}</span>
                      <span>{track.bpm} BPM</span>
                    </div>

                    {hasScenes && (
                      <div className="text-[10px] text-sky-400 truncate mt-0.5">
                        📍 {track.assignedScenes.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Play preview button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedTrackId !== track.id) {
                        setSelectedTrackId(track.id);
                      }
                      if (isCurrentlyPlayingThis) {
                        soundEngine.stop();
                        setIsPlaying(false);
                        setCurrentStepIndex(-1);
                      } else {
                        soundEngine.stop();
                        setIsPlaying(true);
                        soundEngine.playMelody(
                          track.notes || OCARINA_SONG_PRESETS[0].notes,
                          track.bpm,
                          selectedInstrument,
                          (idx) => setCurrentStepIndex(idx),
                          () => {
                            setIsPlaying(false);
                            setCurrentStepIndex(-1);
                          }
                        );
                      }
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isCurrentlyPlayingThis
                        ? 'bg-sky-500 text-slate-950 shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title={isCurrentlyPlayingThis ? 'Stop Audio' : 'Preview BGM Sequence'}
                  >
                    {isCurrentlyPlayingThis ? (
                      <Square className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Import Action */}
          <div className="p-2.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">RomFS Sound Archive</span>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 cursor-pointer font-medium"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Audio File</span>
            </button>
          </div>
        </div>

        {/* Center / Main Column */}
        <div className="flex-1 flex flex-col bg-slate-900/20 overflow-y-auto">
          {/* Active Track Header & Audio Visualizer Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {selectedTrack.name}
                  </h2>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded font-bold">
                    Slot 0x{selectedTrack.seqId.toString(16).padStart(2, '0').toUpperCase()}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedTrack.category}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>📁 {selectedTrack.filePath}</span>
                  <span>• {selectedTrack.fileSizeKb} KB</span>
                  <span>• {selectedTrack.timeSignature}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                    isLooping
                      ? 'bg-sky-950 border-sky-500/80 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  title={isLooping ? 'Looping Enabled' : 'Looping Disabled'}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                <button
                  onClick={
                    activeTab === 'sequencer'
                      ? handleTogglePlayStepMatrix
                      : handleTogglePlayTrack
                  }
                  className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950/50'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>{activeTab === 'sequencer' ? 'Play Sequencer' : 'Play Track'}</span>
                    </>
                  )}
                </button>

                {/* Direct Scene Assignment */}
                <button
                  onClick={() => handleAssignTrackToScene(selectedTrack, activeSceneId)}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  title={`Set as BGM for current scene (${activeSceneId})`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Assign to {activeSceneId}</span>
                </button>
              </div>
            </div>

            {/* Realtime Waveform Canvas */}
            <div className="mt-3 bg-slate-950 rounded-xl border border-slate-800/80 p-2 relative overflow-hidden h-20">
              <canvas
                ref={canvasRef}
                width={800}
                height={64}
                className="w-full h-full block"
              />
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <Waves className="w-3 h-3 text-sky-400" />
                <span>REALTIME CTR WAVE SPECTRUM</span>
              </div>
              {isPlaying && currentStepIndex >= 0 && (
                <div className="absolute bottom-2 right-3 font-mono text-[10px] text-sky-300 bg-sky-950/80 border border-sky-800/80 px-2 py-0.5 rounded">
                  Beat Step: {currentStepIndex + 1}
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: 16-Step Matrix Sequencer */}
          {activeTab === 'sequencer' && (
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-300 font-medium">Instrument:</span>
                    <select
                      value={selectedInstrument}
                      onChange={(e) => setSelectedInstrument(e.target.value as InstrumentType)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-medium"
                    >
                      <option value="ocarina">Ocarina (Breathy Sine/Tri)</option>
                      <option value="harp">Goddess Harp (Pluck)</option>
                      <option value="strings">Orchestral Strings (Saw)</option>
                      <option value="chiptune">Retro Chiptune (Square)</option>
                      <option value="brass">French Horn / Brass</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-300 font-medium">Tempo:</span>
                    <input
                      type="range"
                      min="60"
                      max="220"
                      value={sequencerBpm}
                      onChange={(e) => setSequencerBpm(Number(e.target.value))}
                      className="w-20 accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                    />
                    <span className="font-mono text-xs text-sky-400 font-semibold w-12">
                      {sequencerBpm} BPM
                    </span>
                  </div>
                </div>

                {/* Preset Song Loader */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Load Preset:</span>
                  <select
                    onChange={(e) => {
                      const preset = OCARINA_SONG_PRESETS.find((p) => p.id === e.target.value);
                      if (preset) handleLoadPresetSong(preset);
                    }}
                    defaultValue=""
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select OoT Melody...
                    </option>
                    {OCARINA_SONG_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.inGameSong})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const empty: Record<number, string[]> = {};
                      for (let i = 0; i < 16; i++) empty[i] = [];
                      setStepGrid(empty);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Clear Grid"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 16-Step Interactive Matrix */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl overflow-x-auto">
                <div className="min-w-[560px]">
                  {/* Step indicators header */}
                  <div className="flex items-center mb-2 pl-12">
                    {Array.from({ length: 16 }).map((_, col) => {
                      const isBeatHead = col % 4 === 0;
                      const isCurrentActive = isPlaying && currentStepIndex === col;
                      return (
                        <div
                          key={col}
                          className={`flex-1 text-center font-mono text-[10px] py-1 mx-0.5 rounded transition-colors ${
                            isCurrentActive
                              ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/50'
                              : isBeatHead
                              ? 'bg-slate-800 text-sky-400 font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          {col + 1}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grid Pitch Rows */}
                  {PITCH_ROWS.map((pitch) => (
                    <div key={pitch} className="flex items-center my-1">
                      {/* Pitch Label */}
                      <span className="w-12 text-right pr-3 font-mono text-xs font-semibold text-slate-400">
                        {pitch}
                      </span>

                      {/* 16 Step Buttons */}
                      <div className="flex-1 flex items-center">
                        {Array.from({ length: 16 }).map((_, col) => {
                          const isTriggered = (stepGrid[col] || []).includes(pitch);
                          const isBeatHead = col % 4 === 0;
                          const isCurrentActive = isPlaying && currentStepIndex === col;

                          return (
                            <button
                              key={col}
                              onClick={() => toggleGridNote(col, pitch)}
                              className={`flex-1 h-7 mx-0.5 rounded transition-all cursor-pointer flex items-center justify-center ${
                                isTriggered
                                  ? isCurrentActive
                                    ? 'bg-amber-400 shadow-md shadow-amber-400/80 scale-105 ring-2 ring-white'
                                    : 'bg-sky-500 hover:bg-sky-400 shadow-sm shadow-sky-500/40'
                                  : isCurrentActive
                                  ? 'bg-slate-800 border border-sky-400/50'
                                  : isBeatHead
                                  ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800'
                                  : 'bg-slate-950 hover:bg-slate-900 border border-slate-900'
                              }`}
                              title={`Step ${col + 1}: ${pitch} (Click to toggle)`}
                            >
                              {isTriggered && (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shadow" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Authentic Ocarina Player */}
          {activeTab === 'ocarina' && (
            <div className="p-6 flex flex-col items-center justify-center space-y-6">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-bold text-white">Fairy Ocarina & Ocarina of Time</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click the authentic buttons or press keys [1-5] / [A, S, D, F, G] to play notes and trigger in-game song recognition!
                </p>
              </div>

              {/* Song detection banner */}
              {detectedSongNotification && (
                <div className="animate-bounce bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-950/80">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>You played: {detectedSongNotification}!</span>
                </div>
              )}

              {/* Ocarina Chamber Visual Layout */}
              <div className="relative w-80 h-56 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 rounded-full border-4 border-blue-600/40 p-4 flex flex-col items-center justify-center shadow-2xl shadow-blue-950/60">
                {/* Triforce crest symbol */}
                <div className="text-amber-400 font-bold text-xs tracking-widest uppercase mb-4 opacity-70">
                  ▲ HYRULE EMBLEM ▲
                </div>

                {/* 5 Ocarina Holes Layout */}
                <div className="flex items-center gap-5">
                  {/* Low D (A button) */}
                  <button
                    onClick={() => handlePlayOcarinaNote('A')}
                    className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 border-2 border-blue-400 text-white font-black text-base shadow-xl flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>A</span>
                    <span className="text-[9px] opacity-80">D4</span>
                  </button>

                  {/* C-Direction Buttons Diamond */}
                  <div className="grid grid-cols-3 gap-1.5 items-center">
                    <div />
                    {/* Up */}
                    <button
                      onClick={() => handlePlayOcarinaNote('Up')}
                      className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 border-2 border-amber-300 text-slate-950 font-black text-sm shadow flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>▲</span>
                      <span className="text-[8px] font-mono">D5</span>
                    </button>
                    <div />

                    {/* Left */}
                    <button
                      onClick={() => handlePlayOcarinaNote('Left')}
                      className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 border-2 border-amber-300 text-slate-950 font-black text-sm shadow flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>◀</span>
                      <span className="text-[8px] font-mono">B4</span>
                    </button>

                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[9px] text-slate-500">
                      ♫
                    </div>

                    {/* Right */}
                    <button
                      onClick={() => handlePlayOcarinaNote('Right')}
                      className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 border-2 border-amber-300 text-slate-950 font-black text-sm shadow flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>▶</span>
                      <span className="text-[8px] font-mono">A4</span>
                    </button>

                    <div />
                    {/* Down */}
                    <button
                      onClick={() => handlePlayOcarinaNote('Down')}
                      className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 border-2 border-amber-300 text-slate-950 font-black text-sm shadow flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>▼</span>
                      <span className="text-[8px] font-mono">F4</span>
                    </button>
                    <div />
                  </div>
                </div>
              </div>

              {/* Ocarina Songs Quick Sheet */}
              <div className="w-full max-w-2xl bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200">
                  Known Ocarina Melodies & Song Book
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OCARINA_SONG_PRESETS.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.description}</div>
                        <div className="flex items-center gap-1 mt-1.5">
                          {p.ocarinaButtons.map((btn, i) => (
                            <span
                              key={i}
                              className={`text-[9px] px-1.5 py-0.5 rounded font-black border ${
                                btn === 'A'
                                  ? 'bg-blue-600 border-blue-400 text-white'
                                  : 'bg-amber-500 border-amber-300 text-slate-950'
                              }`}
                            >
                              {btn === 'Down'
                                ? '▼'
                                : btn === 'Right'
                                ? '▶'
                                : btn === 'Left'
                                ? '◀'
                                : btn === 'Up'
                                ? '▲'
                                : 'A'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.stop();
                          setIsPlaying(true);
                          soundEngine.playMelody(
                            p.notes,
                            p.bpm,
                            'ocarina',
                            undefined,
                            () => setIsPlaying(false)
                          );
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors cursor-pointer shrink-0"
                        title="Play preview"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Scene BGM Table */}
          {activeTab === 'scene_matrix' && (
            <div className="p-4 space-y-3">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white">
                    Scene Sequence Assignment & Day/Night Triggers
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Map each .zsi scene in your RomFS mod to any OoT3D or custom mod sequence slot.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-3">Scene Name & ID</th>
                      <th className="p-3">Assigned Sequence</th>
                      <th className="p-3">Slot Hex</th>
                      <th className="p-3">Reverb</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {scenes.map((scene) => {
                      const matchedTrack = tracks.find((t) => t.seqId === scene.bgmId);

                      return (
                        <tr
                          key={scene.id}
                          className={`hover:bg-slate-900/50 transition-colors ${
                            scene.id === activeSceneId ? 'bg-sky-950/20' : ''
                          }`}
                        >
                          <td className="p-3 font-sans">
                            <div className="font-bold text-white text-xs">{scene.name}</div>
                            <div className="font-mono text-[10px] text-slate-400">{scene.id}</div>
                          </td>

                          <td className="p-3 font-sans">
                            <select
                              value={matchedTrack?.id || ''}
                              onChange={(e) => {
                                const tr = tracks.find((t) => t.id === e.target.value);
                                if (tr) handleAssignTrackToScene(tr, scene.id);
                              }}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-sans"
                            >
                              {tracks.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} (0x{t.seqId.toString(16)})
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="p-3 text-emerald-400 font-bold">
                            0x{scene.bgmId.toString(16).padStart(2, '0').toUpperCase()}
                          </td>

                          <td className="p-3 text-slate-300">
                            {matchedTrack?.reverb || 40} / 127
                          </td>

                          <td className="p-3 font-sans">
                            <button
                              onClick={() => onSelectScene(scene.id)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs transition-colors cursor-pointer"
                            >
                              Go to Scene
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audio Properties & 3DS Sound Spec */}
        <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              CTR Audio Archive (.bcsar)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Nintendo CTR DSP Hardware Specifications
            </p>
          </div>

          {/* Properties Card */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Audio Title ID</span>
              <span className="font-mono text-white text-[11px]">0004000000033500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sample Rate</span>
              <span className="font-mono text-emerald-400">32,000 Hz</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Hardware Channels</span>
              <span className="font-mono text-white">16 DSP Channels</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Audio Subsystem</span>
              <span className="font-mono text-white">nn::snd / CTR Sound</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Estimated Size</span>
              <span className="font-mono text-white">1.84 MB RomFS</span>
            </div>
          </div>

          {/* Active Track DSP Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="font-semibold text-xs text-slate-200">
              Track DSP & Mixer Settings
            </span>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Volume Ducking Priority</span>
                <span className="font-mono text-sky-400">Priority 4</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                defaultValue="4"
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">DSP Reverb Level</span>
                <span className="font-mono text-sky-400">{selectedTrack.reverb} / 127</span>
              </div>
              <input
                type="range"
                min="0"
                max="127"
                value={selectedTrack.reverb}
                onChange={(e) => {
                  const updated = tracks.map((t) =>
                    t.id === selectedTrack.id ? { ...t, reverb: Number(e.target.value) } : t
                  );
                  onUpdateTracks(updated);
                }}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Stereo Panning</span>
                <span className="font-mono text-sky-400">Center (0%)</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={selectedTrack.pan}
                onChange={(e) => {
                  const updated = tracks.map((t) =>
                    t.id === selectedTrack.id ? { ...t, pan: Number(e.target.value) } : t
                  );
                  onUpdateTracks(updated);
                }}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>
          </div>

          {/* RomFS Packaging Guide */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-white font-medium">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>LayeredFS RomFS Audio</span>
            </div>
            <p>
              When building your Luma3DS mod zip, custom sequences are written directly to{' '}
              <code className="text-sky-300 font-mono">luma/titles/&lt;titleId&gt;/romfs/sound/</code>{' '}
              and linked into scene headers.
            </p>
          </div>
        </div>
      </div>

      {/* Import Audio Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Import Audio into RomFS</span>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Supports CTR Nintendo 3DS sound formats: <code>.bcseq</code>, <code>.bcwav</code>, <code>.wav</code> (32000Hz 16-bit PCM), and standard MIDI <code>.mid</code>.
            </p>

            <label className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
              <Disc3 className="w-8 h-8 text-sky-400 mb-2" />
              <span className="text-xs font-semibold text-white">
                Click to browse or drag & drop audio file
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Auto-converts to CTR BCSEQ sequence slot
              </span>
              <input
                type="file"
                accept=".wav,.bcseq,.bcwav,.mid"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const newTrack: OoT3DMusicTrack = {
                      id: `bgm_imported_${Date.now()}`,
                      seqId: 0x85,
                      name: file.name.replace(/\.[^/.]+$/, ''),
                      category: 'custom',
                      format: file.name.endsWith('.wav') ? 'BCWAV' : 'BCSEQ',
                      bpm: 120,
                      timeSignature: '4/4',
                      volume: 95,
                      reverb: 35,
                      pan: 0,
                      isCustom: true,
                      assignedScenes: [],
                      notes: OCARINA_SONG_PRESETS[0].notes,
                      fileSizeKb: Math.round(file.size / 1024),
                      filePath: `romfs/sound/${file.name}`,
                    };
                    onUpdateTracks([...tracks, newTrack]);
                    setSelectedTrackId(newTrack.id);
                    setShowImportModal(false);
                  }
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
