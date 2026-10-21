import { useRef } from 'react';
import type { RootState } from '@react-three/fiber';

/**
 * Seconds since the intro began, measured on the wall clock so slow frames
 * (shader compile, weak GPUs) never stretch the animation. Starts on the third
 * rendered frame so the first-frame hitch is not eaten by the intro itself.
 */
export function useIntroClock(reduced: boolean) {
  const frames = useRef(0);
  const start = useRef<number | null>(reduced ? -99 : null);
  return (state: RootState) => {
    if (start.current === null) {
      frames.current += 1;
      if (frames.current < 3) return 0;
      start.current = state.clock.elapsedTime;
    }
    return state.clock.elapsedTime - start.current;
  };
}
