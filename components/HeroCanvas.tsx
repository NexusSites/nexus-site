/**
 * HeroCanvas — "The Unfolding O/>"
 *
 * Three pieces assemble into O/> on scroll.
 * O is a torus ring with a gap where the slash cuts through.
 * / is a thin box slab.  > is a single extruded chevron shape.
 *
 * Scroll phases (progress 0 → 1):
 *   0.00 – 0.35  →  Pieces slide & rotate into O/> shape
 *   0.35 – 0.50  →  Assembled O/> scales towards camera (gate effect)
 *   0.50 – 0.65  →  Slash straightens, fills viewport, bg → white
 */
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

/* ── Geometry constants ───────────────────────────────── */

// O ring
const O_RADIUS    = 0.32;
const O_TUBE      = 0.025;
const O_SEGMENTS  = 64;
const O_CENTER_X  = -0.35;
const O_GAP_DEG   = 90;                           // gap size in degrees
const O_ARC       = (360 - O_GAP_DEG) * Math.PI / 180; // arc length
const O_ROT_Z     = 22 * Math.PI / 180;           // final gap rotation toward slash
const O_ROLL_TURNS = 1.5;                          // number of full rolls before settling
const O_ROLL_START = (O_ROLL_TURNS * Math.PI * 2) + O_ROT_Z; // start rotation (rolls forward to O_ROT_Z)

// Slash /
const SLAB_W       = 0.045;
const SLAB_D       = 0.045;
const SLASH_SPAN_X = 0.35;
const SLASH_SPAN_Y = 0.9;
const SLASH_ANGLE  = Math.atan2(SLASH_SPAN_X, SLASH_SPAN_Y);
const SLASH_LEN    = Math.sqrt(SLASH_SPAN_X ** 2 + SLASH_SPAN_Y ** 2);

// > chevron
const CHEV_H = 0.32;    // half height
const CHEV_W = 0.28;    // horizontal span
const CHEV_T = 0.045;   // stroke thickness
const CHEV_X = 0.52;    // x position
const CHEV_D = 0.045;   // depth

/* ── Helpers ──────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeOut(t: number)  { return 1 - (1 - Math.min(1, Math.max(0, t))) ** 3; }
function easeIn(t: number)   { return Math.min(1, Math.max(0, t)) ** 2; }
function clamp01(t: number)  { return Math.min(1, Math.max(0, t)); }

/* ── Build > chevron shape ────────────────────────────── */
function createChevronGeo() {
  const H = CHEV_H, W = CHEV_W, T = CHEV_T;
  const armLen = Math.sqrt(W * W + H * H);
  const yOff = T * armLen / H;
  const innerVx = T / Math.sin(Math.atan2(H, W));

  // > shape — vertex at origin, arms extend left
  const shape = new THREE.Shape();
  shape.moveTo(-W, H);
  shape.lineTo(0, 0);
  shape.lineTo(-W, -H);
  shape.lineTo(-W, -H + yOff);
  shape.lineTo(-innerVx, 0);
  shape.lineTo(-W, H - yOff);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, { depth: CHEV_D, bevelEnabled: false });
  geo.translate(0, 0, -CHEV_D / 2);
  return geo;
}

/* ── Three.js component ───────────────────────────────── */
function OSlashChevron({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const oRef      = useRef<THREE.Mesh>(null);
  const slashRef  = useRef<THREE.Mesh>(null);
  const chevRef   = useRef<THREE.Mesh>(null);
  const groupRef  = useRef<THREE.Group>(null);
  const smoothed  = useRef(0);
  const { scene } = useThree();

  const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 0.6,
    roughness: 0.08,
    metalness: 0.0,
  }), []);

  const chevGeo = useMemo(() => createChevronGeo(), []);

  const oGeo = useMemo(() => {
    const geo = new THREE.TorusGeometry(O_RADIUS, O_TUBE, 32, O_SEGMENTS, O_ARC);
    return geo;
  }, []);

  useFrame(() => {
    if (!oRef.current || !slashRef.current || !chevRef.current || !groupRef.current) return;

    smoothed.current += (progressRef.current - smoothed.current) * 0.055;
    const p = smoothed.current;

    /* Phase 1: assemble (0 → 0.35) */
    const a = easeOut(clamp01(p / 0.35));

    // O rolls in from left (starts off-screen)
    oRef.current.position.set(lerp(-5, O_CENTER_X, a), 0, 0);
    oRef.current.rotation.set(0, 0, lerp(O_ROLL_START, O_ROT_Z, a));

    // / drops in from above
    slashRef.current.position.set(0, lerp(3, 0, a), lerp(-0.5, 0, a));
    slashRef.current.rotation.set(
      lerp(-Math.PI / 2, 0, a),
      0,
      lerp(0, -SLASH_ANGLE, a)
    );

    // > flies in from right
    chevRef.current.position.set(lerp(3, CHEV_X, a), 0, lerp(1.5, 0, a));
    chevRef.current.rotation.set(0, lerp(-Math.PI * 0.5, 0, a), 0);

    /* Phase 2: gate zoom (0.35 → 0.50) */
    const s2 = easeIn(clamp01((p - 0.35) / 0.15));
    const gateScale = lerp(1, 5, s2);

    /* Phase 3: slab takeover (0.50 → 0.65) */
    const t3 = clamp01((p - 0.50) / 0.15);
    const t3e = easeOut(t3);
    const takeoverScale = lerp(5, 40, t3e);

    const currentScale = p < 0.50 ? gateScale : takeoverScale;
    groupRef.current.scale.setScalar(currentScale);
    groupRef.current.position.z = lerp(0, 0.5, clamp01(s2));

    // Phase 3: straighten slash
    if (t3 > 0) {
      slashRef.current.rotation.z = lerp(-SLASH_ANGLE, 0, t3e);
    }

    // Phase 3: hide O and chevron
    oRef.current.visible = t3 < 0.15;
    chevRef.current.visible = t3 < 0.15;

    // Phase 3: background black → white
    if (scene.background instanceof THREE.Color) {
      scene.background.setRGB(clamp01(t3e), clamp01(t3e), clamp01(t3e));
    }
  });

  return (
    <group ref={groupRef}>
      {/* O ring */}
      <mesh ref={oRef} geometry={oGeo} material={whiteMat}>
        <Edges color="#aaaaaa" threshold={15} lineWidth={0.8} />
      </mesh>

      {/* / slash */}
      <mesh ref={slashRef} material={whiteMat}>
        <boxGeometry args={[SLAB_W, SLASH_LEN, SLAB_D]} />
        <Edges color="#aaaaaa" threshold={15} lineWidth={0.8} />
      </mesh>

      {/* > chevron */}
      <mesh ref={chevRef} geometry={chevGeo} material={whiteMat}>
        <Edges color="#aaaaaa" threshold={15} lineWidth={0.8} />
      </mesh>
    </group>
  );
}

/* ── Public component ─────────────────────────────────── */
interface HeroCanvasProps {
  progress: number;
}

export default function HeroCanvas({ progress }: HeroCanvasProps) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 3.6], fov: 42 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 6, 5]}  intensity={1.6} />
      <directionalLight position={[-5, -3, 2]} intensity={0.35} color="#6688ff" />
      <OSlashChevron progressRef={progressRef} />
    </Canvas>
  );
}
