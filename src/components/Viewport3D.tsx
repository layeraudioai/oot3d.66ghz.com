import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  CollisionPolygon,
  CollisionSurfaceType,
  EditorMode,
  OoT3DScene,
  SceneActor,
  Vector3D,
} from '../types/oot3d';
import {
  Eye,
  Layers,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
  Sun,
  Moon,
  Sunset,
  Compass,
  Grid,
  Magnet,
  Plus,
  Droplets,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Crosshair,
} from 'lucide-react';

interface Viewport3DProps {
  scene: OoT3DScene;
  activeRoomId: number;
  selectedActorUid: string | null;
  onSelectActor: (uid: string | null) => void;
  selectedPolyId: number | null;
  onSelectPoly: (id: number | null) => void;
  editorMode: EditorMode;
  onUpdateActorPosition: (uid: string, newPos: Vector3D) => void;
  onUpdateActorRotation: (uid: string, yawDelta: number) => void;
  activeTextureUrl?: string;
  onPaintPoly?: (polyId: number) => void;
  onDuplicateActor?: (actor: SceneActor) => void;
  onDeleteActor?: (uid: string) => void;
  onAddNewActor?: (actorId: number, position?: Vector3D) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const SURFACE_COLORS: Record<CollisionSurfaceType, number> = {
  grass: 0x22c55e,
  dirt: 0xa16207,
  sand: 0xeab308,
  stone: 0x94a3b8,
  wood: 0xb45309,
  water: 0x06b6d4,
  lava: 0xef4444,
  quicksand: 0xd97706,
  ice: 0x38bdf8,
  void: 0x7e22ce,
};

const QUICK_SPAWN_PRESETS = [
  { id: 0x0010, name: 'Treasure Chest', desc: 'En_Box with custom contents' },
  { id: 0x01a3, name: 'Lit Torch', desc: 'En_Torch2 warm light source' },
  { id: 0x0023, name: 'Dungeon Door', desc: 'En_Door wooden/locked' },
  { id: 0x0015, name: 'Collectible Rupee', desc: 'En_Item00 drop item' },
  { id: 0x00e4, name: 'Sheik NPC', desc: 'En_Xc actor with dialogue' },
  { id: 0x0113, name: 'Gossip Stone', desc: 'En_Gs with time/mask hints' },
  { id: 0x0000, name: "Link's Spawn", desc: 'Player spawn point' },
  { id: 0x01f0, name: 'Custom ZAR Actor', desc: 'User-defined C/Lua script' },
];

export const Viewport3D: React.FC<Viewport3DProps> = ({
  scene,
  activeRoomId,
  selectedActorUid,
  onSelectActor,
  selectedPolyId,
  onSelectPoly,
  editorMode,
  onUpdateActorPosition,
  onUpdateActorRotation,
  onPaintPoly,
  onDuplicateActor,
  onDeleteActor,
  onAddNewActor,
  onUndo,
  onRedo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport display states
  const [showCollision, setShowCollision] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showWater, setShowWater] = useState<boolean>(true);
  const [snapGrid, setSnapGrid] = useState<number>(0); // 0 (off), 10, 25, 50, 100
  const [showQuickSpawn, setShowQuickSpawn] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'dusk' | 'night'>('day');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Keyboard navigation indicator state
  const [activeKeys, setActiveKeys] = useState<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    boost: boolean;
  }>({ up: false, down: false, left: false, right: false, boost: false });

  // Pressed keys tracking
  const keysPressed = useRef<Set<string>>(new Set());

