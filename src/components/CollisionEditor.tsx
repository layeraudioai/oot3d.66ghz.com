import React, { useState } from 'react';
import {
  CollisionPolygon,
  CollisionSurfaceType,
  CollisionWallFlag,
  OoT3DScene,
} from '../types/oot3d';
import {
  Layers,
  Paintbrush,
  Plus,
  Trash2,
  Shield,
  Footprints,
  Volume2,
  Eye,
  Info,
} from 'lucide-react';

interface CollisionEditorProps {
  scene: OoT3DScene;
  selectedPolyId: number | null;
  onSelectPoly: (id: number | null) => void;
  onUpdatePoly: (poly: CollisionPolygon) => void;
  onAddCollisionPlatform: (surface: CollisionSurfaceType) => void;
  onDeletePoly: (id: number) => void;
  paintBrushSurface: CollisionSurfaceType;
  onChangePaintBrush: (surface: CollisionSurfaceType) => void;
  isPaintBrushActive: boolean;
  onTogglePaintBrush: () => void;
}

const SURFACE_PALETTE: {
  type: CollisionSurfaceType;
  label: string;
  color: string;
  soundHint: string;
}[] = [
  { type: 'grass', label: 'Grass / Foliage', color: '#22c55e', soundHint: 'Soft rustle footsteps' },
  { type: 'stone', label: 'Stone / Marble', color: '#94a3b8', soundHint: 'Hard echo footsteps' },
  { type: 'wood', label: 'Wood / Plank', color: '#b45309', soundHint: 'Hollow creak footsteps' },
  { type: 'dirt', label: 'Dirt / Soil', color: '#a16207', soundHint: 'Muffled thud footsteps' },
  { type: 'water', label: 'Water (Shallow)', color: '#06b6d4', soundHint: 'Splash FX & ripple waves' },
  { type: 'ice', label: 'Ice / Slick', color: '#38bdf8', soundHint: 'Skating momentum loss' },
  { type: 'lava', label: 'Lava (Damage)', color: '#ef4444', soundHint: '1/2 Heart burn recoil' },
  { type: 'quicksand', label: 'Quicksand (Slow)', color: '#d97706', soundHint: 'Sink & pull velocity' },
  { type: 'void', label: 'Void (Fall Death)', color: '#7e22ce', soundHint: 'Blackout respawn trigger' },
];

const WALL_FLAGS: { type: CollisionWallFlag; label: string; description: string }[] = [
  { type: 'none', label: 'Standard Wall', description: 'Impassable solid barrier' },
  { type: 'climbable', label: 'Climbable Vines', description: 'Link grabs and ascends wall' },
  { type: 'ladder', label: 'Wooden Ladder', description: 'Vertical climbing ladder' },
  { type: 'hookshotable', label: 'Hookshot Target', description: 'Pulls Link to surface target' },
  { type: 'steep_slide', label: 'Steep Slide', description: 'Forced sliding down slope' },
];

