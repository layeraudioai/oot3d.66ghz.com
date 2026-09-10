import React, { useState } from 'react';
import {
  ACTOR_DEFINITIONS,
  DEFAULT_CUSTOM_SCRIPTS,
} from '../data/sampleRomfs';
import { SceneActor, Vector3D } from '../types/oot3d';
import {
  Box,
  Copy,
  Trash2,
  Code,
  Sliders,
  Plus,
  Wrench,
  ChevronDown,
  ChevronRight,
  ArrowDown,
} from 'lucide-react';

// Common OoT3D Chest Items
const CHEST_ITEMS: { id: number; name: string }[] = [
  { id: 0x00, name: 'Deku Nuts (5)' },
  { id: 0x01, name: 'Bombs (5)' },
  { id: 0x02, name: 'Fairy Bow' },
  { id: 0x03, name: 'Fairy Slingshot' },
  { id: 0x04, name: 'Boomerang' },
  { id: 0x05, name: "Din's Fire" },
  { id: 0x06, name: 'Hookshot' },
  { id: 0x07, name: 'Longshot' },
  { id: 0x08, name: 'Fire Arrow' },
  { id: 0x09, name: 'Ice Arrow' },
  { id: 0x0a, name: 'Light Arrow' },
  { id: 0x0b, name: 'Megaton Hammer' },
  { id: 0x0e, name: 'Lens of Truth' },
  { id: 0x12, name: 'Kokiri Sword' },
  { id: 0x13, name: 'Master Sword' },
  { id: 0x14, name: "Giant's Knife" },
  { id: 0x1c, name: 'Deku Shield' },
  { id: 0x1d, name: 'Hylian Shield' },
  { id: 0x1e, name: 'Mirror Shield' },
  { id: 0x22, name: 'Kokiri Tunic' },
  { id: 0x23, name: 'Goron Tunic' },
  { id: 0x24, name: 'Zora Tunic' },
  { id: 0x25, name: 'Iron Boots' },
  { id: 0x26, name: 'Hover Boots' },
  { id: 0x2a, name: 'Small Key' },
  { id: 0x2c, name: 'Boss Key' },
  { id: 0x2d, name: 'Compass' },
  { id: 0x2e, name: 'Dungeon Map' },
  { id: 0x3c, name: 'Gold Skulltula Token' },
  { id: 0x4b, name: 'Heart Container' },
  { id: 0x4c, name: 'Piece of Heart' },
  { id: 0x50, name: 'Red Rupee (20)' },
  { id: 0x51, name: 'Purple Rupee (50)' },
  { id: 0x52, name: 'Huge Rupee (200)' },
];

// Common OoT3D Collectibles (En_Item00)
const COLLECTIBLE_DROPS: { id: number; name: string }[] = [
  { id: 0x00, name: 'Green Rupee (1)' },
  { id: 0x01, name: 'Blue Rupee (5)' },
  { id: 0x02, name: 'Red Rupee (20)' },
  { id: 0x03, name: 'Recovery Heart' },
  { id: 0x04, name: 'Bombs (1)' },
  { id: 0x05, name: 'Arrows (5)' },
  { id: 0x06, name: 'Small Magic Jar' },
  { id: 0x07, name: 'Large Magic Jar' },
  { id: 0x08, name: 'Deku Sticks (1)' },
  { id: 0x09, name: 'Deku Seeds (5)' },
  { id: 0x0a, name: 'Small Key Drop' },
];

interface ActorInspectorProps {
  actor: SceneActor | null;
  onUpdateActor: (updated: SceneActor) => void;
  onDeleteActor: (uid: string) => void;
  onDuplicateActor: (actor: SceneActor) => void;
  onAddNewActor: (actorId: number) => void;
  availableScripts?: typeof DEFAULT_CUSTOM_SCRIPTS;
  onOpenScriptEditor?: (scriptId: string) => void;
}

