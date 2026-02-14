
import React, { useState } from 'react';
// Import motion with an alias to allow re-declaring it with any type for fixing TS environment errors
import { motion as _motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, MousePointer2, Command, Info, RotateCcw, LayoutGrid } from 'lucide-react';
import ParticleTransition from './ParticleTransition';
import { ArtworkData } from '../types';
import { ARTWORKS, GALLERY_NAME } from '../constants';

// Fix for framer-motion type mismatch in the environment where motion props like 'initial', 'animate' are not correctly recognized
const motion = _motion as any;

interface UIOverlayProps {
  focusedArtwork: ArtworkData | null;
  onExit: () => void;
  isNearby: boolean;
  isMenuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
  onReset: () => void;
  onGoTo: (artwork: ArtworkData) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  focusedArtwork, onExit, isNearby, isMenuOpen, onToggleMenu, onReset, onGoTo
}) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnterClick = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setHasClicked(true);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-sans">

      {/* Click to Enter Overlay */}
      {!hasClicked && (
        <div
          className="absolute inset-0 z-[1000] bg-white flex items-center justify-center pointer-events-auto cursor-pointer"
          onClick={!isTransitioning ? handleEnterClick : undefined}
        >
          {isTransitioning && <ParticleTransition onComplete={handleTransitionComplete} />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={isTransitioning ? { opacity: 0, scale: 3, filter: 'blur(10px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-6"
          >
            <MousePointer2 className="w-8 h-8 text-black animate-pulse" />
            <span className="text-[10px] tracking-[0.5em] font-bold uppercase text-black">Click to Enter Space</span>
            <span className="text-[8px] tracking-[0.2em] text-neutral-300 uppercase">Use Mouse to Look Around</span>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-12 flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <h1 className="text-sm font-bold tracking-[0.5em] text-black uppercase">{GALLERY_NAME}</h1>
          <div className="w-12 h-px bg-black/20 mt-4" />
        </motion.div>

        <div className="pointer-events-auto">
          <button
            onClick={() => onToggleMenu(!isMenuOpen)}
            className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:text-black transition-colors"
          >
            {isMenuOpen ? '[ Close Menu ]' : '[ Open Menu ]'}
          </button>
        </div>
      </div>

      {/* Main Bottom Instruction */}
      <AnimatePresence>
        {!focusedArtwork && !isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12"
          >
            <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
              <span className="font-bold text-black">Move</span>
              <span>WASD</span>
            </div>

            <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
              <span className="font-bold text-black">Look</span>
              <span>Mouse</span>
            </div>

            {isNearby && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 text-[10px] tracking-[0.2em] bg-black text-white px-6 py-3 rounded-full shadow-lg"
              >
                <Command size={12} />
                <span>Read details ↵</span>
              </motion.div>
            )}

            <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
              <span className="font-bold text-black">Menu</span>
              <span>ESC</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ESC Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[200] pointer-events-auto p-24"
          >
            <div className="max-w-6xl mx-auto h-full grid grid-cols-12 gap-12">
              <div className="col-span-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-[11px] font-bold tracking-[0.5em] text-black uppercase mb-8">Navigation</h2>
                  <div className="flex flex-col gap-8">
                    <button
                      onClick={onReset}
                      className="flex items-center gap-4 text-3xl font-light hover:translate-x-2 transition-transform text-neutral-400 hover:text-black"
                    >
                      <RotateCcw size={24} />
                      <span>Entrance</span>
                    </button>
                    <button className="flex items-center gap-4 text-3xl font-light hover:translate-x-2 transition-transform text-neutral-400 hover:text-black">
                      <Info size={24} />
                      <span>About Space</span>
                    </button>
                  </div>
                </div>

                <div className="text-[10px] tracking-[0.2em] text-neutral-400 leading-relaxed max-w-xs">
                  A DIGITAL EXPERIENCE DESIGNED FOR CONTEMPLATION. USE MOVEMENT TO DISCOVER THE CURATED WORKS WITHIN THE ARCHIVE.
                </div>
              </div>

              <div className="col-span-8 overflow-y-auto pr-8 custom-scrollbar">
                <h2 className="text-[11px] font-bold tracking-[0.5em] text-black uppercase mb-12 flex items-center gap-4">
                  <LayoutGrid size={14} />
                  Archive Collection
                </h2>
                <div className="grid grid-cols-2 gap-x-12 gap-y-16">
                  {ARTWORKS.map((art) => (
                    <div
                      key={art.id}
                      className="group cursor-pointer border-b border-neutral-100 pb-8 hover:border-black transition-colors"
                      onClick={() => {
                        onGoTo(art);
                        onToggleMenu(false);
                      }}
                    >
                      <span className="text-[10px] font-mono text-neutral-300 mb-2 block">ID // 00{art.id}</span>
                      <h3 className="text-xl font-light group-hover:pl-2 transition-all">{art.title}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-2">By {art.artist}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onToggleMenu(false)}
              className="absolute top-12 right-12 w-12 h-12 flex items-center justify-center border border-neutral-100 rounded-full hover:bg-black hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artwork Focus Details Panel */}
      <AnimatePresence>
        {focusedArtwork && (
          <div className="pointer-events-auto">
            {/* Left Image Frame */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute left-40 top-20 -translate-y-1/2 z-[300]"
            >
              <div className="bg-white p-4 shadow-2xl -rotate-1">
                <img
                  src={focusedArtwork.imageUrl}
                  alt={focusedArtwork.title}
                  className="max-w-[40vw] max-h-[70vh] object-contain block shadow-inner"
                />
              </div>
            </motion.div>

            {/* Right Details Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] p-10 flex flex-col justify-between z-[300]"
            >
              <div className="flex flex-col gap-12">
                <button
                  onClick={onExit}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold tracking-[0.4em] text-neutral-400 uppercase">Catalogue / 00{focusedArtwork.id}</span>
                  <h2 className="text-4xl font-serif text-black leading-tight italic">{focusedArtwork.title}</h2>
                  <p className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">{focusedArtwork.artist}</p>
                </div>

                <div className="w-16 h-px bg-black/10" />

                <p className="text-sm leading-loose font-light">
                  {focusedArtwork.description}
                </p>
              </div>

              <button
                onClick={onExit}
                className="group flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-neutral-500 transition-colors"
              >
                <div className="w-8 h-px bg-black group-hover:w-12 transition-all" />
                Return to walk - Press ENTER
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UIOverlay;
