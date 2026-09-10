import {
  ActorDefinition,
  CollisionPolygon,
  CustomObjectType,
  CustomScript,
  OoT3DScene,
  OoT3DTexture,
  Vector3D,
} from '../types/oot3d';

// Authentic OoT / OoT3D Actor Catalog
export const ACTOR_DEFINITIONS: ActorDefinition[] = [
  {
    id: 0x0000,
    name: 'Player (Link)',
    category: 'player',
    description: 'Player spawn point and default entrance orientation',
    defaultVariable: 0x0000,
    color: '#10b981', // Green
    meshType: 'player',
  },
  {
    id: 0x0010,
    name: 'En_Box (Treasure Chest)',
    category: 'prop',
    description: 'Interactive treasure chest with customizable item and opening cutscene',
    defaultVariable: 0x4002, // Small wooden chest with heart piece
    color: '#f59e0b', // Amber
    meshType: 'chest',
  },
  {
    id: 0x0027,
    name: 'En_Ko (Kokiri Child)',
    category: 'npc',
    description: 'Kokiri resident with customizable dialogue and patrol behavior',
    defaultVariable: 0x0001,
    color: '#06b6d4', // Cyan
    meshType: 'npc',
  },
  {
    id: 0x0002,
    name: 'Door_Shutter (Dungeon Shutter)',
    category: 'door',
    description: 'Dungeon shutter door activated by switch, room clear, or key',
    defaultVariable: 0x0000,
    color: '#8b5cf6', // Violet
    meshType: 'door',
  },
  {
    id: 0x0003,
    name: 'En_Torch2 (Gossip Stone)',
    category: 'prop',
    description: 'Gossip Stone showing time or hint when wearing Mask of Truth',
    defaultVariable: 0x0000,
    color: '#64748b', // Slate
    meshType: 'sign',
  },
  {
    id: 0x0015,
    name: 'En_Syateki_Man (Shooting Gallery)',
    category: 'npc',
    description: 'Minigame operator and shopkeeper',
    defaultVariable: 0x0000,
    color: '#3b82f6',
    meshType: 'npc',
  },
  {
    id: 0x0032,
    name: 'En_Dekubaba (Deku Baba)',
    category: 'enemy',
    description: 'Carnivorous plant enemy that lunges at Link and drops Deku Sticks',
    defaultVariable: 0x0000,
    color: '#ef4444', // Red
    meshType: 'enemy',
  },
  {
    id: 0x002e,
    name: 'En_Goma (Boss Gohma)',
    category: 'enemy',
    description: 'Parasitic Armored Arachnid Boss with eye vulnerabilities',
    defaultVariable: 0x0000,
    color: '#dc2626',
    meshType: 'enemy',
  },
  {
    id: 0x0034,
    name: 'En_Item00 (Collectible Item)',
    category: 'item',
    description: 'Floating pickup: Green/Blue/Red Rupee, Recovery Heart, Ammo, Bomb',
    defaultVariable: 0x0000, // Green Rupee
    color: '#ec4899',
    meshType: 'crystal',
  },
  {
    id: 0x002c,
    name: 'En_Light (Light / Torch)',
    category: 'prop',
    description: 'Wooden or stone lit torch with interactive fire mechanics',
    defaultVariable: 0x0001,
    color: '#f97316',
    meshType: 'torch',
  },
  {
    id: 0x0180,
    name: 'Custom_Scripted_Actor (Custom)',
    category: 'custom',
    description: 'Custom object executing user-attached C/Lua script in OoT3D RomFS',
    defaultVariable: 0x0001,
    color: '#a855f7', // Purple
    meshType: 'custom',
  },
];

// Helper to generate a grid of terrain collision triangles
function generateTerrainPolys(
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number,
  y: number,
  step: number,
  surface: 'dirt' | 'grass' | 'stone' | 'wood' | 'water' = 'grass'
): CollisionPolygon[] {
  const polys: CollisionPolygon[] = [];
  let id = 1;
  for (let x = minX; x < maxX; x += step) {
    for (let z = minZ; z < maxZ; z += step) {
      const v0: Vector3D = { x, y, z };
      const v1: Vector3D = { x: x + step, y, z };
      const v2: Vector3D = { x: x + step, y, z: z + step };
      const v3: Vector3D = { x, y, z: z + step };

      polys.push({
        id: id++,
        vertices: [v0, v1, v2],
        surfaceType: surface,
        wallFlag: 'none',
        soundEffectId: surface === 'grass' ? 1 : 2,
        cameraTriggerId: 0,
        isSpecialFloor: false,
      });

      polys.push({
        id: id++,
        vertices: [v0, v2, v3],
        surfaceType: surface,
        wallFlag: 'none',
        soundEffectId: surface === 'grass' ? 1 : 2,
        cameraTriggerId: 0,
        isSpecialFloor: false,
      });
    }
  }
  return polys;
}

