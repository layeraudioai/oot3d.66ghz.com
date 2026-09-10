import React from 'react';
import {
  EditorMode,
  OoT3DScene,
  RomFsDirectory,
} from '../types/oot3d';
import {
  Gamepad2,
  FolderOpen,
  Layers,
  Sparkles,
  Download,
  Image as ImageIcon,
  Code,
  Box,
  ChevronDown,
  HardDrive,
  Music,
  Undo2,
  Redo2,
  Plus,
} from 'lucide-react';

interface HeaderBarProps {
  currentDirectory: RomFsDirectory | null;
  scenes: OoT3DScene[];
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
  editorMode: EditorMode;
  onChangeEditorMode: (mode: EditorMode) => void;
  onOpenRomfsModal: () => void;
  onOpenExportModal: () => void;
  onGenerateRandomScene: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentDirectory,
  scenes,
  activeSceneId,
  onSelectScene,
  editorMode,
  onChangeEditorMode,
  onOpenRomfsModal,
  onOpenExportModal,
  onGenerateRandomScene,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  return (
    <header
      id="app-header-bar"
      className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 select-none z-30"
    >
      {/* Left: Logo & RomFS Directory Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-white tracking-tight leading-none">
                OoT3D Level Editor
              </h1>
              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                3DS CTR
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-none mt-0.5">
              Ocarina of Time 3D RomFS & Mod Studio
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* RomFS Folder Status / Switcher */}
        <button
          id="btn-romfs-status-pill"
          onClick={onOpenRomfsModal}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-colors cursor-pointer group"
          title="Click to load another RomFS dump or project"
        >
          <HardDrive className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300" />
          <span className="font-mono text-[11px] truncate max-w-[130px]">
            {currentDirectory ? currentDirectory.name : 'No RomFS Loaded'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {currentDirectory?.region || 'USA'}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {/* Center: Mode Tabs */}
      <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          id="tab-mode-scene"
          onClick={() => onChangeEditorMode('scene')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            editorMode === 'scene'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Scene & Actors</span>
        </button>

        <button
          id="tab-mode-collision"
          onClick={() => onChangeEditorMode('collision')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            editorMode === 'collision'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Collision Maps</span>
        </button>

        <button
          id="tab-mode-textures"
          onClick={() => onChangeEditorMode('textures')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            editorMode === 'textures'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Texture Kit (oot3d-texkit)</span>
        </button>

        <button
          id="tab-mode-scripts"
          onClick={() => onChangeEditorMode('scripts')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            editorMode === 'scripts'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Script Attacher</span>
        </button>

        <button
          id="tab-mode-music"
          onClick={() => onChangeEditorMode('music')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            editorMode === 'music'
              ? 'bg-pink-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Music & Sound</span>
        </button>
      </nav>

      {/* Right: History, Scene Selector & Luma Export Button */}
      <div className="flex items-center gap-2.5">
        {/* Undo / Redo Buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
          <button
            id="btn-history-undo"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded text-xs transition-colors ${
              canUndo
                ? 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-history-redo"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded text-xs transition-colors ${
              canRedo
                ? 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scene Switcher Dropdown */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onGenerateRandomScene}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors cursor-pointer"
            title="Generate Random Scene"
          >
            <Plus className="w-4 h-4" />
          </button>
          <select
            id="select-active-scene"
            value={activeSceneId}
            onChange={(e) => onSelectScene(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-medium"
          >
            {scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id})
              </option>
            ))}
          </select>
        </div>

        {/* Build Luma RomFS Mod Button */}
        <button
          id="btn-open-luma-export"
          onClick={onOpenExportModal}
          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Build Luma Mod</span>
        </button>
      </div>
    </header>
  );
};
