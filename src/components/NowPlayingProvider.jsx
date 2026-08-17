import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import NowPlaying from '@/components/NowPlaying';

const defaultCtx = { openNowPlaying: () => {}, closeNowPlaying: () => {} };
const NowPlayingContext = createContext(defaultCtx);

export function NowPlayingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openNowPlaying = () => setOpen(true);
  const closeNowPlaying = () => setOpen(false);

  return (
    <NowPlayingContext.Provider value={{ openNowPlaying, closeNowPlaying }}>
      {children}
      <AnimatePresence>
        {open && <NowPlaying key="now-playing" onClose={closeNowPlaying} />}
      </AnimatePresence>
    </NowPlayingContext.Provider>
  );
}

export function useNowPlaying() {
  return useContext(NowPlayingContext);
}