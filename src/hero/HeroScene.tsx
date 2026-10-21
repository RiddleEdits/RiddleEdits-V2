import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Studio } from './Studio';
import { Ribbon, makePath, easeInOutCubic, type RibbonPath, type RibbonSpec } from './Ribbon';
import { makeInput, type Input } from './input';
import { useIntroClock } from './intro';

export interface HeroSceneProps {
  active: boolean;
  reduced: boolean;
  thumbs: string[];
}

const FOV = 30;

/** One long strip of film rising through the frame in a lazy S, rolling once as it goes. */
const MAIN: RibbonSpec = {
  points: [
    [-7.0, -4.4, -1.2],
    [-3.8, -3.1, 1.6],
    [-0.6, -1.9, 2.4],
    [2.0, -0.5, 1.3],
    [2.5, 1.0, -0.6],
    [0.7, 1.9, -1.8],
    [-1.6, 2.4, -1.2],
    [-2.3, 3.3, 0.7],
    [0.2, 4.4, 1.4],
    [3.8, 5.3, 0.1],
    [7.6, 6.2, -1.2],
  ],
  width: 1.6,
  twist: 0.85,
  phase: 0.6,
  delay: 0.25,
  speed: 0.035,
  seed: 0,
};

/** A white playhead that travels along the strip, the way it scrubs across a timeline. */
function Playhead({ path, reduced }: { path: RibbonPath; reduced: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const introTime = useIntroClock(reduced);
  const P = useMemo(() => new THREE.Vector3(), []);
  const W = useMemo(() => new THREE.Vector3(), []);
  const N = useMemo(() => new THREE.Vector3(), []);
  const T = useMemo(() => new THREE.Vector3(), []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const w = path.spec.width;

  useFrame((state) => {
    const e = introTime(state);
    const show = e > path.spec.delay + 2.0;
    group.current.visible = show;
    if (!show) return;
    const t = state.clock.elapsedTime;
    const u = 0.14 + 0.72 * (0.5 - 0.5 * Math.cos((t * Math.PI) / 9));
    path.frameAt(u, P, W, N);
    path.curve.getTangentAt(u, T);
    T.crossVectors(N, W).normalize();
    m.makeBasis(W, T, N);
    group.current.position.copy(P).addScaledVector(N, 0.012);
    group.current.quaternion.setFromRotationMatrix(m);
  });

  return (
    <group ref={group} visible={false}>
      <mesh>
        <planeGeometry args={[w * 1.18, 0.034]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* the head: a small navy marker past the top edge */}
      <mesh position={[w * 0.62, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.085, 3]} />
        <meshBasicMaterial color="#0b1630" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

const BARS = 260;

/** The audio track: thin waveform bars running beside the film, gently alive. */
function Waveform({ path, reduced }: { path: RibbonPath; reduced: boolean }) {
  const introTime = useIntroClock(reduced);
  const lines = useRef<THREE.LineSegments>(null!);
  const base = useMemo(() => {
    const P = new THREE.Vector3();
    const W = new THREE.Vector3();
    const N = new THREE.Vector3();
    const pts: { p: THREE.Vector3; w: THREE.Vector3 }[] = [];
    for (let i = 0; i < BARS; i++) {
      const u = 0.06 + (i / (BARS - 1)) * 0.86;
      path.frameAt(u, P, W, N);
      const p = P.clone().addScaledVector(W, -(path.spec.width / 2 + 0.3));
      pts.push({ p, w: W.clone() });
    }
    return pts;
  }, [path]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BARS * 6), 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const e = introTime(state);
    const reveal = easeInOutCubic(Math.min(1, Math.max(0, (e - path.spec.delay - 0.6) / 2.2)));
    const visible = Math.floor(reveal * BARS);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < BARS; i++) {
      const { p, w } = base[i];
      const env = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.045 + 0.6));
      const a = i < visible ? (0.03 + 0.13 * env * Math.abs(Math.sin(i * 0.9 + t * 2.6) * Math.cos(i * 0.31 - t * 1.4))) : 0;
      pos.setXYZ(i * 2, p.x - w.x * a, p.y - w.y * a, p.z - w.z * a);
      pos.setXYZ(i * 2 + 1, p.x + w.x * a, p.y + w.y * a, p.z + w.z * a);
    }
    pos.needsUpdate = true;
    lines.current.visible = visible > 0;
  });

  return (
    <lineSegments ref={lines} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial color="#2457ff" transparent opacity={0.55} toneMapped={false} />
    </lineSegments>
  );
}

