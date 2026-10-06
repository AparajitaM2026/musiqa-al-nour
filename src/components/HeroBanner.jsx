import React, { useState, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';
import { cn } from '@/lib/utils';

const SLIDE_INTERVAL = 5000;

export default function HeroBanner({ items, tracks }) {
  const { lang, t } = useLanguage();
  const { playTrack } = usePlayer();
  const [index, setIndex] = useState(0);

  const slides = (items || []).filter(Boolean);
  const current = slides[index];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!current) return null;

  const queue = current.track_ids && current.track_ids.length
    ? current.track_ids.map((id) => tracks.find((tr) => tr.id === id)).filter(Boolean)
    : tracks.filter((tr) => {
        const genres = String(tr.genre || '').split(',').map((s) => s.trim());
        return genres.includes(current.genre);
      });
  const handlePlay = () => {
    if (queue.length) playTrack(queue[0], queue);
  };
  const genreKey = current.genre ? `genre.${current.genre}` : '';
  const genreTranslated = genreKey ? t(genreKey) : '';
  const genreDisplay = genreTranslated && genreTranslated !== genreKey ? genreTranslated : (current.genre || '');
  const subtitle = localize(lang, current, 'description') || genreDisplay;

  return (
    <div className="relative rounded-2xl overflow-hidden h-60 md:h-80">
      {slides.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          <Image
            src={item.cover_url}
            alt={localize(lang, item, 'title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        </div>
      ))}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
          {t('home.spotlight')}
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white max-w-2xl drop-shadow-lg">
          {localize(lang, current, 'title')}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-white/80 mt-2 max-w-xl line-clamp-2">{subtitle}</p>
        )}
        <button
          onClick={handlePlay}
          className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          {t('home.playNow')}
        </button>
        {slides.length > 1 && (
          <div className="absolute bottom-4 end-6 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}