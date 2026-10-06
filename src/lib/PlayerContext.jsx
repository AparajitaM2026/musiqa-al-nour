import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('musiqa-al-nour-history') || '[]'); } catch { return []; }
  });
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const len = queue.length;
      if (!len) return prev;
      let ni;
      if (shuffle && len > 1) {
        do { ni = Math.floor(Math.random() * len); } while (ni === prev);
      } else {
        ni = prev + 1;
        if (ni >= len) ni = repeat ? 0 : prev;
      }
      if (ni !== prev) {
        const audio = audioRef.current;
        if (audio && queue[ni]) {
          setBuffering(true);
          audio.src = queue[ni].audio_url;
          audio.load();
          audio.play().catch(() => setBuffering(false));
        }
      }
      return ni;
    });
  }, [queue, shuffle, repeat]);

  const nextRef = useRef(() => {});
  nextRef.current = next;

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onEnd = () => nextRef.current();
    const onPlay = () => { setIsPlaying(true); setBuffering(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onCanPlay = () => setBuffering(false);
    const onError = (e) => {
      setBuffering(false);
      console.error('Audio element error:', audio.error, 'src:', audio.src);
      toast({ title: 'Playback Error', description: `Could not load audio: ${audio.error?.message || 'Unknown error'}`, variant: 'destructive' });
      setIsPlaying(false);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

  const playTrack = useCallback((track, list) => {
    if (!isAuthenticated) { setShowAuthGate(true); return; }
    const q = list && list.length ? list : [track];
    const idx = q.findIndex((t) => t.id === track.id);
    const finalIdx = idx >= 0 ? idx : 0;
    setQueue(q);
    setCurrentIndex(finalIdx);
    const audio = audioRef.current;
    if (audio) {
      setBuffering(true);
      audio.src = q[finalIdx].audio_url;
      audio.load();
      audio.play().catch((e) => {
        console.error('playTrack audio.play() failed:', e, 'url:', q[finalIdx].audio_url);
        setBuffering(false);
        toast({ title: 'Playback Error', description: e?.message || 'Could not start playback', variant: 'destructive' });
      });
    }
    setHistory((prev) => {
      const filtered = prev.filter((tr) => tr.id !== track.id);
      const updated = [track, ...filtered].slice(0, 20);
      try { localStorage.setItem('musiqa-al-nour-history', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, [isAuthenticated]);

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
        setBuffering(true);
        audio.src = queue[finalIdx].audio_url;
        audio.load();
        audio.play().catch(() => setBuffering(false));
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
    try { localStorage.removeItem('musiqa-al-nour-history'); } catch {}
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack, queue, currentIndex, isPlaying, buffering, currentTime, duration, volume, history,
        showAuthGate, closeAuthGate: () => setShowAuthGate(false),
        playTrack, togglePlay, next, prev, seek, setVolume, clearHistory,
        shuffle, setShuffle, repeat, setRepeat,
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