import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '@/lib/PlayerContext';
import { useLanguage, localize } from '@/lib/i18n';
import { Image } from '@/components/ui/image';
import { Link } from 'react-router-dom';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, next } = usePlayer();
  const { t, lang } = useLanguage();
  if (!currentTrack) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 md:hidden px-2">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/95 backdrop-blur shadow-lg p-2">
        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
          <Image src={currentTrack.cover_url} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{localize(lang, currentTrack, 'title')}</div>
          <div className="text-xs text-muted-foreground truncate">{localize(lang, currentTrack, 'artist')}</div>
        </div>
        <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center shrink-0" aria-label={isPlaying ? t('player.pause') : t('player.play')}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ms-0.5" />}
        </button>
      </div>
    </div>
  );
}