  // Three.js internal references
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    cameraTarget: THREE.Vector3;
    renderer: THREE.WebGLRenderer;
    ambientLight: THREE.AmbientLight;
    dirLight: THREE.DirectionalLight;
    hemiLight: THREE.HemisphereLight;
    actorGroup: THREE.Group;
    collisionGroup: THREE.Group;
    environmentGroup: THREE.Group;
    entranceGroup: THREE.Group;
    waterGroup: THREE.Group;
    gizmoGroup: THREE.Group;
    gridHelper: THREE.GridHelper;
    isDragging: boolean;
    isPanning: boolean;
    previousMousePosition: { x: number; y: number };
    isTransformingActor: boolean;
    transformAxis: 'x' | 'y' | 'z' | 'rot' | null;
    initialActorPos: Vector3D | null;
  } | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const sceneThree = new THREE.Scene();
    sceneThree.background = new THREE.Color(0x0f172a); // Slate-900 sky default
    sceneThree.fog = new THREE.FogExp2(0x0f172a, 0.00035);

    const camera = new THREE.PerspectiveCamera(55, width / height, 5, 10000);
    const cameraTarget = new THREE.Vector3(0, 80, 0);
    camera.position.set(0, 450, 950);
    camera.lookAt(cameraTarget);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    sceneThree.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(400, 800, 400);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    sceneThree.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x1e293b, 0.4);
    sceneThree.add(hemiLight);

    // Groups
    const environmentGroup = new THREE.Group();
    const collisionGroup = new THREE.Group();
    const actorGroup = new THREE.Group();
    const entranceGroup = new THREE.Group();
    const waterGroup = new THREE.Group();
    const gizmoGroup = new THREE.Group();

    sceneThree.add(environmentGroup);
    sceneThree.add(collisionGroup);
    sceneThree.add(actorGroup);
    sceneThree.add(entranceGroup);
    sceneThree.add(waterGroup);
    sceneThree.add(gizmoGroup);

    // Grid
    const gridHelper = new THREE.GridHelper(3000, 60, 0x38bdf8, 0x334155);
    gridHelper.position.y = -0.5;
    sceneThree.add(gridHelper);

    threeRef.current = {
      scene: sceneThree,
      camera,
      cameraTarget,
      renderer,
      ambientLight,
      dirLight,
      hemiLight,
      actorGroup,
      collisionGroup,
      environmentGroup,
      entranceGroup,
      waterGroup,
      gizmoGroup,
      gridHelper,
      isDragging: false,
      isPanning: false,
      previousMousePosition: { x: 0, y: 0 },
      isTransformingActor: false,
      transformAxis: null,
      initialActorPos: null,
    };

    let animationFrameId: number;
    let clock = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.02;

      // Gentle spin on item crystals
      actorGroup.children.forEach((child) => {
        if (child.userData.isItemCrystal) {
          child.rotation.y += 0.02;
        }
      });

      // Subtle water wave oscillation
      waterGroup.children.forEach((water) => {
        water.position.y = Math.sin(clock) * 1.5 - 2;
      });

      // Keyboard camera navigation update (Arrow Keys, WASD, PageUp, PageDown)
      if (keysPressed.current.size > 0 && threeRef.current) {
        const { camera: cam, cameraTarget: tgt } = threeRef.current;
        const forward = new THREE.Vector3();
        cam.getWorldDirection(forward);

        // Ground-projected forward vector for intuitive walk/flight
        const horizForward = new THREE.Vector3(forward.x, 0, forward.z).normalize();
        if (horizForward.lengthSq() < 0.0001) {
          horizForward.set(forward.x, forward.y, forward.z).normalize();
        }
        const right = new THREE.Vector3()
          .crossVectors(horizForward, new THREE.Vector3(0, 1, 0))
          .normalize();

        const dist = cam.position.distanceTo(tgt);
        const isBoost = keysPressed.current.has('Shift');
        const baseSpeed = Math.max(4, Math.min(45, dist * 0.02));
        const speed = isBoost ? baseSpeed * 2.8 : baseSpeed;

        const moveVec = new THREE.Vector3();
        if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('KeyW')) {
          moveVec.add(horizForward.clone().multiplyScalar(speed));
        }
        if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('KeyS')) {
          moveVec.add(horizForward.clone().multiplyScalar(-speed));
        }
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) {
          moveVec.add(right.clone().multiplyScalar(-speed));
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) {
          moveVec.add(right.clone().multiplyScalar(speed));
        }
        if (keysPressed.current.has('PageUp') || keysPressed.current.has('KeyE')) {
          moveVec.y += speed;
        }
        if (keysPressed.current.has('PageDown') || keysPressed.current.has('KeyQ')) {
          moveVec.y -= speed;
        }

        if (moveVec.lengthSq() > 0) {
          cam.position.add(moveVec);
          tgt.add(moveVec);
          cam.lookAt(tgt);
        }
      }

      renderer.render(sceneThree, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !threeRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      threeRef.current.camera.aspect = newW / newH;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (threeRef.current) {
        threeRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        threeRef.current.renderer.dispose();
      }
    };
  }, []);

  // Update Time of Day & Lighting
  useEffect(() => {
    if (!threeRef.current) return;
    const { scene: sceneThree, ambientLight, dirLight } = threeRef.current;

    if (timeOfDay === 'day') {
      sceneThree.background = new THREE.Color(0x38bdf8); // Hyrule Sky blue
      sceneThree.fog = new THREE.FogExp2(0x38bdf8, 0.00025);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.75;
      dirLight.color.setHex(0xfffbeb);
      dirLight.intensity = 1.3;
      dirLight.position.set(500, 900, 400);
    } else if (timeOfDay === 'dusk') {
      sceneThree.background = new THREE.Color(0x7c2d12); // Amber sunset
      sceneThree.fog = new THREE.FogExp2(0x7c2d12, 0.0003);
      ambientLight.color.setHex(0xfdba74);
      ambientLight.intensity = 0.6;
      dirLight.color.setHex(0xf97316);
      dirLight.intensity = 1.1;
      dirLight.position.set(-600, 300, 500);
    } else {
      sceneThree.background = new THREE.Color(0x020617); // Deep Kokiri night
      sceneThree.fog = new THREE.FogExp2(0x020617, 0.0004);
      ambientLight.color.setHex(0x38bdf8);
      ambientLight.intensity = 0.35;
      dirLight.color.setHex(0x93c5fd);
      dirLight.intensity = 0.5;
      dirLight.position.set(200, 600, -400);
    }
  }, [timeOfDay]);

  // Update Grid visibility
  useEffect(() => {
    if (threeRef.current) {
      threeRef.current.gridHelper.visible = showGrid;
    }
  }, [showGrid]);

  // Rebuild Collision Polygons
  useEffect(() => {
    if (!threeRef.current) return;
    const { collisionGroup } = threeRef.current;

    // Clear previous
    while (collisionGroup.children.length > 0) {
      const obj = collisionGroup.children[0];
      collisionGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }

    if (!showCollision && editorMode !== 'collision') return;

    // Build geometry for collision triangles
    scene.collisionPolygons.forEach((poly) => {
      const geom = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        poly.vertices[0].x,
        poly.vertices[0].y,
        poly.vertices[0].z,
        poly.vertices[1].x,
        poly.vertices[1].y,
        poly.vertices[1].z,
        poly.vertices[2].x,
        poly.vertices[2].y,
        poly.vertices[2].z,
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();

      const baseColor = SURFACE_COLORS[poly.surfaceType] || 0x22c55e;
      const isSelected = poly.id === selectedPolyId;

      const material = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xf59e0b : baseColor,
        roughness: 0.8,
        metalness: 0.1,
        wireframe: showWireframe,
        side: THREE.DoubleSide,
        transparent: poly.surfaceType === 'water',
        opacity: poly.surfaceType === 'water' ? 0.75 : 0.95,
      });

      const mesh = new THREE.Mesh(geom, material);
      mesh.receiveShadow = true;
      mesh.userData = { isCollisionPoly: true, polyId: poly.id };
      collisionGroup.add(mesh);

      // Highlight edges for climbable / ladder / hookshotable walls
      if (poly.wallFlag !== 'none') {
        const edgeColor =
          poly.wallFlag === 'climbable'
            ? 0x06b6d4 // Cyan
            : poly.wallFlag === 'ladder'
            ? 0xeab308 // Yellow
            : 0xf59e0b; // Gold

        const wireframeGeom = new THREE.WireframeGeometry(geom);
        const line = new THREE.LineSegments(
          wireframeGeom,
          new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 })
        );
        collisionGroup.add(line);
      }
    });
  }, [scene.collisionPolygons, selectedPolyId, showCollision, showWireframe, editorMode]);

  // Rebuild Actors in Viewport
  useEffect(() => {
    if (!threeRef.current) return;
    const { actorGroup } = threeRef.current;

    // Clear previous actors
    while (actorGroup.children.length > 0) {
      const obj = actorGroup.children[0];
      actorGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }

    const currentRoom = scene.rooms.find((r) => r.id === activeRoomId) || scene.rooms[0];
    if (!currentRoom) return;

    currentRoom.actors.forEach((actor) => {
      const isSelected = actor.uid === selectedActorUid;
      const actorContainer = new THREE.Group();
      actorContainer.position.set(actor.position.x, actor.position.y, actor.position.z);
      actorContainer.rotation.y = THREE.MathUtils.degToRad(actor.rotation.y);
      actorContainer.userData = { isActor: true, uid: actor.uid };

      // Helper geometries based on actor type
      if (actor.actorId === 0x0000) {
        // Player / Link
        const tunicMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0x10b981,
          roughness: 0.5,
        });
        const bodyGeom = new THREE.CylinderGeometry(14, 18, 55, 16);
        const bodyMesh = new THREE.Mesh(bodyGeom, tunicMat);
        bodyMesh.position.y = 27.5;
        bodyMesh.castShadow = true;
        actorContainer.add(bodyMesh);

        // Link Cap / Head
        const capGeom = new THREE.ConeGeometry(12, 28, 16);
        const capMesh = new THREE.Mesh(capGeom, tunicMat);
        capMesh.position.set(0, 68, -8);
        capMesh.rotation.x = -0.3;
        actorContainer.add(capMesh);

        // Direction Arrow for Spawn Yaw
        const arrowHelper = new THREE.ArrowHelper(
          new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(0, 10, 0),
          60,
          0x22c55e,
          16,
          8
        );
        actorContainer.add(arrowHelper);
      } else if (actor.actorId === 0x0010) {
        // Treasure Chest
        const woodMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0x78350f,
          roughness: 0.6,
        });
        const goldTrim = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });

        const baseGeom = new THREE.BoxGeometry(45, 24, 30);
        const baseMesh = new THREE.Mesh(baseGeom, woodMat);
        baseMesh.position.y = 12;
        baseMesh.castShadow = true;
        actorContainer.add(baseMesh);

        const lidGeom = new THREE.CylinderGeometry(15, 15, 45, 16, 1, false, 0, Math.PI);
        const lidMesh = new THREE.Mesh(lidGeom, woodMat);
        lidMesh.rotation.z = Math.PI / 2;
        lidMesh.rotation.y = Math.PI / 2;
        lidMesh.position.y = 24;
        actorContainer.add(lidMesh);

        const lockGeom = new THREE.BoxGeometry(8, 8, 4);
        const lockMesh = new THREE.Mesh(lockGeom, goldTrim);
        lockMesh.position.set(0, 20, 16);
        actorContainer.add(lockMesh);
      } else if (actor.actorId === 0x0027) {
        // Kokiri Child NPC
        const mat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0x06b6d4,
          roughness: 0.4,
        });
        const geom = new THREE.CapsuleGeometry(12, 35, 8, 16);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 29;
        mesh.castShadow = true;
        actorContainer.add(mesh);
      } else if (actor.actorId === 0x0032 || actor.actorId === 0x002e) {
        // Enemy (Deku Baba / Gohma)
        const mat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0xef4444,
          roughness: 0.5,
        });
        const geom = new THREE.DodecahedronGeometry(22, 1);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 25;
        mesh.castShadow = true;
        actorContainer.add(mesh);
      } else if (actor.actorId === 0x0034) {
        // Item / Rupee crystal
        const mat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0x3b82f6,
          metalness: 0.3,
          roughness: 0.2,
        });
        const geom = new THREE.OctahedronGeometry(14, 0);
        geom.scale(1, 1.8, 1);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 30;
        mesh.userData = { isItemCrystal: true };
        actorContainer.add(mesh);
      } else if (actor.actorId >= 0x0180 || actor.attachedScriptId) {
        // Custom Scripted Actor
        const mat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0xa855f7,
          roughness: 0.3,
          metalness: 0.7,
        });
        const geom = new THREE.IcosahedronGeometry(20, 0);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 25;
        mesh.castShadow = true;
        mesh.userData = { isItemCrystal: true };
        actorContainer.add(mesh);

        // Ring orbit indicator
        const ringGeom = new THREE.RingGeometry(26, 30, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xc084fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 1;
        actorContainer.add(ring);
      } else {
        // Default Prop / Actor Box
        const mat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0x64748b,
          roughness: 0.5,
        });
        const geom = new THREE.BoxGeometry(25, 45, 25);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 22.5;
        mesh.castShadow = true;
        actorContainer.add(mesh);
      }

      // Selection Aura / Outline Ring on Ground
      if (isSelected) {
        const ringGeom = new THREE.RingGeometry(35, 42, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfacc15,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 0.5;
        actorContainer.add(ringMesh);
      }

      actorGroup.add(actorContainer);
    });
  }, [scene.rooms, activeRoomId, selectedActorUid]);

  // Update Transform Gizmo when actor selected
  useEffect(() => {
    if (!threeRef.current) return;
    const { gizmoGroup } = threeRef.current;

    while (gizmoGroup.children.length > 0) {
      gizmoGroup.remove(gizmoGroup.children[0]);
    }

    if (!selectedActorUid) return;

    const currentRoom = scene.rooms.find((r) => r.id === activeRoomId) || scene.rooms[0];
    const actor = currentRoom?.actors.find((a) => a.uid === selectedActorUid);
    if (!actor) return;

    gizmoGroup.position.set(actor.position.x, actor.position.y + 40, actor.position.z);

    if (transformMode === 'translate') {
      // X Axis (Red)
      const arrowX = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        70,
        0xef4444,
        18,
        10
      );
      arrowX.userData = { isGizmo: true, axis: 'x' };
      gizmoGroup.add(arrowX);

      // Y Axis (Green)
      const arrowY = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        70,
        0x22c55e,
        18,
        10
      );
      arrowY.userData = { isGizmo: true, axis: 'y' };
      gizmoGroup.add(arrowY);

      // Z Axis (Blue)
      const arrowZ = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        70,
        0x3b82f6,
        18,
        10
      );
      arrowZ.userData = { isGizmo: true, axis: 'z' };
      gizmoGroup.add(arrowZ);
    } else {
      // Rotation Ring (Yellow)
      const ringGeom = new THREE.TorusGeometry(50, 2, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const torus = new THREE.Mesh(ringGeom, ringMat);
      torus.rotation.x = Math.PI / 2;
      torus.userData = { isGizmo: true, axis: 'rot' };
      gizmoGroup.add(torus);
    }
  }, [selectedActorUid, scene.rooms, activeRoomId, transformMode]);

  // Rebuild Link's Entrance Table Spawn Markers
  useEffect(() => {
    if (!threeRef.current) return;
    const { entranceGroup } = threeRef.current;

    while (entranceGroup.children.length > 0) {
      const obj = entranceGroup.children[0];
      entranceGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    (scene.entranceTable || []).forEach((entrance, idx) => {
      const spawnContainer = new THREE.Group();
      spawnContainer.position.set(entrance.spawnX, entrance.spawnY, entrance.spawnZ);
      spawnContainer.rotation.y = THREE.MathUtils.degToRad(entrance.spawnYaw);
      spawnContainer.userData = { isEntrance: true, entranceIndex: idx };

      // Outer Golden Rune Pedestal Ring
      const ringGeom = new THREE.RingGeometry(18, 24, 24);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.y = 1;
      spawnContainer.add(ringMesh);

      // Inner Golden Disc
      const discGeom = new THREE.CircleGeometry(11, 16);
      discGeom.rotateX(-Math.PI / 2);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0xd97706,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const discMesh = new THREE.Mesh(discGeom, discMat);
      discMesh.position.y = 1.2;
      spawnContainer.add(discMesh);

      // Directional Cyan Arrow for Link's Spawn Yaw
      const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 2, 0),
        50,
        0x06b6d4,
        15,
        9
      );
      spawnContainer.add(arrow);

      entranceGroup.add(spawnContainer);
    });
  }, [scene.entranceTable]);

  // Rebuild Shimmering Water Surface Plane
  useEffect(() => {
    if (!threeRef.current) return;
    const { waterGroup } = threeRef.current;

    while (waterGroup.children.length > 0) {
      const obj = waterGroup.children[0];
      waterGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    if (showWater) {
      const waterGeom = new THREE.PlaneGeometry(3500, 3500, 16, 16);
      waterGeom.rotateX(-Math.PI / 2);
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.45,
        roughness: 0.15,
        metalness: 0.2,
        depthWrite: false,
      });
      const waterMesh = new THREE.Mesh(waterGeom, waterMat);
      waterMesh.position.y = -2;
      waterGroup.add(waterMesh);
    }
  }, [showWater]);

  // Move camera along horizontal / vertical plane relative to view
  const moveCamera = useCallback(
    (direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down', boost = false) => {
      if (!threeRef.current) return;
      const { camera, cameraTarget } = threeRef.current;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);

      const horizForward = new THREE.Vector3(forward.x, 0, forward.z).normalize();
      if (horizForward.lengthSq() < 0.0001) {
        horizForward.set(forward.x, forward.y, forward.z).normalize();
      }
      const right = new THREE.Vector3()
        .crossVectors(horizForward, new THREE.Vector3(0, 1, 0))
        .normalize();

      const dist = camera.position.distanceTo(cameraTarget);
      const baseSpeed = Math.max(6, Math.min(50, dist * 0.04));
      const speed = boost ? baseSpeed * 2.8 : baseSpeed;

      const moveVec = new THREE.Vector3();
      if (direction === 'forward') moveVec.add(horizForward.clone().multiplyScalar(speed));
      if (direction === 'backward') moveVec.add(horizForward.clone().multiplyScalar(-speed));
      if (direction === 'left') moveVec.add(right.clone().multiplyScalar(-speed));
      if (direction === 'right') moveVec.add(right.clone().multiplyScalar(speed));
      if (direction === 'up') moveVec.y += speed;
      if (direction === 'down') moveVec.y -= speed;

      camera.position.add(moveVec);
      cameraTarget.add(moveVec);
      camera.lookAt(cameraTarget);
    },
    []
  );

  // Zoom relative to current cameraTarget
  const zoomCamera = useCallback((inOut: 'in' | 'out') => {
    if (!threeRef.current) return;
    const { camera, cameraTarget } = threeRef.current;
    const factor = inOut === 'in' ? 0.82 : 1.22;
    const offset = camera.position.clone().sub(cameraTarget);
    const newDist = Math.max(30, Math.min(8000, offset.length() * factor));
    offset.setLength(newDist);
    camera.position.copy(cameraTarget).add(offset);
    camera.lookAt(cameraTarget);
  }, []);

  // Recenter Camera to scene default origin
  const recenterCamera = useCallback(() => {
    if (!threeRef.current) return;
    const { camera, cameraTarget } = threeRef.current;
    cameraTarget.set(0, 80, 0);
    camera.position.set(0, 450, 950);
    camera.lookAt(cameraTarget);
  }, []);

  // Focus on Selected Actor and set cameraTarget to actor center
  const focusSelectedActor = useCallback(() => {
    if (!threeRef.current || !selectedActorUid) return;
    const currentRoom = scene.rooms.find((r) => r.id === activeRoomId) || scene.rooms[0];
    const actor = currentRoom?.actors.find((a) => a.uid === selectedActorUid);
    if (!actor) return;

    const { camera, cameraTarget } = threeRef.current;
    cameraTarget.set(actor.position.x, actor.position.y + 25, actor.position.z);
    camera.position.set(actor.position.x + 140, actor.position.y + 120, actor.position.z + 180);
    camera.lookAt(cameraTarget);
  }, [selectedActorUid, scene.rooms, activeRoomId]);

  // Global Keyboard Listener for Arrow Keys, WASD, Shift, F, R
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(e.key)
      ) {
        e.preventDefault();
        keysPressed.current.add(e.key);
        setActiveKeys({
          up: keysPressed.current.has('ArrowUp'),
          down: keysPressed.current.has('ArrowDown'),
          left: keysPressed.current.has('ArrowLeft'),
          right: keysPressed.current.has('ArrowRight'),
          boost:
            keysPressed.current.has('Shift') ||
            keysPressed.current.has('ShiftLeft') ||
            keysPressed.current.has('ShiftRight'),
        });
      } else if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ'].includes(e.code)) {
        keysPressed.current.add(e.code);
      } else if (e.key === 'Shift') {
        keysPressed.current.add('Shift');
        setActiveKeys((prev) => ({ ...prev, boost: true }));
      } else if (e.key === 'f' || e.key === 'F') {
        focusSelectedActor();
      } else if (e.key === 'r' || e.key === 'R') {
        recenterCamera();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (selectedActorUid && onDuplicateActor) {
          const currentRoom = scene.rooms.find((r) => r.id === activeRoomId) || scene.rooms[0];
          const actor = currentRoom?.actors.find((a) => a.uid === selectedActorUid);
          if (actor) onDuplicateActor(actor);
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedActorUid && onDeleteActor) {
        e.preventDefault();
        onDeleteActor(selectedActorUid);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey && onUndo) {
        e.preventDefault();
        onUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y') && onRedo) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z') && onRedo)
      ) {
        e.preventDefault();
        onRedo();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
      keysPressed.current.delete(e.code);
      if (e.key === 'Shift') {
        keysPressed.current.delete('Shift');
        keysPressed.current.delete('ShiftLeft');
        keysPressed.current.delete('ShiftRight');
      }
      setActiveKeys({
        up: keysPressed.current.has('ArrowUp'),
        down: keysPressed.current.has('ArrowDown'),
        left: keysPressed.current.has('ArrowLeft'),
        right: keysPressed.current.has('ArrowRight'),
        boost:
          keysPressed.current.has('Shift') ||
          keysPressed.current.has('ShiftLeft') ||
          keysPressed.current.has('ShiftRight'),
      });
    };

    const handleBlur = () => {
      keysPressed.current.clear();
      setActiveKeys({ up: false, down: false, left: false, right: false, boost: false });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [focusSelectedActor, recenterCamera]);

  // Mouse / Touch interaction handlers for Orbit, Pan, Select, and Transform
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !threeRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const isRightClick = e.button === 2;
      const isMiddleClick = e.button === 1;
      const isShiftLeftClick = e.button === 0 && e.shiftKey;

      // Handle Pan with Right Click, Middle Click, or Shift+Left Click
      if (isRightClick || isMiddleClick || isShiftLeftClick) {
        threeRef.current.isPanning = true;
        threeRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
        return;
      }

      // Left click without shift
      if (e.button === 0) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), threeRef.current.camera);

        // Check Gizmo intersection first
        const gizmoHits = raycaster.intersectObjects(threeRef.current.gizmoGroup.children, true);
        if (gizmoHits.length > 0) {
          let hitObj: THREE.Object3D | null = gizmoHits[0].object;
          while (hitObj && !hitObj.userData.axis && hitObj.parent) {
            hitObj = hitObj.parent;
          }
          if (hitObj?.userData?.axis) {
            threeRef.current.isTransformingActor = true;
            threeRef.current.transformAxis = hitObj.userData.axis;
            threeRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
            return;
          }
        }

        // If in collision mode, raycast collision map
        if (editorMode === 'collision') {
          const polyHits = raycaster.intersectObjects(
            threeRef.current.collisionGroup.children,
            false
          );
          if (polyHits.length > 0) {
            const polyId = polyHits[0].object.userData.polyId;
            onSelectPoly(polyId);
            if (onPaintPoly) {
              onPaintPoly(polyId);
            }
            return;
          }
        }

        // Check Actor selection
        const actorHits = raycaster.intersectObjects(threeRef.current.actorGroup.children, true);
        if (actorHits.length > 0) {
          let hitObj: THREE.Object3D | null = actorHits[0].object;
          while (hitObj && !hitObj.userData.uid && hitObj.parent) {
            hitObj = hitObj.parent;
          }
          if (hitObj?.userData?.uid) {
            onSelectActor(hitObj.userData.uid);
            return;
          }
        }

        // Otherwise, start camera orbit drag around current cameraTarget
        threeRef.current.isDragging = true;
        threeRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    },
    [editorMode, onSelectActor, onSelectPoly, onPaintPoly]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!threeRef.current) return;
      const {
        camera,
        cameraTarget,
        isDragging,
        isPanning,
        isTransformingActor,
        transformAxis,
        previousMousePosition,
      } = threeRef.current;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (isTransformingActor && selectedActorUid) {
        const currentRoom = scene.rooms.find((r) => r.id === activeRoomId) || scene.rooms[0];
        const actor = currentRoom?.actors.find((a) => a.uid === selectedActorUid);
        if (actor) {
          if (transformAxis === 'x') {
            let nextX = actor.position.x + deltaX * 1.5;
            if (snapGrid > 0) nextX = Math.round(nextX / snapGrid) * snapGrid;
            onUpdateActorPosition(selectedActorUid, {
              ...actor.position,
              x: Math.round(nextX),
            });
          } else if (transformAxis === 'y') {
            let nextY = Math.max(0, actor.position.y - deltaY * 1.5);
            if (snapGrid > 0) nextY = Math.round(nextY / snapGrid) * snapGrid;
            onUpdateActorPosition(selectedActorUid, {
              ...actor.position,
              y: Math.round(nextY),
            });
          } else if (transformAxis === 'z') {
            let nextZ = actor.position.z + deltaY * 1.5;
            if (snapGrid > 0) nextZ = Math.round(nextZ / snapGrid) * snapGrid;
            onUpdateActorPosition(selectedActorUid, {
              ...actor.position,
              z: Math.round(nextZ),
            });
          } else if (transformAxis === 'rot') {
            let deltaRot = deltaX * 0.8;
            if (snapGrid > 0) deltaRot = Math.round(deltaRot / 15) * 15;
            onUpdateActorRotation(selectedActorUid, deltaRot);
          }
        }
      } else if (isPanning) {
        // Pan camera & cameraTarget in camera's view plane
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        const up = camera.up.clone().normalize();

        const dist = camera.position.distanceTo(cameraTarget);
        const panSpeed = Math.max(0.2, dist * 0.0016);

        const panDelta = right
          .multiplyScalar(-deltaX * panSpeed)
          .add(up.multiplyScalar(deltaY * panSpeed));

        camera.position.add(panDelta);
        cameraTarget.add(panDelta);
        camera.lookAt(cameraTarget);
      } else if (isDragging) {
        // Orbit camera around cameraTarget (FIXED: no longer locked to 0,0,0!)
        const offset = camera.position.clone().sub(cameraTarget);
        const radius = offset.length();

        // Spherical coordinates relative to cameraTarget
        let theta = Math.atan2(offset.x, offset.z);
        let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / (radius || 1))));

        theta -= deltaX * 0.005;
        // Clamp phi so camera does not flip upside down
        phi = Math.max(0.04, Math.min(Math.PI - 0.04, phi - deltaY * 0.005));

        offset.x = radius * Math.sin(phi) * Math.sin(theta);
        offset.y = radius * Math.cos(phi);
        offset.z = radius * Math.sin(phi) * Math.cos(theta);

        camera.position.copy(cameraTarget).add(offset);
        camera.lookAt(cameraTarget);
      }

      threeRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    },
    [selectedActorUid, scene.rooms, activeRoomId, onUpdateActorPosition, onUpdateActorRotation, snapGrid]
  );

  const handleMouseUp = useCallback(() => {
    if (!threeRef.current) return;
    threeRef.current.isDragging = false;
    threeRef.current.isPanning = false;
    threeRef.current.isTransformingActor = false;
    threeRef.current.transformAxis = null;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!threeRef.current) return;
    const { camera, cameraTarget } = threeRef.current;
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    const offset = camera.position.clone().sub(cameraTarget);
    const currentDist = offset.length();
    const newDist = Math.max(30, Math.min(8000, currentDist * zoomFactor));
    offset.setLength(newDist);
    camera.position.copy(cameraTarget).add(offset);
    camera.lookAt(cameraTarget);
  }, []);

  // Double click: set pivot target to actor or clicked terrain surface
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !threeRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), threeRef.current.camera);

      // Check actor double click
      const actorHits = raycaster.intersectObjects(threeRef.current.actorGroup.children, true);
      if (actorHits.length > 0) {
        let hitObj: THREE.Object3D | null = actorHits[0].object;
        while (hitObj && !hitObj.userData.uid && hitObj.parent) {
          hitObj = hitObj.parent;
        }
        if (hitObj?.userData?.uid) {
          onSelectActor(hitObj.userData.uid);
          focusSelectedActor();
          return;
        }
      }

      // Check collision mesh double click -> pivot around that terrain point
      const polyHits = raycaster.intersectObjects(threeRef.current.collisionGroup.children, false);
      if (polyHits.length > 0) {
        const hitPoint = polyHits[0].point;
        const { camera, cameraTarget } = threeRef.current;
        const offset = camera.position.clone().sub(cameraTarget);
        cameraTarget.copy(hitPoint);
        camera.position.copy(cameraTarget).add(offset);
        camera.lookAt(cameraTarget);
      }
    },
    [focusSelectedActor, onSelectActor]
  );

  return (
    <div
      ref={containerRef}
      id="viewport-container"
      tabIndex={0}
      className={`relative w-full h-full bg-slate-950 overflow-hidden select-none outline-none ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        id="three-viewport-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Top Floating Viewport HUD Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        {/* Left Controls: Mode & Quick Spawn & Focus */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-200 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>3DS PICA200 Viewport</span>
            <span className="text-slate-500">|</span>
            <span className="text-sky-400">{scene.name}</span>
          </div>

          {/* Quick Spawn Actor Dropdown */}
          <div className="relative">
            <button
              id="btn-quick-spawn-actor"
              onClick={() => setShowQuickSpawn(!showQuickSpawn)}
              className="bg-sky-600 hover:bg-sky-500 text-white rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer font-medium"
              title="Spawn common actors directly at camera target"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Spawn Actor +</span>
            </button>

            {showQuickSpawn && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-slate-400 px-2 py-1 border-b border-slate-800">
                  Quick Spawn at Pivot
                </div>
                {QUICK_SPAWN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      const pos = threeRef.current?.cameraTarget
                        ? {
                            x: Math.round(threeRef.current.cameraTarget.x),
                            y: Math.max(0, Math.round(threeRef.current.cameraTarget.y)),
                            z: Math.round(threeRef.current.cameraTarget.z),
                          }
                        : undefined;
                      onAddNewActor?.(preset.id, pos);
                      setShowQuickSpawn(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between text-slate-200 transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-medium group-hover:text-sky-300 block">
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-slate-400 block">{preset.desc}</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                      0x{preset.id.toString(16).padStart(4, '0')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedActorUid && (
            <button
              id="btn-focus-actor"
              onClick={focusSelectedActor}
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
              title="Focus Camera on Selected Actor (HotKey: F)"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Focus Actor (F)</span>
            </button>
          )}
        </div>

        {/* Right HUD Controls: Gizmo, Snapping, Lighting, Collision Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-1 shadow-lg pointer-events-auto">
          {/* Transform Gizmo Toggle */}
          <button
            id="btn-transform-translate"
            onClick={() => setTransformMode('translate')}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              transformMode === 'translate'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Translate Gizmo (Move X/Y/Z)"
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            id="btn-transform-rotate"
            onClick={() => setTransformMode('rotate')}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              transformMode === 'rotate'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Rotate Gizmo (Yaw)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Snap to Grid Toggle */}
          <button
            id="btn-toggle-snap-grid"
            onClick={() => {
              const snaps = [0, 10, 25, 50, 100];
              const nextIdx = (snaps.indexOf(snapGrid) + 1) % snaps.length;
              setSnapGrid(snaps[nextIdx]);
            }}
            className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 font-mono ${
              snapGrid > 0
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={`Snap Grid: ${snapGrid > 0 ? `${snapGrid} units` : 'Off'}. Click to cycle (0, 10, 25, 50, 100)`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span className="text-[10px]">{snapGrid > 0 ? `${snapGrid}u` : 'Snap: Off'}</span>
          </button>

          <div className="w-px h-4 bg-slate-700 mx-0.5" />

          {/* Collision Overlay Toggle */}
          <button
            id="btn-toggle-collision-overlay"
            onClick={() => setShowCollision(!showCollision)}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              showCollision ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Collision Geometry Mesh"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Grid Toggle */}
          <button
            id="btn-toggle-grid"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              showGrid ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle 3D Floor Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Water Surface Toggle */}
          <button
            id="btn-toggle-water-surface"
            onClick={() => setShowWater(!showWater)}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              showWater ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Shimmering Water Surface Plane"
          >
            <Droplets className="w-4 h-4" />
          </button>

          {/* Wireframe Toggle */}
          <button
            id="btn-toggle-wireframe"
            onClick={() => setShowWireframe(!showWireframe)}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              showWireframe ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Wireframe Mode"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-700 mx-0.5" />

          {/* Time of Day Presets: Day / Dusk / Night */}
          <button
            id="btn-tod-day"
            onClick={() => setTimeOfDay('day')}
            className={`p-1.5 rounded text-xs cursor-pointer ${
              timeOfDay === 'day' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
            }`}
            title="Day Lighting"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            id="btn-tod-dusk"
            onClick={() => setTimeOfDay('dusk')}
            className={`p-1.5 rounded text-xs cursor-pointer ${
              timeOfDay === 'dusk' ? 'bg-orange-500/30 text-orange-300' : 'text-slate-400'
            }`}
            title="Sunset / Dusk Lighting"
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            id="btn-tod-night"
            onClick={() => setTimeOfDay('night')}
            className={`p-1.5 rounded text-xs cursor-pointer ${
              timeOfDay === 'night' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400'
            }`}
            title="Night Lighting"
          >
            <Moon className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-700 mx-0.5" />

          {/* Recenter View */}
          <button
            id="btn-recenter-camera"
            onClick={recenterCamera}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
            title="Reset Camera View to Origin (HotKey: R)"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Fullscreen Viewport */}
          <button
            id="btn-fullscreen-toggle"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewport'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom-Left Keyboard & Hotkey Cheat Sheet Overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-400 flex items-center gap-2 shadow-lg">
          <span><kbd className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded border border-slate-700">WASD/Arrows</kbd> Fly</span>
          <span><kbd className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded border border-slate-700">Shift</kbd> Boost</span>
          <span><kbd className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded border border-slate-700">F</kbd> Focus</span>
          <span><kbd className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded border border-slate-700">R</kbd> Reset</span>
          <span><kbd className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded border border-slate-700">Ctrl+D</kbd> Dup</span>
          <span><kbd className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded border border-slate-700">Del</kbd> Delete</span>
        </div>
      </div>

      {/* Floating On-Screen Arrow Navigation D-Pad & Camera Controls (Bottom-Right) */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 shadow-2xl flex flex-col items-center gap-1">
          <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold mb-0.5 flex items-center gap-1.5">
            <span>Camera Nav</span>
            {activeKeys.boost && (
              <span className="px-1 py-0.2 bg-amber-500/30 text-amber-300 text-[9px] rounded font-bold">
                BOOST
              </span>
            )}
          </div>

          {/* D-Pad Arrows Grid */}
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              id="btn-nav-up"
              onClick={() => moveCamera('forward', activeKeys.boost)}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                activeKeys.up
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-95'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Forward (Arrow Up / W)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div />

            <button
              id="btn-nav-left"
              onClick={() => moveCamera('left', activeKeys.boost)}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                activeKeys.left
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-95'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Strafe Left (Arrow Left / A)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-nav-recenter"
              onClick={selectedActorUid ? focusSelectedActor : recenterCamera}
              className="p-1.5 rounded-lg border bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-amber-400 flex items-center justify-center transition-all cursor-pointer"
              title={selectedActorUid ? 'Focus Actor (F)' : 'Recenter (R)'}
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-nav-right"
              onClick={() => moveCamera('right', activeKeys.boost)}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                activeKeys.right
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-95'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Strafe Right (Arrow Right / D)"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div />
            <button
              id="btn-nav-down"
              onClick={() => moveCamera('backward', activeKeys.boost)}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                activeKeys.down
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-95'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Backward (Arrow Down / S)"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <div />
          </div>

          {/* Quick Zoom & Elevation Bar */}
          <div className="flex items-center gap-1 mt-1 pt-1 border-t border-slate-800 w-full justify-between">
            <button
              id="btn-nav-zoom-in"
              onClick={() => zoomCamera('in')}
              className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 flex-1 flex items-center justify-center cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              id="btn-nav-zoom-out"
              onClick={() => zoomCamera('out')}
              className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 flex-1 flex items-center justify-center cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Legend / Help Pill */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2.5 pointer-events-none text-[11px] text-slate-400 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-lg">
        <span className="text-sky-300 font-medium">⌨️ Arrow Keys / WASD: Pan & Fly</span>
        <span className="text-slate-600">•</span>
        <span>Shift: Boost</span>
        <span className="text-slate-600">•</span>
        <span>Left Drag: Orbit</span>
        <span className="text-slate-600">•</span>
        <span>Right Drag: Pan</span>
        <span className="text-slate-600">•</span>
        <span>Scroll: Zoom</span>
        <span className="text-slate-600">•</span>
        <span>Double-Click: Set Orbit Center</span>
        {editorMode === 'collision' && (
          <>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">Click Poly: Inspect</span>
          </>
        )}
      </div>
    </div>
  );
};
