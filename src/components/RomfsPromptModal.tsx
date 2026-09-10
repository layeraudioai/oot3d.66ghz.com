import React, { useState, useRef, useEffect } from 'react';
import {
  FolderArchive,
  HardDrive,
  FolderOpen,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileCode,
  X,
  UploadCloud,
  FileArchive,
  Files,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  promptRomfsDirectoryPicker,
  parseRomfsFileList,
  parseRomfsZip,
  readDroppedFiles,
  RomfsScanResult,
} from '../services/romfsService';
import { OoT3DTitleId, RomFsDirectory } from '../types/oot3d';

interface RomfsPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadRomfs: (result: RomfsScanResult) => void;
  onLoadSampleProject: () => void;
  currentDirectory: RomFsDirectory | null;
}

export const RomfsPromptModal: React.FC<RomfsPromptModalProps> = ({
  isOpen,
  onClose,
  onLoadRomfs,
  onLoadSampleProject,
  currentDirectory,
}) => {
  const [selectedTitleId, setSelectedTitleId] = useState<OoT3DTitleId>(
    currentDirectory?.titleId || '0004000000033500'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [scanPreview, setScanPreview] = useState<RomfsScanResult | null>(null);

  // Input refs for direct synchronous invocation
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  if (!isOpen) return null;

  // 1. Direct Folder Input (Synchronous native directory browser)
  const handleSelectFolderClick = () => {
    setError(null);
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
      folderInputRef.current.click();
    }
  };

  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsLoading(true);
    setLoadingMessage('Parsing selected RomFS folder structure...');
    setError(null);

    try {
      const result = parseRomfsFileList(e.target.files);
      result.directory.titleId = selectedTitleId;
      setScanPreview(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to scan selected folder.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Direct Zip Input
  const handleSelectZipClick = () => {
    setError(null);
    if (zipInputRef.current) {
      zipInputRef.current.value = '';
      zipInputRef.current.click();
    }
  };

  const handleZipInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setLoadingMessage(`Unpacking ${file.name} in browser...`);
    setError(null);

    try {
      const result = await parseRomfsZip(file);
      result.directory.titleId = selectedTitleId;
      setScanPreview(result);
    } catch (err: any) {
      setError(`Failed to extract Zip archive: ${err?.message || 'Invalid format'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Direct Individual Files Input
  const handleSelectFilesClick = () => {
    setError(null);
    if (filesInputRef.current) {
      filesInputRef.current.value = '';
      filesInputRef.current.click();
    }
  };

  const handleFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsLoading(true);
    setLoadingMessage(`Scanning ${e.target.files.length} selected files...`);
    setError(null);

    try {
      const result = parseRomfsFileList(e.target.files);
      result.directory.titleId = selectedTitleId;
      setScanPreview(result);
    } catch (err: any) {
      setError('Failed to scan selected files.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Drag & Drop Handling (Supports folders and zip files)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if user dropped a single .zip file
      if (files.length === 1 && files[0].name.toLowerCase().endsWith('.zip')) {
        setLoadingMessage(`Unpacking dropped archive ${files[0].name}...`);
        const result = await parseRomfsZip(files[0]);
        result.directory.titleId = selectedTitleId;
        setScanPreview(result);
      } else {
        setLoadingMessage('Scanning dropped folder hierarchy...');
        const extractedFiles = await readDroppedFiles(e.dataTransfer);
        if (extractedFiles.length === 0) {
          throw new Error('No files detected in dropped items.');
        }
        const result = parseRomfsFileList(extractedFiles);
        result.directory.titleId = selectedTitleId;
        setScanPreview(result);
      }
    } catch (err: any) {
      setError(err?.message || 'Could not parse dropped files. Try using the folder picker button.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Chromium File System Access API (For standalone tabs / direct disk sync)
  const handleChromiumFileSystemPicker = async () => {
    if (isInIframe) {
      setError(
        'Browsers restrict the live two-way File System API inside embedded preview iframes. Use "Browse Folder", "Open RomFS .ZIP", or drag-and-drop below!'
      );
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Connecting to system directory via File System Access API...');
    setError(null);

    try {
      const result = await promptRomfsDirectoryPicker();
      result.directory.titleId = selectedTitleId;
      setScanPreview(result);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setIsLoading(false);
        return;
      }
      if (err.message === 'IFRAME_PERMISSION_RESTRICTION') {
        setError('Sandbox restriction: Please use the "Choose RomFS Folder" button or drag-and-drop.');
      } else {
        setError('Could not access folder via File System API. Use the folder picker button instead.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm scan and load into editor
  const handleConfirmLoad = () => {
    if (!scanPreview) return;
    const finalResult = {
      ...scanPreview,
      directory: {
        ...scanPreview.directory,
        titleId: selectedTitleId,
      },
    };
    onLoadRomfs(finalResult);
    onClose();
  };

  return (
    <div
      id="romfs-prompt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file inputs for direct native OS browser triggers */}
      <input
        ref={folderInputRef}
        type="file"
        {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
        multiple
        className="hidden"
        onChange={handleFolderInputChange}
      />
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,application/zip"
        className="hidden"
        onChange={handleZipInputChange}
      />
      <input
        ref={filesInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilesInputChange}
      />

      <div
        id="romfs-prompt-modal-card"
        className={`w-full max-w-2xl bg-slate-900 border transition-all duration-200 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col ${
          isDragging
            ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-[1.01]'
            : 'border-slate-700/80'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Connect OoT3D RomFS Dump
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Load your decrypted Nintendo 3DS RomFS dump to inspect scenes, collision maps, textures, and scripts.
              </p>
            </div>
          </div>
          {currentDirectory && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3.5 text-sky-300 text-xs flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>{loadingMessage || 'Processing files...'}</span>
            </div>
          )}

          {/* Region / Target Title ID */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Game Version & Title ID (CTR Target)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  id: '0004000000033500' as OoT3DTitleId,
                  region: 'USA',
                  title: 'North America',
                },
                {
                  id: '0004000000033600' as OoT3DTitleId,
                  region: 'EUR',
                  title: 'Europe / Australia',
                },
                {
                  id: '0004000000033400' as OoT3DTitleId,
                  region: 'JPN',
                  title: 'Japan',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTitleId(item.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTitleId === item.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.region}
                  </div>
                  <div className="font-semibold text-xs text-slate-100">{item.title}</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                    {item.id}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scan Results Preview Card if files scanned */}
          {scanPreview ? (
            <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RomFS Dump Successfully Scanned</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {scanPreview.directory.filesCount} files detected
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Folder / Archive Name</span>
                  <span className="font-mono text-slate-200 font-medium truncate block">
                    {scanPreview.directory.name}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Detected Subfolders</span>
                  <span className="font-mono text-slate-200 font-medium truncate block">
                    {scanPreview.detectedFolders.length > 0
                      ? scanPreview.detectedFolders.slice(0, 4).join(', ')
                      : 'Standard RomFS tree'}
                  </span>
                </div>
              </div>

              {scanPreview.detectedScenes && scanPreview.detectedScenes.length > 0 && (
                <div className="text-[11px] text-slate-300 bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 font-medium mr-1.5">Detected OoT3D Scenes:</span>
                  <span className="font-mono text-sky-300">
                    {scanPreview.detectedScenes.slice(0, 5).join(', ')}
                    {scanPreview.detectedScenes.length > 5 && ` (+${scanPreview.detectedScenes.length - 5} more)`}
                  </span>
                </div>
              )}

              <div className="pt-1 flex items-center gap-2.5">
                <button
                  id="btn-confirm-load-romfs"
                  onClick={handleConfirmLoad}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
                >
                  <span>Load Into Mod Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setScanPreview(null)}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Choose Different
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Drag and Drop Zone */}
              <div
                id="romfs-dropzone"
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Drag & drop your <code className="text-sky-300">romfs/</code> folder or{' '}
                      <code className="text-sky-300">.zip</code> here
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Supports dumped folders from GodMode9, Citra / Azahar directories, or compressed zip archives
                    </p>
                  </div>

                  {/* Primary & Secondary Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <button
                      id="btn-select-romfs-folder"
                      type="button"
                      onClick={handleSelectFolderClick}
                      disabled={isLoading}
                      className="py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-sky-950/40"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Choose RomFS Folder</span>
                    </button>

                    <button
                      id="btn-select-romfs-zip"
                      type="button"
                      onClick={handleSelectZipClick}
                      disabled={isLoading}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                    >
                      <FileArchive className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open .ZIP Archive</span>
                    </button>

                    <button
                      id="btn-select-romfs-files"
                      type="button"
                      onClick={handleSelectFilesClick}
                      disabled={isLoading}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700/60"
                      title="Select individual romfs files (zsi, ctxb, bin) if your file manager doesn't support folder selection"
                    >
                      <Files className="w-3.5 h-3.5 text-slate-400" />
                      <span>Select Files</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Pre-packaged Sample Project Banner */}
              <div className="bg-emerald-950/15 border border-emerald-500/25 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-300">
                      Don't have your dump ready?
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Start instantly with preloaded Kokiri Forest, Temple of Time, Deku Tree, and texture kit!
                    </div>
                  </div>
                </div>
                <button
                  id="btn-load-sample-project"
                  type="button"
                  onClick={() => {
                    onLoadSampleProject();
                    onClose();
                  }}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Load Sample</span>
                </button>
              </div>
            </>
          )}

          {/* Quick Help & Expected Folder Structure */}
          <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Expected OoT3D RomFS Directory Hierarchy:</span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 pl-2 border-l border-slate-700 space-y-0.5">
              <div>📁 romfs/</div>
              <div className="pl-3">├── 📁 scene/ &nbsp;&nbsp;(e.g. spot04_info.zsi, tokinoma_info.zsi)</div>
              <div className="pl-3">├── 📁 actor/ &nbsp;&nbsp;(CTR actor archives, model binaries)</div>
              <div className="pl-3">├── 📁 tex/ &nbsp;&nbsp;&nbsp;&nbsp;(oot3d-texkit .ctxb CTR textures)</div>
              <div className="pl-3">└── 📁 scripts/ (Custom C/Lua actor attachments)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-emerald-500" />
            <span>Compatible with Luma3DS LayeredFS & Citra / Azahar</span>
          </div>
          {currentDirectory && (
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Continue Editing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
