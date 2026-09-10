import React, { useState, useCallback, useEffect } from 'react';
import {
  ACTOR_DEFINITIONS,
  DEFAULT_CUSTOM_OBJECTS,
  DEFAULT_CUSTOM_SCRIPTS,
  SAMPLE_SCENES,
  SAMPLE_TEXTURES,
  generateScenesFromDetected,
} from './data/sampleRomfs';
import { SAMPLE_MUSIC_TRACKS } from './data/sampleMusic';
import {
  CollisionPolygon,
  CollisionSurfaceType,
  CustomObjectType,
  CustomScript,
  EditorMode,
  OoT3DMusicTrack,
  OoT3DScene,
  OoT3DTexture,
  RomFsDirectory,
  SceneActor,
  Vector3D,
} from './types/oot3d';
import { HeaderBar } from './components/HeaderBar';
import { SceneHierarchy } from './components/SceneHierarchy';
import { Viewport3D } from './components/Viewport3D';
import { ActorInspector } from './components/ActorInspector';
import { CollisionEditor } from './components/CollisionEditor';
import { TextureKitEditor } from './components/TextureKitEditor';
import { ScriptAttacher } from './components/ScriptAttacher';
import { MusicEditor } from './components/MusicEditor';
import { RomfsPromptModal } from './components/RomfsPromptModal';
import { LumaExportModal } from './components/LumaExportModal';

