/**
 * HeroCanvas — "The Unfolding N"
 *
 * Three architectural slabs that assemble into the letter N on scroll,
 * then the diagonal slab straightens and fills the screen.
 *
 * Scroll phases (progress 0 → 1):
 *   0.00 – 0.35  →  Three slabs slide & rotate into the N shape
 *   0.35 – 0.50  →  Assembled N scales towards camera (gate effect)
 *   0.50 – 0.65  →  Diagonal straightens, fills viewport, bg → white
 */
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

/* ── Geometry constants ───────────────────────────────── */
const BAR_W       = 0.28;
const BAR_H       = 2.0;
const BAR_D       = 0.28;
const DIAG_SPAN_X = 1.70;
const DIAG_SPAN_Y = 2.00;
const DIAG_ANGLE  = Math.atan2(DIAG_SPAN_X, DIAG_SPAN_Y);
const DIAG_LEN    = Math.sqrt(DIAG_SPAN_X ** 2 + DIAG_SPAN_Y ** 2);

/* ── Helpers ──────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeOut(t: number)  { return 1 - (1 - Math.min(1, Math.max(0, t))) ** 3; }
function easeIn(t: number)   { return Math.min(1, Math.max(0, t)) ** 2; }
function clamp01(t: number)  { return Math.min(1, Math.max(0, t)); }

/* ── Three.js component ───────────────────────────────── */
function NStrokes({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const leftRef    = useRef<THREE.Mesh>(null);
  const diagRef    = useRef<THREE.Mesh>(null);
  const rightRef   = useRef<THREE.Mesh>(null);
  const groupRef   = useRef<THREE.Group>(null);
  const smoothed   = useRef(0);
  const { scene }  = useThree();

  const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.08,
    metalness: 0.0,
  }), []);

  useFrame(() => {
    if (!leftRef.current || !diagRef.current || !rightRef.current || !groupRef.current) return;

    smoothed.current += (progressRef.current - smoothed.current) * 0.055;
    const p = smoothed.current;

    /* Phase 1: assemble (0 → 0.35) */
    const a = easeOut(clamp01(p / 0.35));

    leftRef.current.position.set(lerp(-6, -0.85, a), 0, lerp(1.5, 0, a));
    leftRef.current.rotation.set(0, lerp(Math.PI * 0.55, 0, a), 0);

    diagRef.current.position.set(0, lerp(5, 0, a), lerp(-0.5, 0, a));
    diagRef.current.rotation.set(lerp(-Math.PI / 2, 0, a), 0, lerp(0, DIAG_ANGLE, a));

    rightRef.current.position.set(lerp(6, 0.85, a), 0, lerp(1.5, 0, a));
    rightRef.current.rotation.set(0, lerp(-Math.PI * 0.55, 0, a), 0);

    /* Phase 2: gate zoom (0.35 → 0.50) */
    const s2 = easeIn(clamp01((p - 0.35) / 0.15));
    const gateScale = lerp(1, 5, s2);

    /* Phase 3: slab takeover (0.50 → 0.65) */
    const t3 = clamp01((p - 0.50) / 0.15);
    const t3e = easeOut(t3);
    const takeoverScale = lerp(5, 40, t3e);

    // Combined scale
    const currentScale = p < 0.50 ? gateScale : takeoverScale;
    groupRef.current.scale.setScalar(currentScale);
    groupRef.current.position.z = lerp(0, 0.5, clamp01(s2));

    // Phase 3: straighten diagonal rotation
    if (t3 > 0) {
      diagRef.current.rotation.z = lerp(DIAG_ANGLE, 0, t3e);
    }

    // Phase 3: hide left/right bars (they're off-screen by this point)
    leftRef.current.visible = t3 < 0.15;
    rightRef.current.visible = t3 < 0.15;

    // Phase 3: background black → white
    if (scene.background instanceof THREE.Color) {
      scene.background.setRGB(clamp01(t3e), clamp01(t3e), clamp01(t3e));
    }

  });

  return (
    <group ref={groupRef}>
      <mesh ref={leftRef} material={whiteMat}>
        <boxGeometry args={[BAR_W, BAR_H, BAR_D]} />
        <Edges color="#aaaaaa" threshold={15} lineWidth={0.8} />
      </mesh>

      <mesh ref={diagRef} material={whiteMat}>
        <boxGeometry args={[BAR_W, DIAG_LEN, BAR_D]} />
        <Edges color="#aaaaaa" threshold={15} lineWidth={0.8} />
      </mesh>

      <mesh ref={rightRef} material={whiteMat}>
        <boxGeometry args={[BAR_W, BAR_H, BAR_D]} />
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
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 6, 5]}  intensity={1.6} />
      <directionalLight position={[-5, -3, 2]} intensity={0.35} color="#6688ff" />
      <NStrokes progressRef={progressRef} />
    </Canvas>
  );
}
