import React, { useState, useRef } from 'react';
import {
  CTR_FORMAT_SPECS,
  calculateTextureSize,
  processReplacementImage,
} from '../services/texkitService';
import { CTRTextureFormat, OoT3DTexture } from '../types/oot3d';
import {
  Image as ImageIcon,
  Upload,
  Sliders,
  Download,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';

interface TextureKitEditorProps {
  textures: OoT3DTexture[];
  onUpdateTexture: (updated: OoT3DTexture) => void;
  selectedTextureId: string | null;
  onSelectTexture: (id: string) => void;
}

export const TextureKitEditor: React.FC<TextureKitEditorProps> = ({
  textures,
  onUpdateTexture,
  selectedTextureId,
  onSelectTexture,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hue, setHue] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTex =
    textures.find((t) => t.id === selectedTextureId) || textures[0];

  const filteredTextures =
    activeCategory === 'all'
      ? textures
      : textures.filter((t) => t.category === activeCategory);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedTex) return;
    const file = e.target.files[0];
    setIsProcessing(true);
    try {
      const processed = await processReplacementImage(file, selectedTex.format);
      onUpdateTexture({
        ...selectedTex,
        customDataUrl: processed.dataUrl,
        width: processed.width,
        height: processed.height,
        fileSizeKb: processed.sizeKb,
        isModified: true,
      });
    } catch {
      // ignore
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormatChange = (newFormat: CTRTextureFormat) => {
    if (!selectedTex) return;
    const newSize = calculateTextureSize(
      selectedTex.width,
      selectedTex.height,
      newFormat,
      selectedTex.mipmaps
    );
    onUpdateTexture({
      ...selectedTex,
      format: newFormat,
      fileSizeKb: newSize,
      isModified: true,
    });
  };

  const handleResetTexture = () => {
    if (!selectedTex) return;
    setHue(0);
    setBrightness(100);
    setSaturation(100);
    onUpdateTexture({
      ...selectedTex,
      customDataUrl: undefined,
      isModified: false,
    });
  };

  const handleApplyPreset = (presetName: 'autumn' | 'twilight' | 'cyber') => {
    if (!selectedTex) return;
    let newHue = 0;
    let newSat = 100;
    let newBri = 100;

    if (presetName === 'autumn') {
      newHue = 35;
      newSat = 140;
      newBri = 105;
    } else if (presetName === 'twilight') {
      newHue = 240;
      newSat = 130;
      newBri = 85;
    } else if (presetName === 'cyber') {
      newHue = 180;
      newSat = 160;
      newBri = 110;
    }

    setHue(newHue);
    setSaturation(newSat);
    setBrightness(newBri);

    // Apply via canvas filter to generate modified dataUrl
    const canvas = document.createElement('canvas');
    canvas.width = selectedTex.width;
    canvas.height = selectedTex.height;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (ctx) {
        ctx.filter = `hue-rotate(${newHue}deg) saturate(${newSat}%) brightness(${newBri}%)`;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        onUpdateTexture({
          ...selectedTex,
          customDataUrl: dataUrl,
          isModified: true,
        });
      }
    };
    img.src = selectedTex.dataUrl;
  };

  const formatSpec = selectedTex ? CTR_FORMAT_SPECS[selectedTex.format] : null;

  return (
    <div id="texture-kit-panel" className="h-full flex flex-col bg-slate-900 text-slate-200">
      {/* Top Banner: oot3d-texkit Integration info */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">
                oot3d-texkit Studio
              </h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                folxxsreal/oot3d-texkit CTR Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated PNG → 3DS CTR Texture (.ctxb) encoder & Luma RomFS asset patcher
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'environment', 'object', 'ui'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Texture List Thumbnail Grid */}
        <div className="w-80 border-r border-slate-800 bg-slate-950/40 p-4 overflow-y-auto space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>RomFS Textures ({filteredTextures.length})</span>
            <span className="text-[10px] text-indigo-400 font-mono">PICA200</span>
          </div>

          <div className="space-y-1.5">
            {filteredTextures.map((tex) => {
              const isSelected = selectedTex?.id === tex.id;
              const displayUrl = tex.customDataUrl || tex.dataUrl;
              return (
                <button
                  key={tex.id}
                  onClick={() => onSelectTexture(tex.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40 text-white'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                    <img
                      src={displayUrl}
                      alt={tex.name}
                      className="w-full h-full object-cover"
                    />
                    {tex.isModified && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-bl" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs truncate">{tex.name}</span>
                      {tex.isModified && (
                        <span className="text-[9px] text-amber-400 font-mono">MODDED</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="font-mono bg-slate-950 px-1 rounded border border-slate-800">
                        {tex.format}
                      </span>
                      <span>
                        {tex.width}×{tex.height}
                      </span>
                      <span>{tex.fileSizeKb} KB</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Texture Editor & oot3d-texkit Toolchain */}
        {selectedTex && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Header / Format & File info */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-white tracking-tight">{selectedTex.name}</h3>
                  <span className="font-mono text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                    {selectedTex.originalPath}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Attached to scenes:{' '}
                  <span className="text-slate-300">{selectedTex.attachedScenes.join(', ')}</span>
                </p>
              </div>

              {selectedTex.isModified && (
                <button
                  id="btn-revert-texture"
                  onClick={handleResetTexture}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revert to Stock RomFS</span>
                </button>
              )}
            </div>

            {/* Visual Previews: Before & After */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Stock */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-medium">Original RomFS Texture</span>
                  <span className="font-mono text-[11px]">Stock 3DS Asset</span>
                </div>
                <div className="w-48 h-48 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={selectedTex.dataUrl}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Modded Replacement */}
              <div className="bg-slate-950/80 border border-indigo-500/40 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden">
                <div className="w-full flex items-center justify-between text-xs text-indigo-300 mb-3">
                  <span className="font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Custom Mod Replacement</span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    {selectedTex.isModified ? 'Active Patch' : 'Unmodified'}
                  </span>
                </div>
                <div className="w-48 h-48 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={selectedTex.customDataUrl || selectedTex.dataUrl}
                    alt="Modified"
                    className="max-w-full max-h-full object-contain"
                    style={{
                      filter: selectedTex.customDataUrl
                        ? undefined
                        : `hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${brightness}%)`,
                    }}
                  />
                </div>

                {/* Upload Custom PNG Button Overlay */}
                <div className="mt-3 w-full flex gap-2">
                  <button
                    id="btn-upload-replacement-png"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-950/50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Encoding CTR...' : 'Upload Replacement PNG'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            {/* oot3d-texkit Format & Hardware Configuration */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>PICA200 CTR Texture Compression Settings (oot3d-texkit)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Target Hardware Format
                  </label>
                  <select
                    value={selectedTex.format}
                    onChange={(e) => handleFormatChange(e.target.value as CTRTextureFormat)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {(Object.keys(CTR_FORMAT_SPECS) as CTRTextureFormat[]).map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt} - {CTR_FORMAT_SPECS[fmt].description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Hardware Compression Specs
                  </label>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Compression Ratio:</span>
                      <span className="font-mono text-emerald-400">{formatSpec?.compressionRatio}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Alpha Channel:</span>
                      <span>{formatSpec?.hasAlpha ? 'Supported (Cutout/Smooth)' : 'None (Opaque)'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Payload Size (.ctxb):</span>
                      <span className="font-mono text-indigo-300">{selectedTex.fileSizeKb} KB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets & Live Filter Adjustments */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Color & Palette Shifter</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApplyPreset('autumn')}
                    className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/40 text-amber-300 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Autumn Gold
                  </button>
                  <button
                    onClick={() => handleApplyPreset('twilight')}
                    className="px-2.5 py-1 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 text-indigo-300 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Twilight Purple
                  </button>
                  <button
                    onClick={() => handleApplyPreset('cyber')}
                    className="px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 text-cyan-300 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Frost Cyan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Hue Shift</span>
                    <span className="font-mono">{hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Saturation</span>
                    <span className="font-mono">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Brightness</span>
                    <span className="font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