export const CollisionEditor: React.FC<CollisionEditorProps> = ({
  scene,
  selectedPolyId,
  onSelectPoly,
  onUpdatePoly,
  onAddCollisionPlatform,
  onDeletePoly,
  paintBrushSurface,
  onChangePaintBrush,
  isPaintBrushActive,
  onTogglePaintBrush,
}) => {
  const [activeTab, setActiveTab] = useState<'paint' | 'inspector' | 'list'>('paint');

  const selectedPoly = scene.collisionPolygons.find((p) => p.id === selectedPolyId);

  // Statistics
  const totalPolys = scene.collisionPolygons.length;
  const waterCount = scene.collisionPolygons.filter((p) => p.surfaceType === 'water').length;
  const climbableCount = scene.collisionPolygons.filter((p) => p.wallFlag === 'climbable').length;
  const voidCount = scene.collisionPolygons.filter((p) => p.surfaceType === 'void').length;

  return (
    <div id="collision-editor-panel" className="p-4 space-y-4 text-xs text-slate-300 overflow-y-auto max-h-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Collision Map Editor</h3>
            <p className="text-[11px] text-slate-400">OoT3D PICA200 Mesh Physical Geometry</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('paint')}
          className={`py-1.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            activeTab === 'paint' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Surface Brush</span>
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`py-1.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            activeTab === 'inspector' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Poly Details</span>
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`py-1.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            activeTab === 'list' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>All ({totalPolys})</span>
        </button>
      </div>

      {/* TAB 1: Surface Paint Brush */}
      {activeTab === 'paint' && (
        <div className="space-y-4">
          {/* Paint Mode Toggle Banner */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              isPaintBrushActive
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paintbrush
                  className={`w-4 h-4 ${isPaintBrushActive ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`}
                />
                <span className="font-semibold text-xs">
                  {isPaintBrushActive ? 'Paint Brush Active (Click in 3D View)' : 'Paint Brush Inactive'}
                </span>
              </div>
              <button
                id="btn-toggle-paint-brush"
                onClick={onTogglePaintBrush}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isPaintBrushActive
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isPaintBrushActive ? 'Disable Brush' : 'Enable Brush'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Select a physical surface below, then click any polygon in the 3D viewport to apply that
              material and footstep sound instantly!
            </p>
          </div>

          {/* Surface Type Palette */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Active Surface Material
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {SURFACE_PALETTE.map((mat) => (
                <button
                  key={mat.type}
                  onClick={() => onChangePaintBrush(mat.type)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    paintBrushSurface === mat.type
                      ? 'bg-slate-800 border-sky-500 ring-1 ring-sky-500/50 text-white'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                      style={{ backgroundColor: mat.color }}
                    />
                    <div>
                      <span className="font-medium text-xs">{mat.label}</span>
                      <span className="text-[10px] text-slate-400 ml-2">({mat.soundHint})</span>
                    </div>
                  </div>
                  {paintBrushSurface === mat.type && (
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add New Collision Geometry */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Add Collision Geometry
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-add-platform-grass"
                onClick={() => onAddCollisionPlatform('grass')}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Grass Platform</span>
              </button>
              <button
                id="btn-add-platform-water"
                onClick={() => onAddCollisionPlatform('water')}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>+ Water Pool</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Poly Inspector */}
      {activeTab === 'inspector' && (
        <div className="space-y-4">
          {!selectedPoly ? (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No collision polygon selected.</p>
              <p className="text-[11px]">Click any polygon in the 3D viewport to inspect its properties.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Polygon ID</span>
                  <div className="font-mono text-sm font-bold text-amber-400">#{selectedPoly.id}</div>
                </div>
                <button
                  id="btn-delete-poly"
                  onClick={() => onDeletePoly(selectedPoly.id)}
                  className="p-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 rounded-lg cursor-pointer transition-colors"
                  title="Delete Polygon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Surface Type selection for this poly */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Surface Material
                </label>
                <select
                  value={selectedPoly.surfaceType}
                  onChange={(e) =>
                    onUpdatePoly({
                      ...selectedPoly,
                      surfaceType: e.target.value as CollisionSurfaceType,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {SURFACE_PALETTE.map((s) => (
                    <option key={s.type} value={s.type}>
                      {s.label} ({s.soundHint})
                    </option>
                  ))}
                </select>
              </div>

              {/* Wall Flag */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Wall Physics & Climbing Flag
                </label>
                <div className="space-y-1.5">
                  {WALL_FLAGS.map((f) => (
                    <label
                      key={f.type}
                      className={`p-2 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-colors ${
                        selectedPoly.wallFlag === f.type
                          ? 'bg-slate-800 border-sky-500 text-white'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="wallFlag"
                        checked={selectedPoly.wallFlag === f.type}
                        onChange={() =>
                          onUpdatePoly({
                            ...selectedPoly,
                            wallFlag: f.type,
                          })
                        }
                        className="text-sky-500 focus:ring-0"
                      />
                      <div>
                        <div className="font-medium text-xs">{f.label}</div>
                        <div className="text-[10px] text-slate-400">{f.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sound and Camera Triggers */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Volume2 className="w-3 h-3 text-sky-400" />
                    <span>SFX ID</span>
                  </label>
                  <input
                    type="number"
                    value={selectedPoly.soundEffectId}
                    onChange={(e) =>
                      onUpdatePoly({
                        ...selectedPoly,
                        soundEffectId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-xs font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>Camera CamID</span>
                  </label>
                  <input
                    type="number"
                    value={selectedPoly.cameraTriggerId}
                    onChange={(e) =>
                      onUpdatePoly({
                        ...selectedPoly,
                        cameraTriggerId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-xs font-mono text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: All Polygons List */}
      {activeTab === 'list' && (
        <div className="space-y-3">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Total</div>
              <div className="font-mono text-sm font-bold text-slate-100">{totalPolys}</div>
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 uppercase">Water</div>
              <div className="font-mono text-sm font-bold text-cyan-300">{waterCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-amber-400 uppercase">Climbable</div>
              <div className="font-mono text-sm font-bold text-amber-300">{climbableCount}</div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {scene.collisionPolygons.map((poly) => {
              const isSelected = poly.id === selectedPolyId;
              const palette = SURFACE_PALETTE.find((s) => s.type === poly.surfaceType);
              return (
                <button
                  key={poly.id}
                  onClick={() => {
                    onSelectPoly(poly.id);
                    setActiveTab('inspector');
                  }}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: palette?.color || '#94a3b8' }}
                    />
                    <span className="font-mono text-xs font-semibold">Poly #{poly.id}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{poly.surfaceType}</span>
                  </div>
                  {poly.wallFlag !== 'none' && (
                    <span className="text-[9px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 px-1.5 py-0.5 rounded uppercase">
                      {poly.wallFlag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
