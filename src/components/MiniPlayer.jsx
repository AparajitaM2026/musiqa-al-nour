import React from 'react';
import { Play, Pause, Info } from 'lucide-react';
import { usePlayer } from '@/lib/PlayerContext';
import { useLanguage, localize } from '@/lib/i18n';
import { useTrackInfo } from '@/components/TrackInfoModalProvider';
import { useNowPlaying } from '@/components/NowPlayingProvider';
import { Image } from '@/components/ui/image';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();
  const { t, lang } = useLanguage();
  const { openTrackInfo } = useTrackInfo();
  const { openNowPlaying } = useNowPlaying();
  if (!currentTrack) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] z-40 md:hidden px-2">
      <div onClick={() => openNowPlaying()} className="flex items-center gap-3 rounded-xl border border-border bg-background/95 backdrop-blur shadow-lg p-2 cursor-pointer">
        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
          <Image src={currentTrack.cover_url} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{localize(lang, currentTrack, 'title')}</div>
          <div className="text-xs text-muted-foreground truncate">{localize(lang, currentTrack, 'artist')}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); openTrackInfo(currentTrack); }} className="text-muted-foreground hover:text-foreground shrink-0" aria-label={t('trackinfo.info')}>
          <Info className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center shrink-0" aria-label={isPlaying ? t('player.pause') : t('player.play')}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ms-0.5" />}
        </button>
      </div>
    </div>
  );
}