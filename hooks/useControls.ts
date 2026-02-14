
import { useState, useEffect } from 'react';
import { ControlState } from '../types';

export const useControls = () => {
  const [controls, setControls] = useState<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    view: false,
    exit: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setControls((c) => ({ ...c, forward: true }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setControls((c) => ({ ...c, backward: true }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setControls((c) => ({ ...c, left: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setControls((c) => ({ ...c, right: true }));
          break;
        case 'Enter':
          setControls((c) => ({ ...c, view: true }));
          break;
        case 'Escape':
          setControls((c) => ({ ...c, exit: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setControls((c) => ({ ...c, forward: false }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setControls((c) => ({ ...c, backward: false }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setControls((c) => ({ ...c, left: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setControls((c) => ({ ...c, right: false }));
          break;
        case 'Enter':
          setControls((c) => ({ ...c, view: false }));
          break;
        case 'Escape':
          setControls((c) => ({ ...c, exit: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
};
