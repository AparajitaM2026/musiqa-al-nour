import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer, formatTime } from '@/lib/PlayerContext';
import { useLanguage, localize } from '@/lib/i18n';
import { useTrackInfo } from '@/components/TrackInfoModalProvider';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/lib/useFavorites';
import { ChevronDown, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Music, Info, Heart } from 'lucide-react';

export default function NowPlaying({ onClose }) {
  const { t, lang, dir } = useLanguage();
  const {
    currentTrack, isPlaying, togglePlay, next, prev, currentTime, duration, seek,
    queue, currentIndex, shuffle, setShuffle, repeat, setRepeat, playTrack,
  } = usePlayer();
  const { openTrackInfo } = useTrackInfo();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = currentTrack ? isFavorite(currentTrack.id) : false;
  const [tab, setTab] = useState('lyrics');
  const sliderRef = useRef(null);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    if (dir === 'rtl') ratio = 1 - ratio;
    ratio = Math.min(Math.max(ratio, 0), 1);
    seek(ratio * duration);
  };

  if (!currentTrack) return null;

  const title = localize(lang, currentTrack, 'title');
  const artist = localize(lang, currentTrack, 'artist');
  const album = localize(lang, currentTrack, 'album');
  const upNext = queue.slice(currentIndex + 1).concat(queue.slice(0, currentIndex));

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-0 z-50 bg-background flex flex-col px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2" aria-label="minimize">
          <ChevronDown className="w-6 h-6" />
        </button>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{t('player.nowPlaying')}</div>
        <div className="flex items-center">
          <button onClick={() => toggleFavorite(currentTrack.id)} className={cn('p-2 transition-colors', isFav ? 'text-red-500' : 'text-muted-foreground hover:text-foreground')} aria-label={t('trackinfo.favorite')}>
            <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
          </button>
          <button onClick={() => openTrackInfo(currentTrack)} className="text-muted-foreground hover:text-foreground p-2" aria-label={t('trackinfo.info')}>
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
        <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-muted shadow-2xl">
          {currentTrack.cover_url ? (
            <Image src={currentTrack.cover_url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center bg-muted">
              <Music className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="text-center w-full max-w-sm">
          <div className="text-xl font-bold truncate">{title}</div>
          <div className="text-sm text-muted-foreground truncate">{artist}</div>
          {album && <div className="text-xs text-muted-foreground truncate">{album}</div>}
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <div ref={sliderRef} onClick={handleSeek} className="flex-1 h-1.5 rounded-full bg-muted cursor-pointer relative">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <button onClick={() => setShuffle(!shuffle)} className={cn('p-2 transition-colors', shuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground')} aria-label="shuffle">
            <Shuffle className="w-5 h-5" />
          </button>
          <button onClick={prev} className="text-foreground hover:text-muted-foreground transition-colors" aria-label={t('player.previous')}>
            <SkipBack className="w-7 h-7" />
          </button>
          <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-primary text-primary-foreground grid place-items-center hover:scale-105 transition-transform" aria-label={isPlaying ? t('player.pause') : t('player.play')}>
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ms-0.5" />}
          </button>
          <button onClick={next} className="text-foreground hover:text-muted-foreground transition-colors" aria-label={t('player.next')}>
            <SkipForward className="w-7 h-7" />
          </button>
          <button onClick={() => setRepeat(!repeat)} className={cn('p-2 transition-colors', repeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground')} aria-label="repeat">
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6 mb-2">
          <button onClick={() => setTab('lyrics')} className={cn('px-4 py-1.5 rounded-full text-sm transition-colors', tab === 'lyrics' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>{t('nowplaying.lyrics')}</button>
          <button onClick={() => setTab('queue')} className={cn('px-4 py-1.5 rounded-full text-sm transition-colors', tab === 'queue' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>{t('nowplaying.upNext')}</button>
        </div>
        <div className="max-h-32 overflow-y-auto">
          {tab === 'lyrics' ? (
            <p className="text-center text-sm text-muted-foreground py-4">{t('nowplaying.noLyrics')}</p>
          ) : upNext.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">{t('player.queueEmpty')}</p>
          ) : (
            <div className="space-y-1">
              {upNext.map((tr) => (
                <div key={tr.id} onClick={() => playTrack(tr, queue)} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <div className="w-8 h-8 rounded overflow-hidden bg-muted shrink-0">
                    <Image src={tr.cover_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{localize(lang, tr, 'title')}</div>
                    <div className="text-xs text-muted-foreground truncate">{localize(lang, tr, 'artist')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}