// Kokiri Forest (spot04) Collision map
export const KOKIRI_FOREST_COLLISION: CollisionPolygon[] = [
  ...generateTerrainPolys(-1200, 1200, -1200, 1200, 0, 300, 'grass'),
  // Water pond in center
  {
    id: 1001,
    vertices: [
      { x: -300, y: -20, z: -300 },
      { x: 300, y: -20, z: -300 },
      { x: 300, y: -20, z: 300 },
    ],
    surfaceType: 'water',
    wallFlag: 'none',
    soundEffectId: 6,
    cameraTriggerId: 1,
    isSpecialFloor: true,
  },
  {
    id: 1002,
    vertices: [
      { x: -300, y: -20, z: -300 },
      { x: 300, y: -20, z: 300 },
      { x: -300, y: -20, z: 300 },
    ],
    surfaceType: 'water',
    wallFlag: 'none',
    soundEffectId: 6,
    cameraTriggerId: 1,
    isSpecialFloor: true,
  },
  // Wooden bridges / treehouse ramps
  {
    id: 1003,
    vertices: [
      { x: 400, y: 150, z: 400 },
      { x: 700, y: 150, z: 400 },
      { x: 700, y: 150, z: 700 },
    ],
    surfaceType: 'wood',
    wallFlag: 'none',
    soundEffectId: 4,
    cameraTriggerId: 0,
    isSpecialFloor: false,
  },
  {
    id: 1004,
    vertices: [
      { x: 400, y: 150, z: 400 },
      { x: 700, y: 150, z: 700 },
      { x: 400, y: 150, z: 700 },
    ],
    surfaceType: 'wood',
    wallFlag: 'none',
    soundEffectId: 4,
    cameraTriggerId: 0,
    isSpecialFloor: false,
  },
  // Climbable vines on tree trunk wall
  {
    id: 1005,
    vertices: [
      { x: 400, y: 0, z: 400 },
      { x: 400, y: 150, z: 400 },
      { x: 400, y: 150, z: 550 },
    ],
    surfaceType: 'wood',
    wallFlag: 'climbable',
    soundEffectId: 5,
    cameraTriggerId: 0,
    isSpecialFloor: false,
  },
  {
    id: 1006,
    vertices: [
      { x: 400, y: 0, z: 400 },
      { x: 400, y: 150, z: 550 },
      { x: 400, y: 0, z: 550 },
    ],
    surfaceType: 'wood',
    wallFlag: 'climbable',
    soundEffectId: 5,
    cameraTriggerId: 0,
    isSpecialFloor: false,
  },
];

// Temple of Time (tokinoma) Collision map
export const TEMPLE_OF_TIME_COLLISION: CollisionPolygon[] = [
  ...generateTerrainPolys(-600, 600, -1000, 600, 0, 200, 'stone'),
  // Master Sword Altar (raised stone dais)
  {
    id: 2001,
    vertices: [
      { x: -150, y: 40, z: -800 },
      { x: 150, y: 40, z: -800 },
      { x: 150, y: 40, z: -500 },
    ],
    surfaceType: 'stone',
    wallFlag: 'none',
    soundEffectId: 2,
    cameraTriggerId: 2,
    isSpecialFloor: false,
  },
  {
    id: 2002,
    vertices: [
      { x: -150, y: 40, z: -800 },
      { x: 150, y: 40, z: -500 },
      { x: -150, y: 40, z: -500 },
    ],
    surfaceType: 'stone',
    wallFlag: 'none',
    soundEffectId: 2,
    cameraTriggerId: 2,
    isSpecialFloor: false,
  },
];

// Inside Deku Tree (ydan) Collision
export const DEKU_TREE_COLLISION: CollisionPolygon[] = [
  ...generateTerrainPolys(-500, 500, -500, 500, 0, 250, 'wood'),
  // Spider web void pit in center
  {
    id: 3001,
    vertices: [
      { x: -150, y: -5, z: -150 },
      { x: 150, y: -5, z: -150 },
      { x: 150, y: -5, z: 150 },
    ],
    surfaceType: 'void',
    wallFlag: 'none',
    soundEffectId: 0,
    cameraTriggerId: 3,
    isSpecialFloor: true,
  },
  {
    id: 3002,
    vertices: [
      { x: -150, y: -5, z: -150 },
      { x: 150, y: -5, z: 150 },
      { x: -150, y: -5, z: 150 },
    ],
    surfaceType: 'void',
    wallFlag: 'none',
    soundEffectId: 0,
    cameraTriggerId: 3,
    isSpecialFloor: true,
  },
  // Climbable vines up dungeon wall
  {
    id: 3003,
    vertices: [
      { x: 450, y: 0, z: -200 },
      { x: 450, y: 300, z: -200 },
      { x: 450, y: 300, z: 200 },
    ],
    surfaceType: 'wood',
    wallFlag: 'climbable',
    soundEffectId: 5,
    cameraTriggerId: 0,
    isSpecialFloor: false,
  },
];

