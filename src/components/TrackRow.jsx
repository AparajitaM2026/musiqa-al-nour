import React from 'react';
import { Play, Pause, Info } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { usePlayer, formatTime } from '@/lib/PlayerContext';
import { useLanguage, localize } from '@/lib/i18n';
import { useTrackInfo } from '@/components/TrackInfoModalProvider';

export default function TrackRow({ track, queue, index }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { lang, t } = useLanguage();
  const { openTrackInfo } = useTrackInfo();
  const isCurrent = currentTrack?.id === track.id;
  const showPause = isCurrent && isPlaying;

  return (
    <div
      onClick={() => (isCurrent ? togglePlay() : playTrack(track, queue))}
      className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/60 cursor-pointer transition-colors"
    >
      <div className="w-6 text-center text-sm text-muted-foreground tabular-nums">
        <span className="group-hover:hidden">{index + 1}</span>
        {showPause ? (
          <Pause className="w-4 h-4 mx-auto text-primary" />
        ) : (
          <Play className="w-4 h-4 mx-auto hidden group-hover:block text-primary" />
        )}
      </div>
      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
        <Image src={track.cover_url} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate ${isCurrent ? 'text-primary' : ''}`}>{localize(lang, track, 'title')}</div>
        <div className="text-xs text-muted-foreground truncate">{localize(lang, track, 'artist')}</div>
      </div>
      <div className="text-xs text-muted-foreground tabular-nums hidden sm:block">{formatTime(track.duration)}</div>
      <button
        onClick={(e) => { e.stopPropagation(); openTrackInfo(track); }}
        className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1"
        aria-label={t('trackinfo.info')}
      >
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
}