import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { usePlayer } from '@/lib/PlayerContext';
import { useLanguage, localize } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function TrackCard({ track, queue, size = 'md' }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { lang, t } = useLanguage();
  const isCurrent = currentTrack?.id === track.id;
  const showPause = isCurrent && isPlaying;

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else playTrack(track, queue);
  };

  const dims = size === 'lg' ? 'w-44' : 'w-36';

  return (
    <div className={cn('group shrink-0', dims)}>
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-2">
        <Image src={track.cover_url} alt={localize(lang, track, 'title')} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 end-2 w-11 h-11 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
          aria-label={showPause ? t('player.pause') : t('player.play')}
        >
          {showPause ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ms-0.5" />}
        </button>
      </div>
      <div className={cn('text-sm font-semibold truncate', isCurrent && 'text-primary')}>{localize(lang, track, 'title')}</div>
      <div className="text-xs text-muted-foreground truncate">{localize(lang, track, 'artist')}</div>
    </div>
  );
}