// Sample Scenes
export const SAMPLE_SCENES: OoT3DScene[] = [
  {
    id: 'spot04',
    name: 'Kokiri Forest',
    japaneseName: 'コキリの森 (spot04)',
    sceneZsiPath: 'romfs/scene/spot04_info.zsi',
    skybox: 'day',
    bgmId: 0x18,
    bgmName: 'Kokiri Forest Theme',
    entranceTable: [
      { spawnX: 0, spawnY: 10, spawnZ: 600, spawnYaw: 0 },
      { spawnX: 450, spawnY: 160, spawnZ: 450, spawnYaw: 90 },
      { spawnX: -600, spawnY: 10, spawnZ: -200, spawnYaw: 270 },
    ],
    rooms: [
      {
        id: 0,
        name: 'Main Village Outdoor',
        ambientColor: '#84cc16',
        actors: [
          {
            uid: 'act_spot04_01',
            actorId: 0x0000,
            name: 'Player Spawn (Link)',
            roomId: 0,
            position: { x: 0, y: 0, z: 450 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0000,
            notes: 'Default Kokiri Forest outdoor spawn point',
          },
          {
            uid: 'act_spot04_02',
            actorId: 0x0027,
            name: 'En_Ko (Mido House Guard)',
            roomId: 0,
            position: { x: 120, y: 0, z: -350 },
            rotation: { x: 0, y: 180, z: 0 },
            variable: 0x0001,
            notes: 'Requires Kokiri Sword and Deku Shield to pass',
          },
          {
            uid: 'act_spot04_03',
            actorId: 0x0010,
            name: 'En_Box (Treasure Chest - Kokiri Sword)',
            roomId: 0,
            position: { x: -450, y: 20, z: 500 },
            rotation: { x: 0, y: 45, z: 0 },
            variable: 0x401e, // Small chest containing Kokiri Sword
            notes: 'In hole behind Know-it-all Brothers house',
          },
          {
            uid: 'act_spot04_04',
            actorId: 0x0003,
            name: 'En_Torch2 (Gossip Stone)',
            roomId: 0,
            position: { x: -200, y: 0, z: 150 },
            rotation: { x: 0, y: 120, z: 0 },
            variable: 0x0002,
            notes: 'Near the forest pond',
          },
          {
            uid: 'act_spot04_05',
            actorId: 0x002c,
            name: 'En_Light (Village Torch)',
            roomId: 0,
            position: { x: 150, y: 0, z: 200 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0001,
            notes: 'Lit campfire torch',
          },
          {
            uid: 'act_spot04_06',
            actorId: 0x0034,
            name: 'En_Item00 (Blue Rupee)',
            roomId: 0,
            position: { x: 0, y: 10, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0001, // Blue Rupee (5 rupees)
            notes: 'Center of water pond',
          },
          {
            uid: 'act_spot04_custom_1',
            actorId: 0x0180,
            name: 'Custom_Scripted_Actor (Forest Spirit)',
            roomId: 0,
            position: { x: -280, y: 60, z: -150 },
            rotation: { x: 0, y: 90, z: 0 },
            variable: 0x0081,
            attachedScriptId: 'script_custom_npc',
            customScriptParams: {
              dialogueId: 0x10a2,
              giveItem: 'Heart Piece',
              glowColor: '#34d399',
            },
            notes: 'Custom modded NPC with dynamic quest dialogue',
          },
        ],
      },
    ],
    collisionPolygons: KOKIRI_FOREST_COLLISION,
  },
  {
    id: 'tokinoma',
    name: 'Temple of Time',
    japaneseName: '時の神殿 (tokinoma)',
    sceneZsiPath: 'romfs/scene/tokinoma_info.zsi',
    skybox: 'indoor',
    bgmId: 0x22,
    bgmName: 'Temple of Time Theme',
    entranceTable: [
      { spawnX: 0, spawnY: 5, spawnZ: 500, spawnYaw: 0 },
      { spawnX: 0, spawnY: 45, spawnZ: -700, spawnYaw: 180 },
    ],
    rooms: [
      {
        id: 0,
        name: 'Sanctuary & Pedestal of Time',
        ambientColor: '#60a5fa',
        actors: [
          {
            uid: 'act_tokinoma_01',
            actorId: 0x0000,
            name: 'Player Spawn (Entrance)',
            roomId: 0,
            position: { x: 0, y: 0, z: 450 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0000,
          },
          {
            uid: 'act_tokinoma_02',
            actorId: 0x0002,
            name: 'Door_Shutter (Door of Time)',
            roomId: 0,
            position: { x: 0, y: 0, z: -350 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0000,
            notes: 'Opens upon playing Song of Time with 3 Spiritual Stones',
          },
          {
            uid: 'act_tokinoma_03',
            actorId: 0x002c,
            name: 'En_Light (Altar Torch Left)',
            roomId: 0,
            position: { x: -120, y: 40, z: -650 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0001,
          },
          {
            uid: 'act_tokinoma_04',
            actorId: 0x002c,
            name: 'En_Light (Altar Torch Right)',
            roomId: 0,
            position: { x: 120, y: 40, z: -650 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0001,
          },
          {
            uid: 'act_tokinoma_custom_1',
            actorId: 0x0180,
            name: 'Custom_Scripted_Actor (Song Altar Trial)',
            roomId: 0,
            position: { x: 0, y: 45, z: -680 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0090,
            attachedScriptId: 'script_puzzle_switch',
            customScriptParams: {
              puzzleType: 'ocarina_riddle',
              unlockFlag: 0x04,
              rewardActor: 'En_Box',
            },
            notes: 'Custom modded puzzle pedestal',
          },
        ],
      },
    ],
    collisionPolygons: TEMPLE_OF_TIME_COLLISION,
  },
  {
    id: 'ydan',
    name: 'Inside the Deku Tree',
    japaneseName: 'デクの樹様の中 (ydan)',
    sceneZsiPath: 'romfs/scene/ydan_info.zsi',
    skybox: 'indoor',
    bgmId: 0x19,
    bgmName: 'Deku Tree Dungeon BGM',
    entranceTable: [
      { spawnX: 0, spawnY: 10, spawnZ: 350, spawnYaw: 0 },
      { spawnX: 0, spawnY: -200, spawnZ: 0, spawnYaw: 0 },
    ],
    rooms: [
      {
        id: 0,
        name: '1F Hollow Core & Web Floor',
        ambientColor: '#a16207',
        actors: [
          {
            uid: 'act_ydan_01',
            actorId: 0x0000,
            name: 'Player Spawn',
            roomId: 0,
            position: { x: 0, y: 0, z: 300 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0000,
          },
          {
            uid: 'act_ydan_02',
            actorId: 0x0032,
            name: 'En_Dekubaba (Deku Baba)',
            roomId: 0,
            position: { x: -180, y: 0, z: 80 },
            rotation: { x: 0, y: 45, z: 0 },
            variable: 0x0000,
            notes: 'Drops Deku Stick',
          },
          {
            uid: 'act_ydan_03',
            actorId: 0x0032,
            name: 'En_Dekubaba (Deku Baba)',
            roomId: 0,
            position: { x: 180, y: 0, z: 80 },
            rotation: { x: 0, y: 315, z: 0 },
            variable: 0x0000,
          },
          {
            uid: 'act_ydan_04',
            actorId: 0x0010,
            name: 'En_Box (Dungeon Map Chest)',
            roomId: 0,
            position: { x: 0, y: 0, z: -280 },
            rotation: { x: 0, y: 180, z: 0 },
            variable: 0x0004,
          },
          {
            uid: 'act_ydan_05',
            actorId: 0x002e,
            name: 'En_Goma (Queen Gohma)',
            roomId: 0,
            position: { x: 0, y: 350, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            variable: 0x0000,
            notes: 'Clings to ceiling web',
          },
        ],
      },
    ],
    collisionPolygons: DEKU_TREE_COLLISION,
  },
];

// Sample OoT3D Textures for oot3d-texkit integration
export const SAMPLE_TEXTURES: OoT3DTexture[] = [
  {
    id: 'tex_grass_01',
    name: 'kokiri_grass_lush_ctxb',
    category: 'environment',
    width: 256,
    height: 256,
    format: 'ETC1A4',
    originalPath: 'romfs/tex/spot04/kokiri_grass.ctxb',
    mipmaps: 4,
    fileSizeKb: 32.5,
    isModified: false,
    attachedScenes: ['spot04'],
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="%232e7d32"/><circle cx="50" cy="50" r="30" fill="%23388e3c"/><circle cx="180" cy="120" r="40" fill="%2343a047"/><circle cx="90" cy="200" r="35" fill="%231b5e20"/><path d="M20,180 Q60,150 40,240" stroke="%234caf50" stroke-width="4" fill="none"/><path d="M140,40 Q180,20 160,80" stroke="%2381c784" stroke-width="4" fill="none"/></svg>',
  },
  {
    id: 'tex_wood_bark',
    name: 'tree_bark_aged_ctxb',
    category: 'environment',
    width: 128,
    height: 256,
    format: 'RGB565',
    originalPath: 'romfs/tex/spot04/tree_bark.ctxb',
    mipmaps: 3,
    fileSizeKb: 64.0,
    isModified: false,
    attachedScenes: ['spot04', 'ydan'],
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="256" viewBox="0 0 128 256"><rect width="128" height="256" fill="%234e342e"/><path d="M20,0 L20,256 M60,0 L60,256 M100,0 L100,256" stroke="%233e2723" stroke-width="8"/><path d="M40,30 Q30,80 40,140 Q50,200 40,256" stroke="%235d4037" stroke-width="6" fill="none"/><circle cx="64" cy="90" r="14" fill="%23271714"/></svg>',
  },
  {
    id: 'tex_stone_temple',
    name: 'temple_marble_floor_ctxb',
    category: 'environment',
    width: 256,
    height: 256,
    format: 'RGBA8',
    originalPath: 'romfs/tex/tokinoma/marble_tile.ctxb',
    mipmaps: 4,
    fileSizeKb: 256.0,
    isModified: false,
    attachedScenes: ['tokinoma'],
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="%2394a3b8"/><rect x="8" y="8" width="116" height="116" fill="%23cbd5e1" stroke="%2364748b" stroke-width="3"/><rect x="132" y="8" width="116" height="116" fill="%23e2e8f0" stroke="%2364748b" stroke-width="3"/><rect x="8" y="132" width="116" height="116" fill="%23e2e8f0" stroke="%2364748b" stroke-width="3"/><rect x="132" y="132" width="116" height="116" fill="%23cbd5e1" stroke="%2364748b" stroke-width="3"/></svg>',
  },
  {
    id: 'tex_chest_gold',
    name: 'box_gold_trim_ctxb',
    category: 'object',
    width: 128,
    height: 128,
    format: 'RGBA4444',
    originalPath: 'romfs/actor/en_box/box_texture.ctxb',
    mipmaps: 2,
    fileSizeKb: 32.0,
    isModified: false,
    attachedScenes: ['spot04', 'tokinoma', 'ydan'],
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23b45309"/><rect x="12" y="12" width="104" height="104" fill="%2378350f" stroke="%23f59e0b" stroke-width="6"/><circle cx="64" cy="64" r="16" fill="%23f59e0b"/><rect x="58" y="64" width="12" height="24" fill="%23f59e0b"/></svg>',
  },
  {
    id: 'tex_spiritual_stone',
    name: 'kokiri_emerald_symbol_ctxb',
    category: 'ui',
    width: 64,
    height: 64,
    format: 'RGBA8',
    originalPath: 'romfs/tex/symbols/kokiri_emerald.ctxb',
    mipmaps: 1,
    fileSizeKb: 16.0,
    isModified: false,
    attachedScenes: ['spot04', 'tokinoma'],
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23064e3b"/><polygon points="32,8 54,32 32,56 10,32" fill="%2310b981" stroke="%2334d399" stroke-width="3"/><circle cx="32" cy="32" r="8" fill="%23a7f3d0"/></svg>',
  },
];

// Sample Custom Scripts for the Script Attacher
export const DEFAULT_CUSTOM_SCRIPTS: CustomScript[] = [
  {
    id: 'script_custom_npc',
    name: 'CustomNPC_DialogueQuest.c',
    author: 'Modder3DS',
    version: '1.2.0',
    description: 'Custom interactive NPC with branched dialogue, item requirements, and sound cues',
    targetHook: 'actor_update',
    language: 'C',
    associatedObjectId: 0x0180,
    exposedParams: [
      {
        key: 'dialogueId',
        label: 'Message ID (Hex)',
        type: 'hex',
        defaultValue: '0x10a2',
        description: 'Text bank entry displayed when Link interacts with the NPC',
      },
      {
        key: 'giveItem',
        label: 'Reward Item',
        type: 'string',
        defaultValue: 'Heart Piece',
        description: 'Item ID gifted upon quest objective completion',
      },
      {
        key: 'glowColor',
        label: 'Aura Tint',
        type: 'string',
        defaultValue: '#34d399',
        description: 'Ambient particle glow around the NPC character model',
      },
    ],
    code: `// OoT3D Custom Actor Script: CustomNPC_DialogueQuest
// Injected into RomFS code.bin hook for Actor ID 0x0180

#include "z3D_actor.h"

void CustomNPC_Init(Actor* this, GlobalContext* globalCtx) {
    this->targetMode = 6;
    Actor_SetScale(this, 0.01f);
    this->colChkInfo.mass = MASS_HEAVY;
    Collider_InitCylinder(globalCtx, &this->collider);
}

void CustomNPC_Update(Actor* this, GlobalContext* globalCtx) {
    Player* player = GET_PLAYER(globalCtx);
    
    // Check if player is within talking distance
    if (Actor_IsFacingPlayer(this, 0x2000) && this->xzDistToPlayer < 120.0f) {
        Actor_OfferTalk(this, globalCtx, 120.0f);
    }
    
    // Process text box interaction
    if (Actor_TextboxIsVisible(this, globalCtx)) {
        u16 msgId = this->params & 0xFFFF;
        if (Message_GetState(&globalCtx->msgCtx) == TEXT_STATE_CLOSING) {
            // Trigger quest item give
            Item_Give(globalCtx, ITEM_HEART_PIECE);
            Audio_PlayFanfare(NA_BGM_ITEM_GET);
        }
    }
}

void CustomNPC_Draw(Actor* this, GlobalContext* globalCtx) {
    Gfx_DrawCustomMesh(globalCtx, MESH_KOKIRI_SPIRIT);
}`,
  },
  {
    id: 'script_moving_platform',
    name: 'MovingPlatform_Track.c',
    author: 'OoT3DDev',
    version: '1.0.4',
    description: 'Dynamic collision platform that oscillates along a 3D spline waypoint path',
    targetHook: 'actor_update',
    language: 'C',
    associatedObjectId: 0x0181,
    exposedParams: [
      {
        key: 'moveSpeed',
        label: 'Speed (Units/Frame)',
        type: 'number',
        defaultValue: 4.5,
        description: 'Linear velocity along track waypoints',
      },
      {
        key: 'travelDistance',
        label: 'Distance (Units)',
        type: 'number',
        defaultValue: 350,
        description: 'Max travel delta from spawn position',
      },
      {
        key: 'pauseFrames',
        label: 'End Delay (Frames)',
        type: 'number',
        defaultValue: 30,
        description: 'Number of frames platform waits at waypoint before reversing',
      },
    ],
    code: `// MovingPlatform_Track.c - Dynamic collision platform for OoT3D RomFS
#include "z3D_actor.h"
#include "z3D_collision.h"

void MovingPlatform_Update(Actor* this, GlobalContext* globalCtx) {
    DynaPolyActor* dyna = (DynaPolyActor*)this;
    float speed = (float)this->variable / 10.0f;
    
    // Calculate sine wave movement along local Z axis
    this->world.pos.z += Math_SinS(this->timer * 0x0400) * speed;
    
    // Update dynamic collision mesh so Link rides along
    DynaPoly_MoveMovingSurfaces(globalCtx, dyna);
    this->timer++;
}`,
  },
  {
    id: 'script_puzzle_switch',
    name: 'SwitchDoor_Puzzle.c',
    author: 'OoT3DDev',
    version: '2.0.1',
    description: 'Crystal switch that lowers water level or unlocks doors in the current room',
    targetHook: 'collision_touch',
    language: 'C',
    associatedObjectId: 0x0182,
    exposedParams: [
      {
        key: 'switchFlag',
        label: 'Switch Flag ID',
        type: 'hex',
        defaultValue: '0x05',
        description: 'Permanent or temporary room switch flag (0x00 - 0x3F)',
      },
      {
        key: 'isTimed',
        label: 'Is Timed Switch',
        type: 'boolean',
        defaultValue: false,
        description: 'If true, ticks down and resets after countdown timer',
      },
    ],
    code: `// SwitchDoor_Puzzle.c - Event trigger switch
#include "z3D_actor.h"

void SwitchDoor_OnHit(Actor* this, GlobalContext* globalCtx) {
    u8 flag = (this->variable >> 8) & 0x3F;
    
    // Activate global room switch flag
    Flags_SetSwitch(globalCtx, flag);
    Audio_PlaySoundGeneral(NA_SE_SY_CORRECT_CHIME, &this->projectedPos, 4, &D_801333E0, &D_801333E0, &D_801333E0);
    
    // Shake camera & spawn success dust
    EffectSsDust_Spawn(globalCtx, 0, &this->world.pos, &sZeroVec, &sZeroVec, &sDustColor, &sDustColor2, 200, 10);
}`,
  },
];

// Sample Custom Object Types that modders can define and place
export const DEFAULT_CUSTOM_OBJECTS: CustomObjectType[] = [
  {
    objectId: 0x0180,
    name: 'Forest Spirit NPC',
    description: 'Custom NPC delivering modded quest dialogue and item reward',
    defaultMesh: 'npc',
    collisionRadius: 40,
    attachedScriptId: 'script_custom_npc',
    textureId: 'tex_spiritual_stone',
  },
  {
    objectId: 0x0181,
    name: 'Floating Stone Elevator',
    description: 'Moving platform with dynamic collision surface',
    defaultMesh: 'chest',
    collisionRadius: 100,
    attachedScriptId: 'script_moving_platform',
    textureId: 'tex_stone_temple',
  },
  {
    objectId: 0x0182,
    name: 'Ancient Crystal Obelisk',
    description: 'Interactive puzzle trigger with custom sound chime',
    defaultMesh: 'crystal',
    collisionRadius: 50,
    attachedScriptId: 'script_puzzle_switch',
  },
];

export interface SceneMetadata {
  name: string;
  japaneseName: string;
  skybox: 'day' | 'night' | 'dusk' | 'indoor' | 'cloudy';
  bgmName: string;
  bgmId: number;
}

export const KNOWN_OOT3D_SCENE_METADATA: Record<string, SceneMetadata> = {
  spot00: { name: 'Hyrule Field', japaneseName: 'ハイラル平原 (spot00)', skybox: 'day', bgmName: 'Hyrule Field Main Theme', bgmId: 0x02 },
  spot01: { name: 'Kakariko Village', japaneseName: 'カカリコ村 (spot01)', skybox: 'day', bgmName: 'Kakariko Village Theme', bgmId: 0x1a },
  spot02: { name: 'Graveyard', japaneseName: '墓地 (spot02)', skybox: 'dusk', bgmName: 'Graveyard Theme', bgmId: 0x24 },
  spot03: { name: "Zora's River", japaneseName: 'ゾーラ川 (spot03)', skybox: 'day', bgmName: 'Zora River Theme', bgmId: 0x1b },
  spot04: { name: 'Kokiri Forest', japaneseName: 'コキリの森 (spot04)', skybox: 'day', bgmName: 'Kokiri Forest Theme', bgmId: 0x18 },
  spot05: { name: 'Sacred Forest Meadow', japaneseName: '聖なる森の入口 (spot05)', skybox: 'day', bgmName: "Saria's Song Theme", bgmId: 0x1c },
  spot06: { name: 'Lake Hylia', japaneseName: 'ハイリア湖 (spot06)', skybox: 'day', bgmName: 'Lake Hylia Theme', bgmId: 0x1d },
  spot07: { name: "Zora's Domain", japaneseName: 'ゾーラの里 (spot07)', skybox: 'indoor', bgmName: "Zora's Domain Theme", bgmId: 0x1e },
  spot08: { name: "Zora's Fountain", japaneseName: 'ゾーラの泉 (spot08)', skybox: 'indoor', bgmName: 'Great Fairy Fountain', bgmId: 0x25 },
  spot09: { name: 'Gerudo Valley', japaneseName: 'ゲルドの谷 (spot09)', skybox: 'day', bgmName: 'Gerudo Valley Theme', bgmId: 0x20 },
  spot10: { name: 'Lost Woods', japaneseName: '迷いの森 (spot10)', skybox: 'day', bgmName: 'Lost Woods Theme', bgmId: 0x1f },
  spot11: { name: 'Desert Colossus', japaneseName: '巨大邪神像 (spot11)', skybox: 'dusk', bgmName: 'Spirit Temple Outside', bgmId: 0x2a },
  spot12: { name: "Gerudo's Fortress", japaneseName: 'ゲルドの砦 (spot12)', skybox: 'day', bgmName: "Gerudo's Fortress Theme", bgmId: 0x21 },
  spot13: { name: 'Haunted Wasteland', japaneseName: '幻影の砂漠 (spot13)', skybox: 'cloudy', bgmName: 'Wasteland Wind Ambience', bgmId: 0x2b },
  spot15: { name: 'Hyrule Castle Grounds', japaneseName: 'ハイラル城 (spot15)', skybox: 'day', bgmName: 'Hyrule Castle Courtyard', bgmId: 0x26 },
  spot16: { name: 'Death Mountain Trail', japaneseName: 'デスマウンテン登山道 (spot16)', skybox: 'day', bgmName: 'Death Mountain Theme', bgmId: 0x27 },
  spot17: { name: 'Death Mountain Crater', japaneseName: 'デスマウンテン火口 (spot17)', skybox: 'dusk', bgmName: 'Crater Lava Theme', bgmId: 0x28 },
  spot18: { name: 'Goron City', japaneseName: 'ゴロンシティ (spot18)', skybox: 'indoor', bgmName: 'Goron City Theme', bgmId: 0x29 },
  spot20: { name: 'Lon Lon Ranch', japaneseName: 'ロンロン牧場 (spot20)', skybox: 'day', bgmName: "Epona's Theme / Lon Lon Ranch", bgmId: 0x23 },
  tokinoma: { name: 'Temple of Time', japaneseName: '時の神殿 (tokinoma)', skybox: 'indoor', bgmName: 'Temple of Time Theme', bgmId: 0x22 },
  ydan: { name: 'Inside the Deku Tree', japaneseName: 'デクの樹様の中 (ydan)', skybox: 'indoor', bgmName: 'Deku Tree Dungeon BGM', bgmId: 0x19 },
  ddan: { name: "Dodongo's Cavern", japaneseName: 'ドドンゴの洞窟 (ddan)', skybox: 'indoor', bgmName: "Dodongo's Cavern BGM", bgmId: 0x2c },
  jyasinzou: { name: 'Spirit Temple', japaneseName: '邪神像 (jyasinzou)', skybox: 'indoor', bgmName: 'Spirit Temple Theme', bgmId: 0x2d },
  hidan: { name: 'Fire Temple', japaneseName: '炎の神殿 (hidan)', skybox: 'indoor', bgmName: 'Fire Temple Theme', bgmId: 0x2e },
  mizusin: { name: 'Water Temple', japaneseName: '水の神殿 (mizusin)', skybox: 'indoor', bgmName: 'Water Temple Theme', bgmId: 0x2f },
  moriboss: { name: 'Forest Temple Boss', japaneseName: '森の神殿 ボス (moriboss)', skybox: 'indoor', bgmName: 'Phantom Ganon Battle', bgmId: 0x30 },
  market_day: { name: 'Hyrule Market (Day)', japaneseName: '城下町 昼 (market_day)', skybox: 'day', bgmName: 'Market Day Theme', bgmId: 0x15 },
  market_night: { name: 'Hyrule Market (Night)', japaneseName: '城下町 夜 (market_night)', skybox: 'night', bgmName: 'Market Night Ambience', bgmId: 0x16 },
  market_ruins: { name: 'Market in Ruins', japaneseName: '城下町 廃墟 (market_ruins)', skybox: 'cloudy', bgmName: 'Ruins Wind Ambience', bgmId: 0x17 },
};

export function generateScenesFromDetected(
  detectedSceneIds: string[],
  existingScenes: OoT3DScene[] = SAMPLE_SCENES
): OoT3DScene[] {
  const result: OoT3DScene[] = [];
  const processedIds = new Set<string>();

  // 1. Process all detected scenes first
  for (const rawId of detectedSceneIds) {
    const id = rawId.toLowerCase().trim();
    if (!id || processedIds.has(id)) continue;
    processedIds.add(id);

    // Check if we already have a rich scene object
    const existing = existingScenes.find((s) => s.id.toLowerCase() === id);
    if (existing) {
      result.push(existing);
      continue;
    }

    // Check known metadata
    const meta = KNOWN_OOT3D_SCENE_METADATA[id] || {
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' '),
      japaneseName: `${id} (RomFS)`,
      skybox: 'day' as const,
      bgmName: 'Kokiri Forest Theme',
      bgmId: 0x18,
    };

    result.push({
      id,
      name: meta.name,
      japaneseName: meta.japaneseName,
      sceneZsiPath: `romfs/scene/${id}_info.zsi`,
      skybox: meta.skybox,
      bgmId: meta.bgmId,
      bgmName: meta.bgmName,
      entranceTable: [{ spawnX: 0, spawnY: 10, spawnZ: 300, spawnYaw: 0 }],
      rooms: [
        {
          id: 0,
          name: 'Room 0 (Main)',
          ambientColor: '#38bdf8',
          actors: [
            {
              uid: `act_${id}_01`,
              actorId: 0x0000,
              name: 'Player Spawn (Link)',
              roomId: 0,
              position: { x: 0, y: 0, z: 200 },
              rotation: { x: 0, y: 0, z: 0 },
              variable: 0x0000,
              notes: 'Primary spawn point for this scene',
            },
            {
              uid: `act_${id}_02`,
              actorId: 0x0010,
              name: 'En_Box (Treasure Chest)',
              roomId: 0,
              position: { x: -200, y: 0, z: 0 },
              rotation: { x: 0, y: 45, z: 0 },
              variable: 0x4002,
            },
            {
              uid: `act_${id}_03`,
              actorId: 0x002c,
              name: 'En_Light (Scene Torch)',
              roomId: 0,
              position: { x: 200, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              variable: 0x0001,
            },
          ],
        },
      ],
      collisionPolygons: KOKIRI_FOREST_COLLISION,
    });
  }

  // 2. If existing scenes weren't in detected, append them as well so sample scenes remain available
  for (const s of existingScenes) {
    if (!processedIds.has(s.id.toLowerCase())) {
      result.push(s);
      processedIds.add(s.id.toLowerCase());
    }
  }

  return result;
}
