import React, { useState } from 'react';
import {
  CustomObjectType,
  CustomScript,
  OoT3DMusicTrack,
  OoT3DScene,
  OoT3DTexture,
  OoT3DTitleId,
} from '../types/oot3d';
import { buildLumaRomfsZip } from '../services/romfsService';
import {
  Download,
  FolderArchive,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Sparkles,
  X,
  FileText,
  Music,
} from 'lucide-react';

interface LumaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: OoT3DScene[];
  textures: OoT3DTexture[];
  scripts: CustomScript[];
  customObjects: CustomObjectType[];
  currentTitleId: OoT3DTitleId;
  musicTracks?: OoT3DMusicTrack[];
}

export const LumaExportModal: React.FC<LumaExportModalProps> = ({
  isOpen,
  onClose,
  scenes,
  textures,
  scripts,
  customObjects,
  currentTitleId,
  musicTracks = [],
}) => {
  const [targetTitleId, setTargetTitleId] = useState<OoT3DTitleId>(currentTitleId);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [buildComplete, setBuildComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const modifiedTexturesCount = textures.filter((t) => t.isModified).length;
  const customActorsCount = scenes.reduce(
    (acc, scene) =>
      acc +
      scene.rooms.reduce(
        (roomAcc, r) => roomAcc + r.actors.filter((a) => a.attachedScriptId || a.actorId >= 0x0180).length,
        0
      ),
    0
  );

  const handleBuildAndDownload = async () => {
    setIsBuilding(true);
    try {
      const blob = await buildLumaRomfsZip(
        scenes,
        textures,
        scripts,
        customObjects,
        targetTitleId,
        musicTracks
      );

      // Trigger automatic browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OoT3D_Luma_RomFS_Mod_${targetTitleId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBuildComplete(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div
      id="luma-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        id="luma-export-modal-card"
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Build Luma RomFS Mod (.zip)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Packages level data, collision maps, oot3d-texkit textures, and scripts for 3DS hardware.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs text-slate-300">
          {/* Target Title ID */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target 3DS Title ID (Luma layeredfs)
            </label>
            <select
              value={targetTitleId}
              onChange={(e) => setTargetTitleId(e.target.value as OoT3DTitleId)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-mono"
            >
              <option value="0004000000033500">0004000000033500 - USA (North America)</option>
              <option value="0004000000033600">0004000000033600 - EUR (Europe / Australia)</option>
              <option value="0004000000033400">0004000000033400 - JPN (Japan)</option>
            </select>
          </div>

          {/* Package Manifest Summary */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Package Manifest:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Scenes Compiled:</span>
                <span className="font-semibold text-emerald-400">{scenes.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">oot3d-texkit Textures:</span>
                <span className="font-semibold text-sky-400">
                  {textures.length} ({modifiedTexturesCount} modded)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Custom Scripts:</span>
                <span className="font-semibold text-purple-400">{scripts.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Custom Objects:</span>
                <span className="font-semibold text-amber-400">{customObjects.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Audio Sequences:</span>
                <span className="font-semibold text-pink-400">
                  {musicTracks.length} tracks (BCSAR)
                </span>
              </div>
            </div>
          </div>

          {/* Hardware Installation Steps */}
          <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 text-xs">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>How to play on your Nintendo 3DS:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
              <li>
                Extract this ZIP and copy the <code className="text-emerald-400">luma/</code> folder to the
                root of your 3DS SD Card:
                <br />
                <span className="font-mono text-[10px] text-sky-300 pl-4 block mt-0.5">
                  SD:/luma/titles/{targetTitleId}/romfs/...
                </span>
              </li>
              <li>Hold <code className="text-amber-300">SELECT</code> while turning on your 3DS.</li>
              <li>
                Enable <code className="text-emerald-300">[x] Enable game patching</code> in Luma3DS
                menu, then press <code className="text-slate-200">START</code>.
              </li>
              <li>Boot Ocarina of Time 3D — your custom level, textures, and scripts are live!</li>
            </ol>
          </div>

          {buildComplete && (
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-3 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Mod package built and downloaded successfully! Ready for SD card or Citra.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer text-xs"
          >
            Cancel
          </button>

          <button
            id="btn-confirm-build-luma"
            onClick={handleBuildAndDownload}
            disabled={isBuilding}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
          >
            <Download className="w-4 h-4" />
            <span>{isBuilding ? 'Compiling RomFS Archive...' : 'Download Luma3DS Mod (.zip)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
