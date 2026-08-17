import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('naghma-history') || '[]'); } catch { return []; }
  });

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const len = queue.length;
      if (!len) return prev;
      const ni = (prev + 1) % len;
      const audio = audioRef.current;
      if (audio && queue[ni]) {
        audio.src = queue[ni].audio_url;
        audio.play().catch(() => {});
      }
      return ni;
    });
  }, [queue]);

  const nextRef = useRef(() => {});
  nextRef.current = next;

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onEnd = () => nextRef.current();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

  const playTrack = useCallback((track, list) => {
    const q = list && list.length ? list : [track];
    const idx = q.findIndex((t) => t.id === track.id);
    const finalIdx = idx >= 0 ? idx : 0;
    setQueue(q);
    setCurrentIndex(finalIdx);
    const audio = audioRef.current;
    if (audio) {
      audio.src = q[finalIdx].audio_url;
      audio.play().catch(() => {});
    }
    setHistory((prev) => {
      const filtered = prev.filter((tr) => tr.id !== track.id);
      const updated = [track, ...filtered].slice(0, 20);
      try { localStorage.setItem('naghma-history', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [currentTrack]);

  const prev = useCallback(() => {
    setCurrentIndex((prevIdx) => {
      const len = queue.length;
      if (!len) return prevIdx;
      const ni = prevIdx - 1;
      const finalIdx = ni >= 0 ? ni : len - 1;
      const audio = audioRef.current;
      if (audio && queue[finalIdx]) {
        audio.src = queue[finalIdx].audio_url;
        audio.play().catch(() => {});
      }
      return finalIdx;
    });
  }, [queue]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem('naghma-history'); } catch {}
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack, queue, currentIndex, isPlaying, currentTime, duration, volume, history,
        playTrack, togglePlay, next, prev, seek, setVolume, clearHistory,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};