export const ActorInspector: React.FC<ActorInspectorProps> = ({
  actor,
  onUpdateActor,
  onDeleteActor,
  onDuplicateActor,
  onAddNewActor,
  availableScripts = DEFAULT_CUSTOM_SCRIPTS,
  onOpenScriptEditor,
}) => {
  const [showAddActorModal, setShowAddActorModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isBitfieldHelperOpen, setIsBitfieldHelperOpen] = useState(true);

  if (!actor) {
    return (
      <div
        id="actor-inspector-empty"
        className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400">
          <Box className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-300">No Actor Selected</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
            Click any actor in the 3D viewport or hierarchy, or spawn a new one into the scene.
          </p>
        </div>
        <button
          id="btn-open-add-actor"
          onClick={() => setShowAddActorModal(true)}
          className="mt-2 py-2 px-3.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Actor to Scene</span>
        </button>

        {showAddActorModal && renderAddModal()}
      </div>
    );
  }

  const def =
    ACTOR_DEFINITIONS.find((d) => d.id === actor.actorId) || {
      id: actor.actorId,
      name: actor.name,
      category: 'custom',
      description: 'Custom or unmapped OoT3D Actor',
      defaultVariable: 0x0000,
      color: '#a855f7',
      meshType: 'custom',
    };

  const handlePosChange = (axis: keyof Vector3D, val: number) => {
    onUpdateActor({
      ...actor,
      position: {
        ...actor.position,
        [axis]: isNaN(val) ? 0 : val,
      },
    });
  };

  const handleRotChange = (axis: 'x' | 'y' | 'z', val: number) => {
    onUpdateActor({
      ...actor,
      rotation: {
        ...actor.rotation,
        [axis]: isNaN(val) ? 0 : Math.round(val) % 360,
      },
    });
  };

  const handleVariableChange = (hexStr: string) => {
    const cleanHex = hexStr.replace(/^0x/i, '');
    const parsed = parseInt(cleanHex, 16);
    if (!isNaN(parsed)) {
      onUpdateActor({
        ...actor,
        variable: parsed & 0xffff,
      });
    }
  };

  function renderAddModal() {
    const filtered = ACTOR_DEFINITIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        `0x${d.id.toString(16)}`.includes(searchFilter.toLowerCase())
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Actor to Scene</span>
            </h3>
            <button
              onClick={() => setShowAddActorModal(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Search actors (e.g. Chest, Link, Gohma, Custom)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="mt-3 max-h-72 overflow-y-auto space-y-1.5 pr-1">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onAddNewActor(item.id);
                  setShowAddActorModal(false);
                }}
                className="w-full p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-left transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                      {item.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      0x{item.id.toString(16).padStart(4, '0')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs text-sky-400 opacity-0 group-hover:opacity-100 font-medium shrink-0 ml-2">
                  Spawn +
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="actor-inspector-panel" className="p-4 space-y-5 text-xs text-slate-300 overflow-y-auto max-h-full">
      {/* Header Badge */}
      <div className="pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: def.color }}
            />
            <h3 className="font-semibold text-slate-100 text-sm truncate">{actor.name}</h3>
          </div>
          <span className="font-mono text-[11px] text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded">
            0x{actor.actorId.toString(16).padStart(4, '0')}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{def.description}</p>
      </div>

      {/* Transform: Position */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Position (World X, Y, Z)</span>
          <button
            onClick={() => handlePosChange('y', 0)}
            className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            title="Snap Actor to Ground (Y=0)"
          >
            <ArrowDown className="w-3 h-3" />
            <span>Snap to Floor</span>
          </button>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis} className="bg-slate-900 border border-slate-800 rounded-lg p-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span
                  className={
                    axis === 'x'
                      ? 'text-red-400'
                      : axis === 'y'
                      ? 'text-emerald-400'
                      : 'text-blue-400'
                  }
                >
                  {axis}
                </span>
                <span className="text-[9px] text-slate-400 font-normal">units</span>
              </div>
              <input
                type="number"
                value={Math.round(actor.position[axis])}
                onChange={(e) => handlePosChange(axis, parseFloat(e.target.value))}
                className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Transform: Rotation */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Rotation (Pitch, Yaw, Roll)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis} className="bg-slate-900 border border-slate-800 rounded-lg p-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span>{axis === 'y' ? 'Yaw' : axis === 'x' ? 'Pitch' : 'Roll'}</span>
                <span className="text-[9px] text-slate-400 font-normal">°</span>
              </div>
              <input
                type="number"
                value={Math.round(actor.rotation[axis])}
                onChange={(e) => handleRotChange(axis, parseFloat(e.target.value))}
                className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Variable / Parameter (16-bit Hex) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Actor Variable (16-bit Hex)</span>
          </label>
          <span className="font-mono text-[10px] text-slate-400">
            0x{actor.variable.toString(16).padStart(4, '0').toUpperCase()}
          </span>
        </div>
        <input
          type="text"
          value={`0x${actor.variable.toString(16).padStart(4, '0').toUpperCase()}`}
          onChange={(e) => handleVariableChange(e.target.value)}
          className="w-full bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
        />

        {/* Bitfield Helper Accordion */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setIsBitfieldHelperOpen(!isBitfieldHelperOpen)}
            className="w-full flex items-center justify-between text-xs text-amber-400/90 hover:text-amber-300 py-1 cursor-pointer font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3 h-3 text-amber-400" />
              <span>Parameter Bitfield & Presets</span>
            </span>
            {isBitfieldHelperOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {isBitfieldHelperOpen && (
            <div className="mt-2 space-y-2.5 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              {/* Specialized Preset for En_Box (Treasure Chest 0x0010) */}
              {actor.actorId === 0x0010 && (
                <div className="space-y-2 border-b border-slate-800 pb-2.5">
                  <div className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                    <span>Treasure Chest Builder</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Chest Item Content:</label>
                    <select
                      value={(actor.variable >> 5) & 0x7f}
                      onChange={(e) => {
                        const itemId = parseInt(e.target.value, 10);
                        const cleanVar = (actor.variable & ~(0x7f << 5)) | ((itemId & 0x7f) << 5);
                        onUpdateActor({ ...actor, variable: cleanVar });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {CHEST_ITEMS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (0x{item.id.toString(16).padStart(2, '0')})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Chest Type:</label>
                      <select
                        value={actor.variable & 0x1f}
                        onChange={(e) => {
                          const typeVal = parseInt(e.target.value, 10);
                          const cleanVar = (actor.variable & ~0x1f) | (typeVal & 0x1f);
                          onUpdateActor({ ...actor, variable: cleanVar });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value={0}>0: Big Wooden Chest</option>
                        <option value={1}>1: Small Wooden Chest</option>
                        <option value={2}>2: Boss Key Gilded Chest</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Chest Flag (0-31):</label>
                      <input
                        type="number"
                        min={0}
                        max={31}
                        value={(actor.variable >> 12) & 0x0f}
                        onChange={(e) => {
                          const flag = parseInt(e.target.value, 10) || 0;
                          const cleanVar = (actor.variable & ~(0x0f << 12)) | ((flag & 0x0f) << 12);
                          onUpdateActor({ ...actor, variable: cleanVar });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Specialized Preset for En_Item00 (Collectibles 0x0015) */}
              {actor.actorId === 0x0015 && (
                <div className="space-y-1.5 border-b border-slate-800 pb-2.5">
                  <div className="text-[10px] uppercase font-bold text-amber-300">
                    Collectible Drop Type
                  </div>
                  <select
                    value={actor.variable & 0xff}
                    onChange={(e) => {
                      const dropId = parseInt(e.target.value, 10);
                      const cleanVar = (actor.variable & ~0xff) | (dropId & 0xff);
                      onUpdateActor({ ...actor, variable: cleanVar });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {COLLECTIBLE_DROPS.map((drop) => (
                      <option key={drop.id} value={drop.id}>
                        {drop.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Interactive 16-Bit Flag Matrix */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-semibold uppercase">16-Bit Flags Matrix:</span>
                  <span className="font-mono text-slate-500">
                    Hi: 0x{((actor.variable >> 8) & 0xff).toString(16).padStart(2, '0').toUpperCase()} | Lo: 0x{(actor.variable & 0xff).toString(16).padStart(2, '0').toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 16 }, (_, i) => 15 - i).map((bitIndex) => {
                    const isSet = (actor.variable & (1 << bitIndex)) !== 0;
                    return (
                      <button
                        key={bitIndex}
                        type="button"
                        onClick={() => {
                          const newVar = actor.variable ^ (1 << bitIndex);
                          onUpdateActor({ ...actor, variable: newVar });
                        }}
                        className={`p-1 rounded text-center font-mono text-[10px] transition-all cursor-pointer border ${
                          isSet
                            ? 'bg-amber-500/30 text-amber-300 border-amber-500/60 font-bold shadow-sm'
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                        }`}
                        title={`Toggle Bit ${bitIndex} (0x${(1 << bitIndex).toString(16).padStart(4, '0')})`}
                      >
                        {bitIndex}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attached Custom Script Section */}
      <div className="bg-slate-900/60 border border-purple-800/40 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-[11px] uppercase tracking-wider">
            <Code className="w-3.5 h-3.5" />
            <span>Attached Custom Script</span>
          </div>
          {actor.attachedScriptId && onOpenScriptEditor && (
            <button
              onClick={() => onOpenScriptEditor(actor.attachedScriptId!)}
              className="text-[10px] text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              Open Script Editor →
            </button>
          )}
        </div>

        <select
          value={actor.attachedScriptId || ''}
          onChange={(e) => {
            const scriptId = e.target.value || undefined;
            const script = availableScripts.find((s) => s.id === scriptId);
            const defaultParams: Record<string, string | number | boolean> = {};
            script?.exposedParams.forEach((p) => {
              defaultParams[p.key] = p.defaultValue;
            });
            onUpdateActor({
              ...actor,
              attachedScriptId: scriptId,
              customScriptParams: defaultParams,
            });
          }}
          className="w-full bg-slate-950 px-3 py-2 rounded border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="">-- None (Standard ROM Actor) --</option>
          {availableScripts.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.language})
            </option>
          ))}
        </select>

        {/* Exposed parameters if script is attached */}
        {actor.attachedScriptId && (
          <div className="mt-2 pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Script Variables (Per-instance Tuning):
            </span>
            {availableScripts
              .find((s) => s.id === actor.attachedScriptId)
              ?.exposedParams.map((param) => (
                <div key={param.key} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-300 font-medium">{param.label}</span>
                    <span className="text-slate-400">{param.type}</span>
                  </div>
                  <input
                    type="text"
                    value={String(actor.customScriptParams?.[param.key] ?? param.defaultValue)}
                    onChange={(e) => {
                      onUpdateActor({
                        ...actor,
                        customScriptParams: {
                          ...actor.customScriptParams,
                          [param.key]: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[9px] text-slate-400">{param.description}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Action Buttons: Duplicate, Add, Delete */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-duplicate-actor"
            onClick={() => onDuplicateActor(actor)}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-sky-400" />
            <span>Duplicate</span>
          </button>
          <button
            id="btn-delete-actor"
            onClick={() => onDeleteActor(actor.uid)}
            className="py-2 px-3 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        <button
          id="btn-spawn-another-actor"
          onClick={() => setShowAddActorModal(true)}
          className="w-full py-2 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add Another Actor</span>
        </button>
      </div>

      {showAddActorModal && renderAddModal()}
    </div>
  );
};
