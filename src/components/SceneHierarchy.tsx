import React, { useState } from 'react';
import { ACTOR_DEFINITIONS } from '../data/sampleRomfs';
import {
  EditorMode,
  OoT3DScene,
  RomFsDirectory,
  SceneActor,
} from '../types/oot3d';
import {
  Box,
  Layers,
  Search,
  Plus,
  Compass,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Sparkles,
  HardDrive,
  Folder,
  FileCode,
  FileBox,
  Image as ImageIcon,
  CheckCircle2,
  FolderSync,
  Music,
} from 'lucide-react';

interface SceneHierarchyProps {
  scene: OoT3DScene;
  scenes?: OoT3DScene[];
  currentDirectory: RomFsDirectory | null;
  activeRoomId: number;
  onSelectRoom: (roomId: number) => void;
  selectedActorUid: string | null;
  onSelectActor: (uid: string | null) => void;
  onAddNewActor: (actorId: number) => void;
  editorMode: EditorMode;
  onSelectScene?: (sceneId: string) => void;
  onChangeEditorMode?: (mode: EditorMode) => void;
  onOpenRomfsModal?: () => void;
}

export const SceneHierarchy: React.FC<SceneHierarchyProps> = ({
  scene,
  scenes = [],
  currentDirectory,
  activeRoomId,
  onSelectRoom,
  selectedActorUid,
  onSelectActor,
  onAddNewActor,
  editorMode,
  onSelectScene,
  onChangeEditorMode,
  onOpenRomfsModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    scene: true,
    tex: false,
    actor: false,
    scripts: false,
    sound: false,
  });

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderKey]: !prev[folderKey],
    }));
  };

  const currentRoom = scene.rooms.find((r) => r.id === activeRoomId) || scene.rooms[0];

  const filteredActors = currentRoom.actors.filter((actor) => {
    const def = ACTOR_DEFINITIONS.find((d) => d.id === actor.actorId);
    const matchesSearch =
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `0x${actor.actorId.toString(16)}`.includes(searchTerm.toLowerCase()) ||
      (actor.notes && actor.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'custom' && (actor.attachedScriptId || actor.actorId >= 0x0180)) ||
      (def && def.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Extract tree data from current directory or fallback to defaults
  const fileTree = currentDirectory?.fileTree || {
    scene: scenes.map((s) => `${s.id}_info.zsi`),
    tex: ['kokiri_grass.ctxb', 'tree_bark.ctxb', 'water_flow.ctxb', 'temple_pillar.ctxb'],
    actor: ['link.zar', 'box.zar', 'custom_actor.zar'],
    scripts: ['custom_npc.c', 'moving_platform.lua', 'puzzle_switch.lua'],
    sound: ['seq_0x18_kokiri.bcseq', 'seq_0x02_hyrule_field.bcseq', 'seq_0x22_temple.bcseq', 'seq_0x20_gerudo.bcseq', 'sound_data.bcsar'],
  };

  // Ensure scenes list is populated
  const sceneFiles = fileTree.scene && fileTree.scene.length > 0
    ? fileTree.scene
    : scenes.map((s) => `${s.id}_info.zsi`);

  const otherFolders = Object.keys(fileTree).filter(
    (k) => !['scene', 'tex', 'actor', 'scripts', 'sound'].includes(k)
  );

  return (
    <div
      id="scene-hierarchy-sidebar"
      className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 select-none text-xs text-slate-300"
    >
      {/* RomFS File Explorer Header */}
      <div className="p-2.5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsTreeExpanded(!isTreeExpanded)}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <FolderTree className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">
              RomFS Structure
            </span>
            {isTreeExpanded ? (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>

          {onOpenRomfsModal && (
            <button
              onClick={onOpenRomfsModal}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Change or reload RomFS dump"
            >
              <FolderSync className="w-2.5 h-2.5 text-emerald-400" />
              <span>Switch</span>
            </button>
          )}
        </div>

        {/* Directory Info Badge */}
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80">
          <span className="truncate max-w-[140px] text-emerald-300 font-medium">
            📁 /{currentDirectory?.name || 'romfs'}
          </span>
          <span className="text-slate-400 text-[9px]">
            {currentDirectory?.filesCount || 0} files
          </span>
        </div>

        {/* Dynamic Tree Hierarchy */}
        {isTreeExpanded && (
          <div className="mt-2 pl-1 font-mono text-[10px] text-slate-400 space-y-1 max-h-52 overflow-y-auto pr-1">
            {/* 1. SCENE FOLDER */}
            <div>
              <button
                onClick={() => toggleFolder('scene')}
                className="w-full flex items-center justify-between text-left text-slate-300 hover:text-white py-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {expandedFolders.scene ? (
                    <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  <Folder className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-semibold text-slate-200">scene/</span>
                </div>
                <span className="text-[9px] text-slate-400 px-1 rounded bg-slate-800">
                  {sceneFiles.length}
                </span>
              </button>

              {expandedFolders.scene && (
                <div className="pl-4 border-l border-slate-800 space-y-0.5 mt-0.5">
                  {sceneFiles.map((filename) => {
                    const sceneId = filename.replace('_info.zsi', '').replace('.zsi', '');
                    const isActive = scene.id === sceneId;
                    const matchedScene = scenes.find((s) => s.id === sceneId);
                    const displayName = matchedScene ? matchedScene.name : sceneId;

                    return (
                      <div key={filename} className="group">
                        <button
                          onClick={() => onSelectScene && onSelectScene(sceneId)}
                          className={`w-full text-left py-0.5 px-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-sky-950 text-sky-300 font-semibold border border-sky-600/40'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                          title={`Click to load scene: ${displayName} (${filename})`}
                        >
                          <span className="truncate">{filename}</span>
                          {isActive && (
                            <span className="text-[8px] bg-sky-500 text-slate-950 font-bold px-1 rounded">
                              ACTIVE
                            </span>
                          )}
                        </button>

                        {/* Active Scene Sub-components */}
                        {isActive && (
                          <div className="pl-3 border-l border-sky-500/40 space-y-0.5 my-0.5 text-[9px]">
                            <button
                              onClick={() => onChangeEditorMode && onChangeEditorMode('collision')}
                              className="w-full flex items-center justify-between text-emerald-400 hover:text-emerald-300 py-0.5 cursor-pointer"
                              title="Inspect & edit collision mesh"
                            >
                              <span>📄 collision.bin</span>
                              <span className="text-slate-400">
                                {scene.collisionPolygons.length} polys
                              </span>
                            </button>
                            <button
                              onClick={() => onSelectRoom(0)}
                              className="w-full flex items-center justify-between text-sky-400 hover:text-sky-300 py-0.5 cursor-pointer"
                              title="Room 0 ZSI container"
                            >
                              <span>📁 room_00.zsi</span>
                              <span className="text-slate-400">
                                {currentRoom.actors.length} actors
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. TEX FOLDER (oot3d-texkit) */}
            <div>
              <button
                onClick={() => toggleFolder('tex')}
                className="w-full flex items-center justify-between text-left text-slate-300 hover:text-white py-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {expandedFolders.tex ? (
                    <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-slate-200">tex/</span>
                </div>
                <span className="text-[9px] text-slate-400 px-1 rounded bg-slate-800">
                  {fileTree.tex?.length || 0}
                </span>
              </button>

              {expandedFolders.tex && (
                <div className="pl-4 border-l border-slate-800 space-y-0.5 mt-0.5">
                  {(fileTree.tex || []).slice(0, 8).map((texFile) => (
                    <button
                      key={texFile}
                      onClick={() => onChangeEditorMode && onChangeEditorMode('textures')}
                      className="w-full text-left py-0.5 px-1 rounded text-indigo-300/80 hover:text-indigo-200 hover:bg-slate-900 truncate block cursor-pointer"
                      title="Open in Texture Kit Editor"
                    >
                      {texFile}
                    </button>
                  ))}
                  {(fileTree.tex?.length || 0) > 8 && (
                    <span className="text-[9px] text-slate-400 pl-1 block">
                      +{(fileTree.tex?.length || 0) - 8} more textures...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 3. ACTOR FOLDER */}
            <div>
              <button
                onClick={() => toggleFolder('actor')}
                className="w-full flex items-center justify-between text-left text-slate-300 hover:text-white py-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {expandedFolders.actor ? (
                    <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  <FileBox className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200">actor/</span>
                </div>
                <span className="text-[9px] text-slate-400 px-1 rounded bg-slate-800">
                  {fileTree.actor?.length || 0}
                </span>
              </button>

              {expandedFolders.actor && (
                <div className="pl-4 border-l border-slate-800 space-y-0.5 mt-0.5">
                  {(fileTree.actor || []).slice(0, 6).map((actFile) => (
                    <div
                      key={actFile}
                      className="py-0.5 px-1 rounded text-amber-300/80 truncate block"
                    >
                      {actFile}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. SCRIPTS FOLDER */}
            <div>
              <button
                onClick={() => toggleFolder('scripts')}
                className="w-full flex items-center justify-between text-left text-slate-300 hover:text-white py-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {expandedFolders.scripts ? (
                    <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="font-semibold text-slate-200">scripts/</span>
                </div>
                <span className="text-[9px] text-slate-400 px-1 rounded bg-slate-800">
                  {fileTree.scripts?.length || 0}
                </span>
              </button>

              {expandedFolders.scripts && (
                <div className="pl-4 border-l border-slate-800 space-y-0.5 mt-0.5">
                  {(fileTree.scripts || []).map((scriptFile) => (
                    <button
                      key={scriptFile}
                      onClick={() => onChangeEditorMode && onChangeEditorMode('scripts')}
                      className="w-full text-left py-0.5 px-1 rounded text-purple-300/80 hover:text-purple-200 hover:bg-slate-900 truncate block cursor-pointer"
                      title="Open in Script Attacher"
                    >
                      {scriptFile}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. SOUND FOLDER */}
            <div>
              <button
                onClick={() => toggleFolder('sound')}
                className="w-full flex items-center justify-between text-left text-slate-300 hover:text-white py-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {expandedFolders.sound ? (
                    <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="font-semibold text-slate-200">sound/</span>
                </div>
                <span className="text-[9px] text-slate-400 px-1 rounded bg-slate-800">
                  {fileTree.sound?.length || 0}
                </span>
              </button>

              {expandedFolders.sound && (
                <div className="pl-4 border-l border-slate-800 space-y-0.5 mt-0.5">
                  {(fileTree.sound || []).map((soundFile) => (
                    <button
                      key={soundFile}
                      onClick={() => onChangeEditorMode && onChangeEditorMode('music')}
                      className="w-full text-left py-0.5 px-1 rounded text-pink-300/80 hover:text-pink-200 hover:bg-slate-900 truncate block cursor-pointer"
                      title="Open in Music Editor"
                    >
                      {soundFile}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* OTHER DETECTED FOLDERS */}
            {otherFolders.map((folder) => (
              <div key={folder}>
                <div className="flex items-center justify-between text-slate-400 py-0.5 px-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{folder}/</span>
                  </div>
                  <span className="text-[9px] text-slate-400 px-1 rounded bg-slate-800">
                    {fileTree[folder]?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rooms Switcher (If multiple rooms in active scene) */}
      {scene.rooms.length > 1 && (
        <div className="p-2 border-b border-slate-800 flex gap-1 bg-slate-900/40">
          {scene.rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeRoomId === room.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>
      )}

      {/* Actors Header & Search */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">
              Actors in Scene ({currentRoom.actors.length})
            </span>
          </div>
          <button
            onClick={() => onAddNewActor(0x0010)} // Quick add chest
            className="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded transition-colors cursor-pointer"
            title="Add Actor"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
          <input
            type="text"
            placeholder="Search actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
          {['all', 'player', 'prop', 'npc', 'enemy', 'custom'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Actor List Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredActors.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-[11px]">
            No matching actors found.
          </div>
        ) : (
          filteredActors.map((actor) => {
            const isSelected = actor.uid === selectedActorUid;
            const def = ACTOR_DEFINITIONS.find((d) => d.id === actor.actorId);
            const isCustom = actor.attachedScriptId || actor.actorId >= 0x0180;

            return (
              <button
                key={actor.uid}
                onClick={() => onSelectActor(actor.uid)}
                className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-500 text-white ring-1 ring-sky-500/40 shadow-sm'
                    : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow"
                    style={{ backgroundColor: def?.color || '#a855f7' }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs truncate">{actor.name}</span>
                      {isCustom && (
                        <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>0x{actor.actorId.toString(16).padStart(4, '0')}</span>
                      <span>
                        [{Math.round(actor.position.x)}, {Math.round(actor.position.z)}]
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
