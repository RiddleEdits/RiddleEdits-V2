import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A tiny virtual photo studio baked into an environment map (no network HDRI needed).
 * A soft sky gradient, plus bright softboxes that give the aluminium its long reflections.
 */
export function Studio() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const room = new THREE.Scene();

    const R = 30;
    const dome = new THREE.SphereGeometry(R, 48, 24);
    const pos = dome.attributes.position;
    const top = new THREE.Color('#eaf2ff');
    const mid = new THREE.Color('#a4c1f7');
    const bot = new THREE.Color('#5b82d8');
    const tmp = new THREE.Color();
    const colors: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / R;
      tmp.copy(mid).lerp(y > 0 ? top : bot, Math.abs(y));
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    dome.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    room.add(new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));

    const mats: THREE.Material[] = [];
    const geos: THREE.BufferGeometry[] = [dome];
    const softbox = (w: number, h: number, at: [number, number, number], power: number, color: string) => {
      const g = new THREE.PlaneGeometry(w, h);
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...at);
      mesh.lookAt(0, 0, 0);
      room.add(mesh);
      geos.push(g);
      mats.push(m);
    };

    softbox(14, 9, [-10, 14, 12], 7, '#ffffff'); // big key light, top left
    softbox(6, 16, [16, 4, -8], 5, '#cfe1ff'); // cool rim from the right
    softbox(18, 3, [0, -6, 14], 2.2, '#bcd2ff'); // low fill so the deck reads
    softbox(8, 8, [12, 8, 14], 3, '#ffffff'); // second highlight

    const rt = pm.fromScene(room, 0.03);
    scene.environment = rt.texture;

    return () => {
      scene.environment = null;
      rt.dispose();
      pm.dispose();
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
    };
  }, [gl, scene]);

  return null;
}
