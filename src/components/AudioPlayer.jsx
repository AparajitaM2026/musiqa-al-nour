import React, { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Info, Loader2 } from 'lucide-react';
import { usePlayer, formatTime } from '@/lib/PlayerContext';
import { useLanguage, localize } from '@/lib/i18n';
import { useTrackInfo } from '@/components/TrackInfoModalProvider';
import { useNowPlaying } from '@/components/NowPlayingProvider';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, buffering, togglePlay, next, prev, currentTime, duration, seek, volume, setVolume } = usePlayer();
  const { t, lang } = useLanguage();
  const { openTrackInfo } = useTrackInfo();
  const { openNowPlaying } = useNowPlaying();
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const sliderRef = useRef(null);

  const handleSeek = (e) => {
    e.stopPropagation();
    const rect = sliderRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    seek(ratio * duration);
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 hidden h-20 border-t border-border bg-background/95 backdrop-blur md:flex items-center justify-center text-sm text-muted-foreground">
        {t('player.queueEmpty')}
      </div>
    );
  }

  return (
    <div onClick={() => openNowPlaying()} className="fixed bottom-0 inset-x-0 z-40 hidden h-20 border-t border-border bg-background/95 backdrop-blur md:flex items-center gap-4 px-6 cursor-pointer">
      <div className="flex items-center gap-3 w-64 min-w-0">
        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
          <Image src={currentTrack.cover_url} alt={localize(lang, currentTrack, 'title')} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{localize(lang, currentTrack, 'title')}</div>
          <div className="text-xs text-muted-foreground truncate">{localize(lang, currentTrack, 'artist')}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1.5 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="text-muted-foreground hover:text-foreground transition-colors" aria-label={t('player.previous')}>
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center hover:scale-105 transition-transform"
            aria-label={isPlaying ? t('player.pause') : t('player.play')}
          >
            {buffering ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ms-0.5" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="text-muted-foreground hover:text-foreground transition-colors" aria-label={t('player.next')}>
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <div
            ref={sliderRef}
            onClick={handleSeek}
            className="flex-1 h-1.5 rounded-full bg-muted cursor-pointer group relative"
          >
            <div className={cn('h-full rounded-full bg-primary group-hover:bg-primary/90')} style={{ width: `${progress}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-64 flex items-center justify-end gap-2">
        <button onClick={(e) => { e.stopPropagation(); openTrackInfo(currentTrack); }} className="text-muted-foreground hover:text-foreground" aria-label={t('trackinfo.info')}>
          <Info className="w-5 h-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setVolume(volume > 0 ? 0 : 0.8); }} className="text-muted-foreground hover:text-foreground" aria-label="mute">
          {volume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          onClick={(e) => e.stopPropagation()}
          className="w-24 accent-primary"
          aria-label="volume"
        />
      </div>
    </div>
  );
}