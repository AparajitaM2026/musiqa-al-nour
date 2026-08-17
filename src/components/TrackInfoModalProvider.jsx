import React, { createContext, useContext, useState } from 'react';
import TrackInfoModal from '@/components/TrackInfoModal';

const defaultCtx = { openTrackInfo: () => {} };
const TrackInfoContext = createContext(defaultCtx);

export function TrackInfoModalProvider({ children }) {
  const [track, setTrack] = useState(null);
  const openTrackInfo = (tr) => setTrack(tr);
  const onClose = () => setTrack(null);

  return (
    <TrackInfoContext.Provider value={{ openTrackInfo }}>
      {children}
      <TrackInfoModal track={track} onClose={onClose} />
    </TrackInfoContext.Provider>
  );
}

export function useTrackInfo() {
  return useContext(TrackInfoContext);
}