function Rig({ reduced, thumbs }: Omit<HeroSceneProps, 'active'>) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const rig = useRef<THREE.Group>(null!);
  const input = useMemo<Input>(makeInput, []);
  const introTime = useIntroClock(reduced);
  const path = useMemo(() => makePath(MAIN), []);

  // fit the strip to the canvas
  useEffect(() => {
    const aspect = size.width / size.height;
    const t = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const dist = Math.max(4.9 / t, 4.4 / (t * aspect));
    camera.position.set(0, 1.2, dist);
    camera.lookAt(0, 0.9, 0);
    invalidate();
  }, [size, camera, invalidate]);

  useEffect(() => {
    const el = gl.domElement;
    el.style.cursor = 'grab';
    let lastX = 0;
    let lastY = 0;
    let prevX = 0;
    let prevY = 0;
    const onMove = (e: PointerEvent) => {
      input.px = (e.clientX / window.innerWidth) * 2 - 1;
      input.py = (e.clientY / window.innerHeight) * 2 - 1;
      const v = Math.hypot(e.clientX - prevX, e.clientY - prevY) / 60;
      input.speed = Math.min(1, input.speed + v * 0.25);
      prevX = e.clientX;
      prevY = e.clientY;
      if (input.dragging) {
        input.yaw = THREE.MathUtils.clamp(input.yaw + (e.clientX - lastX) * 0.006, -1.1, 1.1);
        input.pitch = THREE.MathUtils.clamp(input.pitch + (e.clientY - lastY) * 0.003, -0.35, 0.35);
        lastX = e.clientX;
        lastY = e.clientY;
      }
      invalidate();
    };
    const down = (e: PointerEvent) => {
      input.dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.style.cursor = 'grabbing';
    };
    const up = () => {
      if (!input.dragging) return;
      input.dragging = false;
      el.style.cursor = 'grab';
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [gl, input, invalidate]);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const k = 1 - Math.exp(-dt * 4);
    input.sx += (input.px - input.sx) * k;
    input.sy += (input.py - input.sy) * k;
    input.speed *= Math.exp(-dt * 2.5);
    if (!input.dragging) {
      const back = 1 - Math.exp(-dt * 2.2);
      input.yaw -= input.yaw * back;
      input.pitch -= input.pitch * back;
    }
    const t = state.clock.elapsedTime;
    const arrive = 1 - Math.pow(1 - Math.min(1, introTime(state) / 1.8), 3);
    const g = rig.current;
    g.rotation.y = input.sx * 0.22 + input.yaw + Math.sin(t * 0.25) * 0.05 - (1 - arrive) * 0.35;
    g.rotation.x = -input.sy * 0.08 + input.pitch;
    g.position.y = Math.sin(t * 0.6) * 0.06;
  });

  return (
    <>
      <Studio />
      <directionalLight position={[-3, 6, 8]} intensity={1.0} />
      <ambientLight intensity={0.35} />
      <group ref={rig}>
        <Ribbon path={path} thumbs={thumbs} reduced={reduced} input={input} />
        <Playhead path={path} reduced={reduced} />
        <Waveform path={path} reduced={reduced} />
      </group>
    </>
  );
}

export default function HeroScene({ active, reduced, thumbs }: HeroSceneProps) {
  return (
    <Canvas
      frameloop={active ? (reduced ? 'demand' : 'always') : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: FOV, position: [0, 1.2, 16], near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
      aria-label="A blue strip of film with video frames flowing through space. Drag to turn it."
      role="img"
    >
      <Rig reduced={reduced} thumbs={thumbs} />
    </Canvas>
  );
}