export default function App() {
  // Core RomFS project state
  const [currentDirectory, setCurrentDirectory] = useState<RomFsDirectory | null>({
    name: 'oot3d_romfs_dump',
    titleId: '0004000000033500',
    region: 'USA',
    path: '/romfs',
    filesCount: 184,
    isCustomLoaded: false,
    hasUnsavedChanges: false,
  });

  const [scenes, setScenes] = useState<OoT3DScene[]>(SAMPLE_SCENES);
  const [activeSceneId, setActiveSceneId] = useState<string>('spot04');
  const [activeRoomId, setActiveRoomId] = useState<number>(0);

  // Undo / Redo History stack
  const [history, setHistory] = useState<OoT3DScene[][]>([SAMPLE_SCENES]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushHistoryState = useCallback((newScenes: OoT3DScene[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const updated = [...sliced, newScenes].slice(-40);
      return updated;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 39));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevScenes = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setScenes(prevScenes);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextScenes = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setScenes(nextScenes);
    }
  }, [history, historyIndex]);

  // Global Ctrl+Z / Ctrl+Y Hotkeys
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleUndo, handleRedo]);

  // Editor mode & selections
  const [editorMode, setEditorMode] = useState<EditorMode>('scene');
  const [selectedActorUid, setSelectedActorUid] = useState<string | null>('act_spot04_01');
  const [selectedPolyId, setSelectedPolyId] = useState<number | null>(null);

  // Textures (oot3d-texkit)
  const [textures, setTextures] = useState<OoT3DTexture[]>(SAMPLE_TEXTURES);
  const [selectedTextureId, setSelectedTextureId] = useState<string | null>(SAMPLE_TEXTURES[0].id);

  // Scripts & Custom Object Types
  const [scripts, setScripts] = useState<CustomScript[]>(DEFAULT_CUSTOM_SCRIPTS);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(DEFAULT_CUSTOM_SCRIPTS[0].id);
  const [customObjects, setCustomObjects] = useState<CustomObjectType[]>(DEFAULT_CUSTOM_OBJECTS);

  // Audio Sequences & BGM Studio
  const [musicTracks, setMusicTracks] = useState<OoT3DMusicTrack[]>(SAMPLE_MUSIC_TRACKS);

  // Modals
  const [isRomfsModalOpen, setIsRomfsModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Collision brush
  const [paintBrushSurface, setPaintBrushSurface] = useState<CollisionSurfaceType>('grass');
  const [isPaintBrushActive, setIsPaintBrushActive] = useState<boolean>(false);

  // Active Scene helper
  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];
  const activeRoom = activeScene.rooms.find((r) => r.id === activeRoomId) || activeScene.rooms[0];
  const selectedActor = activeRoom.actors.find((a) => a.uid === selectedActorUid) || null;

  // Actor Handlers
  const handleUpdateActorPosition = (uid: string, newPos: Vector3D) => {
    setScenes((prev) =>
      prev.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          rooms: s.rooms.map((room) => {
            if (room.id !== activeRoomId) return room;
            return {
              ...room,
              actors: room.actors.map((a) => (a.uid === uid ? { ...a, position: newPos } : a)),
            };
          }),
        };
      })
    );
  };

  const handleUpdateActorRotation = (uid: string, yawDelta: number) => {
    setScenes((prev) =>
      prev.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          rooms: s.rooms.map((room) => {
            if (room.id !== activeRoomId) return room;
            return {
              ...room,
              actors: room.actors.map((a) =>
                a.uid === uid
                  ? {
                      ...a,
                      rotation: {
                        ...a.rotation,
                        y: Math.round((a.rotation.y + yawDelta) % 360),
                      },
                    }
                  : a
              ),
            };
          }),
        };
      })
    );
  };

  const handleUpdateActor = (updated: SceneActor) => {
    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          rooms: s.rooms.map((room) => {
            if (room.id !== activeRoomId) return room;
            return {
              ...room,
              actors: room.actors.map((a) => (a.uid === updated.uid ? updated : a)),
            };
          }),
        };
      });
      pushHistoryState(nextScenes);
      return nextScenes;
    });
  };

  const handleDeleteActor = (uid: string) => {
    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          rooms: s.rooms.map((room) => {
            if (room.id !== activeRoomId) return room;
            return {
              ...room,
              actors: room.actors.filter((a) => a.uid !== uid),
            };
          }),
        };
      });
      pushHistoryState(nextScenes);
      return nextScenes;
    });
    if (selectedActorUid === uid) {
      setSelectedActorUid(null);
    }
  };

  const handleDuplicateActor = (actorToDup: SceneActor) => {
    const newUid = `act_${Date.now()}`;
    const duplicated: SceneActor = {
      ...actorToDup,
      uid: newUid,
      name: `${actorToDup.name} (Copy)`,
      position: {
        x: actorToDup.position.x + 40,
        y: actorToDup.position.y,
        z: actorToDup.position.z + 40,
      },
    };

    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          rooms: s.rooms.map((room) => {
            if (room.id !== activeRoomId) return room;
            return {
              ...room,
              actors: [...room.actors, duplicated],
            };
          }),
        };
      });
      pushHistoryState(nextScenes);
      return nextScenes;
    });
    setSelectedActorUid(newUid);
  };

  const handleAddNewActor = (actorId: number, position?: Vector3D) => {
    const def = ACTOR_DEFINITIONS.find((d) => d.id === actorId);
    const newUid = `act_${Date.now()}`;
    const newActor: SceneActor = {
      uid: newUid,
      actorId,
      name: def?.name || `Actor_0x${actorId.toString(16)}`,
      roomId: activeRoomId,
      position: position ? { ...position } : { x: 0, y: 0, z: 150 },
      rotation: { x: 0, y: 0, z: 0 },
      variable: def?.defaultVariable ?? 0x0000,
    };

    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          rooms: s.rooms.map((room) => {
            if (room.id !== activeRoomId) return room;
            return {
              ...room,
              actors: [...room.actors, newActor],
            };
          }),
        };
      });
      pushHistoryState(nextScenes);
      return nextScenes;
    });
    setSelectedActorUid(newUid);
  };

  // Collision Handlers
  const handleUpdatePoly = (updatedPoly: CollisionPolygon) => {
    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          collisionPolygons: s.collisionPolygons.map((p) =>
            p.id === updatedPoly.id ? updatedPoly : p
          ),
        };
      });
      pushHistoryState(nextScenes);
      return nextScenes;
    });
  };

  const handlePaintPoly = (polyId: number) => {
    if (!isPaintBrushActive) return;
    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          collisionPolygons: s.collisionPolygons.map((p) => {
            if (p.id !== polyId) return p;
            return {
              ...p,
              surfaceType: paintBrushSurface,
              soundEffectId: paintBrushSurface === 'water' ? 6 : paintBrushSurface === 'grass' ? 1 : 2,
            };
          }),
        };
      });
      pushHistoryState(nextScenes);
      return nextScenes;
    });
  };

  const handleAddCollisionPlatform = (surface: CollisionSurfaceType) => {
    // Note: Using a functional update for setScenes implies we shouldn't rely on 'activeScene' from the outer scope directly if it depends on 'scenes' state which might change.
    // However, the instructions say to refactor "all actor and collision handler functions", retaining existing logic. 
    // The existing logic uses `activeScene` which is `scenes.find(...)`. 
    // This is probably okay for now as 'activeScene' is derived from `scenes` state.
    
    setScenes((prevScenes) => {
      const activeScene = prevScenes.find((s) => s.id === activeSceneId) || prevScenes[0];
      const nextId = Math.max(...activeScene.collisionPolygons.map((p) => p.id), 0) + 1;
      const center = { x: 0, y: 30, z: 0 };
      const size = 150;

      const poly1: CollisionPolygon = {
        id: nextId,
        vertices: [
          { x: center.x - size, y: center.y, z: center.z - size },
          { x: center.x + size, y: center.y, z: center.z - size },
          { x: center.x + size, y: center.y, z: center.z + size },
        ],
        surfaceType: surface,
        wallFlag: 'none',
        soundEffectId: surface === 'grass' ? 1 : 2,
        cameraTriggerId: 0,
        isSpecialFloor: surface === 'water' || surface === 'void',
      };

      const poly2: CollisionPolygon = {
        id: nextId + 1,
        vertices: [
          { x: center.x - size, y: center.y, z: center.z - size },
          { x: center.x + size, y: center.y, z: center.z + size },
          { x: center.x - size, y: center.y, z: center.z + size },
        ],
        surfaceType: surface,
        wallFlag: 'none',
        soundEffectId: surface === 'grass' ? 1 : 2,
        cameraTriggerId: 0,
        isSpecialFloor: surface === 'water' || surface === 'void',
      };

      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          collisionPolygons: [...s.collisionPolygons, poly1, poly2],
        };
      });
      pushHistoryState(nextScenes);
      setSelectedPolyId(nextId);
      return nextScenes;
    });
  };

  const handleDeletePoly = (polyId: number) => {
    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          collisionPolygons: s.collisionPolygons.filter((p) => p.id !== polyId),
        };
      });
      pushHistoryState(nextScenes);
      return nextScenes;
    });
    if (selectedPolyId === polyId) {
      setSelectedPolyId(null);
    }
  };

  // Texture Handlers
  const handleUpdateTexture = (updated: OoT3DTexture) => {
    setTextures((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Script & Custom Object Handlers
  const handleUpdateScript = (updated: CustomScript) => {
    setScripts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleCreateScript = (newScript: CustomScript) => {
    setScripts((prev) => [...prev, newScript]);
  };

  const handleDeleteScript = (scriptId: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== scriptId));
    if (selectedScriptId === scriptId) {
      setSelectedScriptId(scripts[0]?.id || null);
    }
  };

  const handleCreateCustomObject = (newObj: CustomObjectType) => {
    setCustomObjects((prev) => [...prev, newObj]);
  };

  const handlePlaceObjectInScene = (obj: CustomObjectType) => {
    const newUid = `act_custom_${Date.now()}`;
    const newActor: SceneActor = {
      uid: newUid,
      actorId: obj.objectId,
      name: `${obj.name}`,
      roomId: activeRoomId,
      position: { x: 50, y: 0, z: 200 },
      rotation: { x: 0, y: 0, z: 0 },
      variable: 0x0001,
      attachedScriptId: obj.attachedScriptId,
      customScriptParams: {},
      notes: `Custom object type: ${obj.name}`,
    };

    setScenes((prevScenes) => {
      const nextScenes = prevScenes.map((s) => {
        if (s.id !== activeSceneId) return s;
        return {
          ...s,
          rooms: s.rooms.map((room) => {
            if (room.id !== activeRoomId) return room;
            return {
              ...room,
              actors: [...room.actors, newActor],
            };
          }),
        };
      });
      // The original code did not call pushHistoryState here, so I will stick to that.
      return nextScenes;
    });

    setSelectedActorUid(newUid);
    setEditorMode('scene');
  };

  const handleGenerateRandomScene = () => {
    const randomId = `rand_${Math.floor(Math.random() * 10000)}`;
    
    // Select random resources
    const randomMusic = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    const randomActorDef = ACTOR_DEFINITIONS[Math.floor(Math.random() * ACTOR_DEFINITIONS.length)];
    const randomSkybox = ['day', 'night', 'dusk', 'indoor', 'cloudy'][Math.floor(Math.random() * 5)] as OoT3DScene['skybox'];
    
    // Random script/object selection
    const randomObj = customObjects.length > 0 
      ? customObjects[Math.floor(Math.random() * customObjects.length)] 
      : null;
    const randomScript = randomObj 
      ? scripts.find(s => s.id === randomObj.attachedScriptId) || scripts[Math.floor(Math.random() * scripts.length)]
      : scripts[Math.floor(Math.random() * scripts.length)];

    const newScene: OoT3DScene = {
      id: randomId,
      name: `Random ${randomActorDef.name} Scene`,
      japaneseName: `ランダムシーン (${randomId})`,
      sceneZsiPath: `romfs/scene/${randomId}_info.zsi`,
      rooms: [
        {
          id: 0,
          name: 'Random Room',
          ambientColor: randomActorDef.color,
          actors: [
            {
              uid: `act_${randomId}_01`,
              actorId: randomActorDef.id,
              name: `Random ${randomActorDef.name}`,
              roomId: 0,
              position: { x: (Math.random() - 0.5) * 500, y: 0, z: (Math.random() - 0.5) * 500 },
              rotation: { x: 0, y: Math.random() * 360, z: 0 },
              variable: randomActorDef.defaultVariable,
              attachedScriptId: randomScript?.id,
            },
          ],
        },
      ],
      collisionPolygons: [
        {
          id: 1,
          vertices: [
            { x: -500, y: 0, z: -500 },
            { x: 500, y: 0, z: -500 },
            { x: 500, y: 0, z: 500 },
          ],
          surfaceType: ['grass', 'dirt', 'stone', 'wood', 'water'][Math.floor(Math.random() * 5)] as CollisionSurfaceType,
          wallFlag: 'none',
          soundEffectId: 1,
          cameraTriggerId: 0,
          isSpecialFloor: false,
        },
      ],
      skybox: randomSkybox,
      bgmId: randomMusic?.seqId || 0x18,
      bgmName: randomMusic?.name || 'Random BGM',
      entranceTable: [{ spawnX: 0, spawnY: 0, spawnZ: 0, spawnYaw: 0 }],
    };

    setScenes((prevScenes) => {
      const nextScenes = [...prevScenes, newScene];
      pushHistoryState(nextScenes);
      return nextScenes;
    });
    setActiveSceneId(randomId);
    setActiveRoomId(0);
    setSelectedActorUid(newScene.rooms[0].actors[0].uid);
    setSelectedPolyId(null);
  };

  return (
    <div id="oot3d-level-editor-root" className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Global Header Bar */}
      <HeaderBar
        currentDirectory={currentDirectory}
        scenes={scenes}
        activeSceneId={activeSceneId}
        onSelectScene={(sceneId) => {
          setActiveSceneId(sceneId);
          setActiveRoomId(0);
          setSelectedActorUid(null);
          setSelectedPolyId(null);
        }}
        editorMode={editorMode}
        onChangeEditorMode={(mode) => setEditorMode(mode)}
        onOpenRomfsModal={() => setIsRomfsModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onGenerateRandomScene={handleGenerateRandomScene}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* If in Texture Kit Mode */}
        {editorMode === 'textures' ? (
          <TextureKitEditor
            textures={textures}
            onUpdateTexture={handleUpdateTexture}
            selectedTextureId={selectedTextureId}
            onSelectTexture={setSelectedTextureId}
          />
        ) : editorMode === 'scripts' ? (
          /* If in Custom Script Attacher Mode */
          <ScriptAttacher
            scripts={scripts}
            customObjects={customObjects}
            activeScene={activeScene}
            onUpdateScript={handleUpdateScript}
            onCreateScript={handleCreateScript}
            onDeleteScript={handleDeleteScript}
            onCreateCustomObject={handleCreateCustomObject}
            onPlaceObjectInScene={handlePlaceObjectInScene}
            selectedScriptId={selectedScriptId}
            onSelectScript={setSelectedScriptId}
          />
        ) : editorMode === 'music' ? (
          /* If in Music & Sound Studio Mode */
          <MusicEditor
            tracks={musicTracks}
            onUpdateTracks={setMusicTracks}
            scenes={scenes}
            onUpdateScenes={setScenes}
            activeSceneId={activeSceneId}
            onSelectScene={(sceneId) => {
              setActiveSceneId(sceneId);
              setActiveRoomId(0);
            }}
            currentDirectory={currentDirectory}
          />
        ) : (
          /* 3D Scene or Collision Editing Mode */
          <div className="flex-1 flex overflow-hidden">
            {/* Left Hierarchy Sidebar */}
            <SceneHierarchy
              scene={activeScene}
              scenes={scenes}
              currentDirectory={currentDirectory}
              activeRoomId={activeRoomId}
              onSelectRoom={setActiveRoomId}
              selectedActorUid={selectedActorUid}
              onSelectActor={setSelectedActorUid}
              onAddNewActor={handleAddNewActor}
              editorMode={editorMode}
              onSelectScene={(sceneId) => {
                setActiveSceneId(sceneId);
                setActiveRoomId(0);
                setSelectedActorUid(null);
                setSelectedPolyId(null);
              }}
              onChangeEditorMode={setEditorMode}
              onOpenRomfsModal={() => setIsRomfsModalOpen(true)}
            />

            {/* Center: 3D Three.js Viewport */}
            <div className="flex-1 relative overflow-hidden bg-slate-950">
              <Viewport3D
                key={activeScene.id}
                scene={activeScene}
                activeRoomId={activeRoomId}
                selectedActorUid={selectedActorUid}
                onSelectActor={setSelectedActorUid}
                selectedPolyId={selectedPolyId}
                onSelectPoly={setSelectedPolyId}
                editorMode={editorMode}
                onUpdateActorPosition={handleUpdateActorPosition}
                onUpdateActorRotation={handleUpdateActorRotation}
                onPaintPoly={handlePaintPoly}
                onDuplicateActor={handleDuplicateActor}
                onDeleteActor={handleDeleteActor}
                onAddNewActor={handleAddNewActor}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
            </div>

            {/* Right: Contextual Inspector Panel */}
            <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
              {editorMode === 'collision' ? (
                <CollisionEditor
                  key={activeScene.id}
                  scene={activeScene}
                  selectedPolyId={selectedPolyId}
                  onSelectPoly={setSelectedPolyId}
                  onUpdatePoly={handleUpdatePoly}
                  onAddCollisionPlatform={handleAddCollisionPlatform}
                  onDeletePoly={handleDeletePoly}
                  paintBrushSurface={paintBrushSurface}
                  onChangePaintBrush={setPaintBrushSurface}
                  isPaintBrushActive={isPaintBrushActive}
                  onTogglePaintBrush={() => setIsPaintBrushActive(!isPaintBrushActive)}
                />
              ) : (
                <ActorInspector
                  key={selectedActor?.uid || 'none'}
                  actor={selectedActor}
                  onUpdateActor={handleUpdateActor}
                  onDeleteActor={handleDeleteActor}
                  onDuplicateActor={handleDuplicateActor}
                  onAddNewActor={handleAddNewActor}
                  availableScripts={scripts}
                  onOpenScriptEditor={(scriptId) => {
                    setSelectedScriptId(scriptId);
                    setEditorMode('scripts');
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* RomFS Folder Prompt Modal */}
      <RomfsPromptModal
        isOpen={isRomfsModalOpen}
        onClose={() => setIsRomfsModalOpen(false)}
        currentDirectory={currentDirectory}
        onLoadRomfs={(res) => {
          setCurrentDirectory(res.directory);
          if (res.detectedScenes && res.detectedScenes.length > 0) {
            setScenes((prevScenes) => generateScenesFromDetected(res.detectedScenes, prevScenes));
            if (res.detectedScenes.length > 0) {
              setActiveSceneId(res.detectedScenes[0]);
              setActiveRoomId(0);
              setSelectedActorUid(null);
              setSelectedPolyId(null);
            }
          }
          
          // Update Textures
          if (res.fileTree?.tex && res.fileTree.tex.length > 0) {
            const newTextures = res.fileTree.tex.map((texFilename, idx) => {
              const baseName = texFilename.replace(/\.ctxb$/i, '');
              return {
                id: `tex_dump_${idx}_${baseName}`,
                name: `${baseName}_ctxb`,
                category: 'environment' as const,
                width: 256,
                height: 256,
                format: 'ETC1A4' as const,
                originalPath: `romfs/tex/${texFilename}`,
                mipmaps: 3,
                fileSizeKb: 48.0,
                isModified: false,
                attachedScenes: [res.detectedScenes?.[0] || 'spot04'],
                dataUrl:
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="%231e293b"/><text x="128" y="128" font-family="sans-serif" font-size="14" fill="%2338bdf8" text-anchor="middle" dominant-baseline="middle">CTR .ctxb Texture</text></svg>',
              };
            });
            setTextures(newTextures);
            setSelectedTextureId(newTextures[0].id);
          }
          
          // Update Music Tracks
          if (res.fileTree?.sound && res.fileTree.sound.length > 0) {
            const newMusic = res.fileTree.sound
              .filter(f => f.endsWith('.bcseq') || f.endsWith('.bcsar'))
              .map((soundFile, idx) => ({
                id: `mus_dump_${idx}`,
                seqId: idx,
                name: soundFile,
                category: 'custom' as const,
                format: 'bcseq' as const,
                bpm: 120,
                reverb: 0,
                pan: 0,
                isCustom: true,
                assignedScenes: [res.detectedScenes?.[0] || 'spot04'],
              }));
            if (newMusic.length > 0) {
                setMusicTracks(prev => [...prev, ...newMusic]);
            }
          }

          setIsRomfsModalOpen(false);
        }}
        onLoadSampleProject={() => {
          setCurrentDirectory({
            name: 'oot3d_sample_kokiri_romfs',
            titleId: '0004000000033500',
            region: 'USA',
            path: '/romfs',
            filesCount: 248,
            isCustomLoaded: false,
            hasUnsavedChanges: false,
          });
          setScenes(SAMPLE_SCENES);
          setActiveSceneId('spot04');
        }}
      />

      {/* Luma3DS Export Modal */}
      <LumaExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        scenes={scenes}
        textures={textures}
        scripts={scripts}
        customObjects={customObjects}
        currentTitleId={currentDirectory?.titleId || '0004000000033500'}
        musicTracks={musicTracks}
      />
    </div>
  );
}
