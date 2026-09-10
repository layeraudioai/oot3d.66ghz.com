import React, { useState } from 'react';
import {
  CustomObjectType,
  CustomScript,
  CustomScriptParam,
  OoT3DScene,
} from '../types/oot3d';
import {
  Code,
  FileCode,
  Plus,
  Trash2,
  Play,
  Cpu,
  Boxes,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface ScriptAttacherProps {
  scripts: CustomScript[];
  customObjects: CustomObjectType[];
  activeScene: OoT3DScene;
  onUpdateScript: (script: CustomScript) => void;
  onCreateScript: (newScript: CustomScript) => void;
  onDeleteScript: (id: string) => void;
  onCreateCustomObject: (newObj: CustomObjectType) => void;
  onPlaceObjectInScene: (obj: CustomObjectType) => void;
  selectedScriptId: string | null;
  onSelectScript: (id: string) => void;
}

export const ScriptAttacher: React.FC<ScriptAttacherProps> = ({
  scripts,
  customObjects,
  activeScene,
  onUpdateScript,
  onCreateScript,
  onDeleteScript,
  onCreateCustomObject,
  onPlaceObjectInScene,
  selectedScriptId,
  onSelectScript,
}) => {
  const [activeTab, setActiveTab] = useState<'objects' | 'scripts'>('objects');
  const [showNewObjectModal, setShowNewObjectModal] = useState(false);
  const [showNewScriptModal, setShowNewScriptModal] = useState(false);

  // New Object Form state
  const [newObjName, setNewObjName] = useState('');
  const [newObjDesc, setNewObjDesc] = useState('');
  const [newObjMesh, setNewObjMesh] = useState<'npc' | 'chest' | 'crystal' | 'custom'>('npc');
  const [newObjScriptId, setNewObjScriptId] = useState(scripts[0]?.id || '');

  // New Script Form state
  const [newScriptName, setNewScriptName] = useState('');
  const [newScriptLang, setNewScriptLang] = useState<'C' | 'Lua'>('C');
  const [newScriptHook, setNewScriptHook] = useState<CustomScript['targetHook']>('actor_update');

  const activeScript = scripts.find((s) => s.id === selectedScriptId) || scripts[0];

  const handleAddParam = () => {
    if (!activeScript) return;
    const newParam: CustomScriptParam = {
      key: `customVar_${activeScript.exposedParams.length + 1}`,
      label: `Parameter ${activeScript.exposedParams.length + 1}`,
      type: 'number',
      defaultValue: 0,
      description: 'Configurable actor variable',
    };
    onUpdateScript({
      ...activeScript,
      exposedParams: [...activeScript.exposedParams, newParam],
    });
  };

  const handleCreateObjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjName) return;
    const nextId = 0x0180 + customObjects.length;
    onCreateCustomObject({
      objectId: nextId,
      name: newObjName,
      description: newObjDesc || 'Custom OoT3D Actor with user scripts attached',
      defaultMesh: newObjMesh,
      collisionRadius: 45,
      attachedScriptId: newObjScriptId,
    });
    setNewObjName('');
    setNewObjDesc('');
    setShowNewObjectModal(false);
  };

  const handleCreateScriptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScriptName) return;
    const id = `script_${Date.now()}`;
    const filename = newScriptName.endsWith('.c') || newScriptName.endsWith('.lua')
      ? newScriptName
      : `${newScriptName}.${newScriptLang === 'C' ? 'c' : 'lua'}`;

    const newScript: CustomScript = {
      id,
      name: filename,
      author: 'Modder3DS',
      version: '1.0.0',
      description: 'Custom OoT3D actor behavior script',
      targetHook: newScriptHook,
      language: newScriptLang,
      associatedObjectId: 0x0180 + customObjects.length,
      exposedParams: [
        {
          key: 'speed',
          label: 'Actor Speed',
          type: 'number',
          defaultValue: 2.0,
          description: 'Velocity speed',
        },
      ],
      code: `// ${filename} - Custom OoT3D RomFS Actor Logic
#include "z3D_actor.h"

void CustomActor_Init(Actor* this, GlobalContext* globalCtx) {
    // Initialization routine
}

void CustomActor_Update(Actor* this, GlobalContext* globalCtx) {
    // Main update loop
}

void CustomActor_Draw(Actor* this, GlobalContext* globalCtx) {
    // Custom model drawing routine
}`,
    };

    onCreateScript(newScript);
    onSelectScript(id);
    setNewScriptName('');
    setShowNewScriptModal(false);
    setActiveTab('scripts');
  };

  return (
    <div id="script-attacher-panel" className="h-full flex flex-col bg-slate-900 text-slate-200">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Script Attacher & Custom Objects
              </h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                OoT3D Actor Injection Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Bind C / Lua routines to new actor classes and place them directly in rooms
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('objects')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'objects'
                ? 'bg-purple-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Custom Object Types ({customObjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'scripts'
                ? 'bg-purple-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Script Library ({scripts.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Custom Object Types */}
      {activeTab === 'objects' && (
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Defined Custom Object Types</h3>
              <p className="text-xs text-slate-400">
                New actor classes configured with models, collision bounds, and attached scripts.
              </p>
            </div>
            <button
              id="btn-create-object-type"
              onClick={() => setShowNewObjectModal(true)}
              className="py-2 px-3.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-purple-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Object Type</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customObjects.map((obj) => {
              const attachedScript = scripts.find((s) => s.id === obj.attachedScriptId);
              return (
                <div
                  key={obj.objectId}
                  className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-300">
                        <Boxes className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-purple-300 bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded">
                        0x{obj.objectId.toString(16).padStart(4, '0')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                        {obj.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {obj.description}
                      </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Attached Script:</span>
                        <span className="text-purple-300 font-mono text-[11px] font-medium truncate max-w-[140px]">
                          {attachedScript?.name || 'None'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Mesh Archetype:</span>
                        <span className="capitalize text-slate-200">{obj.defaultMesh}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Collision Radius:</span>
                        <span className="font-mono text-slate-200">{obj.collisionRadius}u</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onPlaceObjectInScene(obj)}
                      className="flex-1 py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Place in {activeScene.name}</span>
                    </button>
                    {attachedScript && (
                      <button
                        onClick={() => {
                          onSelectScript(attachedScript.id);
                          setActiveTab('scripts');
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer"
                        title="Edit Attached Script"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Script Editor & Inspector */}
      {activeTab === 'scripts' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Script Tree */}
          <div className="w-72 border-r border-slate-800 bg-slate-950/40 p-4 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <span>Script Modules</span>
              <button
                id="btn-open-create-script"
                onClick={() => setShowNewScriptModal(true)}
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {scripts.map((script) => {
                const isSelected = script.id === activeScript?.id;
                return (
                  <button
                    key={script.id}
                    onClick={() => onSelectScript(script.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/40 text-white'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs font-mono truncate">{script.name}</span>
                      <span className="font-mono text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-purple-400">
                        {script.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{script.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Script Code Editor & Variable Exposer */}
          {activeScript && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/80">
              {/* Script Toolbar */}
              <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-purple-300">
                    {activeScript.name}
                  </span>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ARM11 CTR Binary Ready</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddParam}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sliders className="w-3 h-3 text-purple-400" />
                    <span>+ Expose Variable</span>
                  </button>
                  <button
                    onClick={() => onDeleteScript(activeScript.id)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 rounded-lg cursor-pointer transition-colors"
                    title="Delete Script"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="flex-1 p-4 overflow-hidden flex flex-col">
                <textarea
                  value={activeScript.code}
                  onChange={(e) =>
                    onUpdateScript({
                      ...activeScript,
                      code: e.target.value,
                    })
                  }
                  className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-purple-500 resize-none selection:bg-purple-900"
                  spellCheck={false}
                />
              </div>

              {/* Exposed Tunable Parameters Drawer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Exposed Level Designer Variables ({activeScript.exposedParams.length})</span>
                  <span className="text-[10px] text-slate-400 lowercase">
                    Tune per placed actor instance in the scene
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeScript.exposedParams.map((param, index) => (
                    <div
                      key={param.key}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-slate-200">{param.label}</span>
                        <span className="font-mono text-[10px] text-purple-400">{param.key}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Default:</span>
                        <span className="font-mono text-amber-300">{String(param.defaultValue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Define New Custom Object */}
      {showNewObjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-400" />
              <span>Define New Custom Object Type</span>
            </h3>

            <form onSubmit={handleCreateObjectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Object Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ancient Kokiri Obelisk"
                  value={newObjName}
                  onChange={(e) => setNewObjName(e.target.value)}
                  className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Puzzle totem responding to fire arrows"
                  value={newObjDesc}
                  onChange={(e) => setNewObjDesc(e.target.value)}
                  className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Mesh Archetype</label>
                <select
                  value={newObjMesh}
                  onChange={(e) =>
                    setNewObjMesh(e.target.value as 'npc' | 'chest' | 'crystal' | 'custom')
                  }
                  className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="npc">Character / NPC Capsule</option>
                  <option value="chest">Treasure Chest / Interactive Container</option>
                  <option value="crystal">Glowing Crystal / Obelisk</option>
                  <option value="custom">Geometric Hologram</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Attach Script</label>
                <select
                  value={newObjScriptId}
                  onChange={(e) => setNewObjScriptId(e.target.value)}
                  className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {scripts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.language})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewObjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Create Object Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Script */}
      {showNewScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              <span>Create Custom Actor Script</span>
            </h3>

            <form onSubmit={handleCreateScriptSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Script File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ElementalTrap_Flame.c"
                  value={newScriptName}
                  onChange={(e) => setNewScriptName(e.target.value)}
                  className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Language</label>
                  <select
                    value={newScriptLang}
                    onChange={(e) => setNewScriptLang(e.target.value as 'C' | 'Lua')}
                    className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="C">C (OoT3D Decomp Hook)</option>
                    <option value="Lua">Lua (Script VM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target Hook</label>
                  <select
                    value={newScriptHook}
                    onChange={(e) =>
                      setNewScriptHook(e.target.value as CustomScript['targetHook'])
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="actor_update">Actor Update Loop</option>
                    <option value="actor_init">Actor Init</option>
                    <option value="actor_draw">Actor Draw / Mesh</option>
                    <option value="collision_touch">Collision Hit</option>
                    <option value="event_trigger">Event Cutscene</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewScriptModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Create Script
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
