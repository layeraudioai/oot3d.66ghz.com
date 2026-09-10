export type OoT3DTitleId = '0004000000033500' | '0004000000033600' | '0004000000033400';

export interface RomFsDirectory {
  name: string;
  titleId: OoT3DTitleId;
  region: 'USA' | 'EUR' | 'JPN';
  path: string;
  filesCount: number;
  isCustomLoaded: boolean;
  hasUnsavedChanges: boolean;
  detectedFolders?: string[];
  detectedFiles?: string[];
  detectedScenes?: string[];
  detectedTexturesCount?: number;
  fileTree?: Record<string, string[]>;
}

export type EditorMode = 'scene' | 'collision' | 'textures' | 'scripts' | 'music';

export type AudioCategory =
  | 'overworld'
  | 'dungeon'
  | 'town'
  | 'battle'
  | 'fanfare'
  | 'ocarina'
  | 'custom';

export interface OoT3DMusicTrack {
  id: string;
  seqId: number; // Hex ID, e.g. 0x18
  name: string;
  japaneseName?: string;
  category: AudioCategory;
  format: 'BCSEQ' | 'BCWAV' | 'MIDI' | 'CWAV';
  bpm: number;
  timeSignature: string;
  volume: number; // 0 - 100
  reverb: number; // 0 - 127
  pan: number; // -100 to 100
  isCustom: boolean;
  assignedScenes: string[];
  notes?: { note: string; duration: number }[];
  fileSizeKb: number;
  filePath: string;
}

export interface SequencerStep {
  step: number;
  activePitches: string[];
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number; // Pitch
  y: number; // Yaw
  z: number; // Roll
}

export interface ActorDefinition {
  id: number; // Hex ID, e.g. 0x0000
  name: string;
  category: 'player' | 'npc' | 'enemy' | 'prop' | 'item' | 'door' | 'custom';
  description: string;
  defaultVariable: number;
  color: string;
  iconName?: string;
  meshType: 'player' | 'chest' | 'npc' | 'enemy' | 'sign' | 'torch' | 'door' | 'crystal' | 'custom';
}

export interface SceneActor {
  uid: string; // Unique instance ID in editor
  actorId: number; // The actor number e.g. 0x0010 (En_Box)
  name: string;
  roomId: number;
  position: Vector3D;
  rotation: Rotation3D;
  variable: number; // 16-bit hex variable/parameter
  attachedScriptId?: string;
  customScriptParams?: Record<string, string | number | boolean>;
  notes?: string;
}

export type CollisionSurfaceType =
  | 'dirt'
  | 'stone'
  | 'wood'
  | 'sand'
  | 'grass'
  | 'water'
  | 'lava'
  | 'quicksand'
  | 'ice'
  | 'void';

export type CollisionWallFlag =
  | 'none'
  | 'climbable'
  | 'ladder'
  | 'hookshotable'
  | 'steep_slide';

export interface CollisionPolygon {
  id: number;
  vertices: [Vector3D, Vector3D, Vector3D];
  surfaceType: CollisionSurfaceType;
  wallFlag: CollisionWallFlag;
  soundEffectId: number;
  cameraTriggerId: number;
  isSpecialFloor: boolean;
}

export type CTRTextureFormat =
  | 'RGBA8'
  | 'RGB565'
  | 'RGBA5551'
  | 'RGBA4444'
  | 'ETC1'
  | 'ETC1A4'
  | 'L8'
  | 'A8';

export interface OoT3DTexture {
  id: string;
  name: string;
  category: 'environment' | 'character' | 'ui' | 'object' | 'custom';
  width: number;
  height: number;
  format: CTRTextureFormat;
  originalPath: string; // romfs/tex/... or scene archive
  dataUrl: string; // Preview image
  customDataUrl?: string; // Replaced image
  isModified: boolean;
  mipmaps: number;
  fileSizeKb: number;
  attachedScenes: string[];
}

export interface CustomScriptParam {
  key: string;
  label: string;
  type: 'number' | 'string' | 'boolean' | 'hex' | 'actor_id';
  defaultValue: string | number | boolean;
  description: string;
}

export interface CustomScript {
  id: string;
  name: string;
  author: string;
  version: string;
  description: string;
  targetHook: 'actor_init' | 'actor_update' | 'actor_draw' | 'collision_touch' | 'event_trigger';
  language: 'C' | 'Lua' | 'Bytecode';
  code: string;
  exposedParams: CustomScriptParam[];
  associatedObjectId?: number;
}

export interface CustomObjectType {
  objectId: number; // e.g. 0x01F0
  name: string;
  description: string;
  defaultMesh: 'crystal' | 'chest' | 'npc' | 'custom';
  collisionRadius: number;
  attachedScriptId: string;
  textureId?: string;
}

export interface SceneRoom {
  id: number;
  name: string;
  actors: SceneActor[];
  ambientColor: string;
}

export interface OoT3DScene {
  id: string; // e.g. "spot04"
  name: string;
  japaneseName: string;
  sceneZsiPath: string;
  rooms: SceneRoom[];
  collisionPolygons: CollisionPolygon[];
  skybox: 'day' | 'night' | 'dusk' | 'indoor' | 'cloudy';
  bgmId: number;
  bgmName: string;
  entranceTable: {
    spawnX: number;
    spawnY: number;
    spawnZ: number;
    spawnYaw: number;
  }[];
}
