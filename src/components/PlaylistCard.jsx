import React from 'react';
import { Play, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';

export default function PlaylistCard({ playlist, tracks }) {
  const { lang, t } = useLanguage();
  const { playTrack } = usePlayer();
  const genreTracks = tracks.filter((tr) => tr.genre === playlist.genre);

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (genreTracks.length) playTrack(genreTracks[0], genreTracks);
  };

  return (
    <Link
      to={`/playlist-details?genre=${playlist.genre}`}
      className="group relative shrink-0 block w-full max-w-[180px] rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors"
    >
      <div className="relative aspect-square">
        {playlist.cover_url ? (
          <Image src={playlist.cover_url} alt={localize(lang, playlist, 'title')} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center bg-gradient-to-br from-primary/20 to-accent">
            <Music className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <button
          onClick={handlePlay}
          className="absolute bottom-2 end-2 w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
          aria-label={t('common.play')}
        >
          <Play className="w-4 h-4 ms-0.5" />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-2.5">
        <div className="text-sm font-semibold truncate">{localize(lang, playlist, 'title')}</div>
        <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{localize(lang, playlist, 'description')}</div>
        <div className="mt-1.5 inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
          {t(`genre.${playlist.genre}`)}
        </div>
      </div>
    </Link>
  );
}