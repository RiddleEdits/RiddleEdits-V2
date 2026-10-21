/** Shared, mutable pointer state, read inside useFrame without re-rendering React. */
export interface Input {
  /** Raw pointer, -1..1 across the window. */
  px: number;
  py: number;
  /** Smoothed pointer. */
  sx: number;
  sy: number;
  /** Smoothed pointer speed, used to scrub the film. */
  speed: number;
  /** Extra rotation from dragging; springs back to 0. */
  yaw: number;
  pitch: number;
  dragging: boolean;
}

export const makeInput = (): Input => ({ px: 0, py: 0, sx: 0, sy: 0, speed: 0, yaw: 0, pitch: 0, dragging: false });
