import React from 'react';
import { Play } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';

export default function HeroBanner({ item, tracks }) {
  const { lang, t } = useLanguage();
  const { playTrack } = usePlayer();
  if (!item) return null;

  const queue = tracks.filter((tr) => tr.genre === item.genre);
  const handlePlay = () => {
    if (queue.length) playTrack(queue[0], queue);
  };
  const subtitle = localize(lang, item, 'description') || (item.genre ? t(`genre.${item.genre}`) : '');

  return (
    <div className="relative rounded-2xl overflow-hidden h-60 md:h-80">
      <Image
        src={item.cover_url}
        alt={localize(lang, item, 'title')}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
          {t('home.spotlight')}
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white max-w-2xl drop-shadow-lg">
          {localize(lang, item, 'title')}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-white/80 mt-2 max-w-xl line-clamp-2">{subtitle}</p>
        )}
        <button
          onClick={handlePlay}
          className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          {t('home.playNow')}
        </button>
      </div>
    </div>
  );
}