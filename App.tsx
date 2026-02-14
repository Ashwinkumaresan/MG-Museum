
import React, { useState, useEffect, useCallback } from 'react';
import Gallery from './components/Gallery';
import UIOverlay from './components/UIOverlay';
import { useControls } from './hooks/useControls';
import { ArtworkData } from './types';
// Import motion with an alias to allow re-declaring it with any type for fixing TS environment errors
import { motion as _motion, AnimatePresence } from 'framer-motion';

// Fix for framer-motion type mismatch in the environment where motion props like 'initial', 'animate' are not correctly recognized
const motion = _motion as any;

const App: React.FC = () => {
  const controls = useControls();
  const [focusedArtwork, setFocusedArtwork] = useState<ArtworkData | null>(null);
  const [isNearby, setIsNearby] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensuring loading state transition is handled outside of any potentially complex render cycles
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Use callback for status updates to prevent unnecessary re-renders in the Three.js loop
  const handleNearbyStatus = useCallback((status: boolean) => {
    setIsNearby(status);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusedArtwork) {
          setFocusedArtwork(null);
        } else {
          setIsMenuOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [focusedArtwork]);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white font-sans">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[1000]"
          >
            <div className="w-12 h-12 border border-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 bg-black rounded-full"
              />
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
              <h1 className="text-[10px] tracking-[0.6em] font-bold text-black uppercase">MG Museum</h1>
              <p className="text-[8px] tracking-[0.2em] text-neutral-300 uppercase">A Journey Through Art And MG's History</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full h-full">
        <Gallery
          controls={controls}
          onArtworkFocus={setFocusedArtwork}
          onNearbyStatus={handleNearbyStatus}
          focusedArtwork={focusedArtwork}
        />
      </main>

      {!loading && (
        <UIOverlay
          focusedArtwork={focusedArtwork}
          onExit={() => setFocusedArtwork(null)}
          isNearby={isNearby}
          isMenuOpen={isMenuOpen}
          onToggleMenu={setIsMenuOpen}
          onReset={handleReset}
          onGoTo={(art) => {
            // Navigation functionality
          }}
        />
      )}

      {!loading && (
        <audio autoPlay loop muted>
          <source src="https://assets.mixkit.co/sfx/preview/mixkit-minimalist-digital-ambience-loop-2114.mp3" type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};

export default App;
