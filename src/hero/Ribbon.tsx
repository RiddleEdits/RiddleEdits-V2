import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { createFilm, loadThumbs, FILM_W, FILM_H } from './textures';
import { useIntroClock } from './intro';
import type { Input } from './input';

export const SEGMENTS = 480;

export interface RibbonSpec {
  points: [number, number, number][];
  width: number;
  /** Roll around the strip's own axis (radians). */
  twist: number;
  phase: number;
  /** Seconds after the intro starts before it unfurls. */
  delay: number;
  /** Frame scroll speed along the strip. */
  speed: number;
  /** Which video fills the first frame. */
  seed: number;
}

export interface RibbonPath {
  spec: RibbonSpec;
  curve: THREE.CatmullRomCurve3;
  length: number;
  /** Position, width direction and normal at u (0..1). */
  frameAt: (u: number, P: THREE.Vector3, W: THREE.Vector3, N: THREE.Vector3) => void;
}

const C = new THREE.Vector3(0, 0.18, 1).normalize();

/** The spine of a ribbon: a spline with a camera-facing frame that rolls along its length. */
export function makePath(spec: RibbonSpec): RibbonPath {
  const curve = new THREE.CatmullRomCurve3(
    spec.points.map((p) => new THREE.Vector3(...p)),
    false,
    'catmullrom',
    0.5,
  );
  const length = curve.getLength();
  const T = new THREE.Vector3();
  const n0 = new THREE.Vector3();
  const w0 = new THREE.Vector3();
  const frameAt = (u: number, P: THREE.Vector3, W: THREE.Vector3, N: THREE.Vector3) => {
    const s = u * length;
    curve.getPointAt(u, P);
    curve.getTangentAt(u, T).normalize();
    n0.copy(C).addScaledVector(T, -C.dot(T));
    if (n0.lengthSq() < 1e-4) n0.set(0, 1, 0);
    n0.normalize();
    w0.crossVectors(n0, T).normalize();
    const phi = spec.twist * Math.sin(s * 0.36 + spec.phase) + 0.2 * Math.sin(s * 0.85 + spec.phase * 2);
    W.copy(w0).multiplyScalar(Math.cos(phi)).addScaledVector(n0, Math.sin(phi));
    N.crossVectors(T, W).normalize();
  };
  return { spec, curve, length, frameAt };
}

function buildGeometry(path: RibbonPath) {
  const { spec, length, frameAt } = path;
  const tileLen = spec.width * (FILM_W / FILM_H);
  const verts = (SEGMENTS + 1) * 2;
  const position = new Float32Array(verts * 3);
  const normal = new Float32Array(verts * 3);
  const uv = new Float32Array(verts * 2);
  const index: number[] = [];
  const P = new THREE.Vector3();
  const W = new THREE.Vector3();
  const N = new THREE.Vector3();

  for (let i = 0; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS;
    frameAt(u, P, W, N);
    for (let side = 0; side < 2; side++) {
      const k = i * 2 + side;
      const sign = side === 0 ? -1 : 1;
      position[k * 3] = P.x + W.x * sign * (spec.width / 2);
      position[k * 3 + 1] = P.y + W.y * sign * (spec.width / 2);
      position[k * 3 + 2] = P.z + W.z * sign * (spec.width / 2);
      normal[k * 3] = N.x;
      normal[k * 3 + 1] = N.y;
      normal[k * 3 + 2] = N.z;
      uv[k * 2] = (u * length) / tileLen;
      uv[k * 2 + 1] = side;
    }
    if (i < SEGMENTS) {
      const a = i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(index);
  return geometry;
}

export const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function Ribbon({ path, thumbs, reduced, input }: { path: RibbonPath; thumbs: string[]; reduced: boolean; input: Input }) {
  const invalidate = useThree((s) => s.invalidate);
  const mesh = useRef<THREE.Mesh>(null!);
  const film = useMemo(() => createFilm(path.spec.seed), [path.spec.seed]);
  const geometry = useMemo(() => buildGeometry(path), [path]);
  const introTime = useIntroClock(reduced);
  const scroll = useRef(0);

  useEffect(() => {
    const n = thumbs.length;
    if (!n) return;
    const picks = [0, 1, 2, 3].map((i) => thumbs[(i + path.spec.seed) % n]);
    loadThumbs(picks, (slot, img) => {
      film.setThumb(slot, img);
      invalidate();
    });
  }, [thumbs, film, invalidate, path.spec.seed]);

  useEffect(() => {
    geometry.setDrawRange(0, reduced ? SEGMENTS * 6 : 0);
  }, [geometry, reduced]);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const p = Math.min(1, Math.max(0, (introTime(state) - path.spec.delay) / 2.4));
    const segs = Math.floor(easeInOutCubic(p) * SEGMENTS);
    geometry.setDrawRange(0, segs * 6);
    mesh.current.visible = segs > 0;
    // moving the mouse scrubs the film a little faster, like dragging a timeline
    scroll.current += dt * (path.spec.speed + Math.min(0.5, input.speed) * 0.35);
    film.texture.offset.x = -scroll.current;
  });

  return (
    <mesh ref={mesh} geometry={geometry} frustumCulled={false}>
      <meshStandardMaterial
        map={film.texture}
        emissiveMap={film.texture}
        emissive="#ffffff"
        emissiveIntensity={0.32}
        alphaTest={0.5}
        side={THREE.DoubleSide}
        roughness={0.32}
        metalness={0.1}
        envMapIntensity={1.15}
      />
    </mesh>
  );
}
