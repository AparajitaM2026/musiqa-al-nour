import React from 'react';
import { Play, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';
import { cn } from '@/lib/utils';

export default function PlaylistCard({ playlist, tracks, className }) {
  const { lang, t } = useLanguage();
  const { playTrack } = usePlayer();
  const genreTracks = tracks.filter((tr) => {
    const genres = String(tr.genre || '').split(',').map((s) => s.trim());
    return genres.includes(playlist.genre);
  });

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (genreTracks.length) playTrack(genreTracks[0], genreTracks);
  };

  return (
    <Link
      to={`/playlist-details?id=${playlist.id}`}
      className={cn("group relative block w-full rounded-xl p-3 transition-colors duration-200 hover:bg-accent/60", className)}
    >
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden shadow-md bg-muted">
        {playlist.cover_url ? (
          <Image src={playlist.cover_url} alt={localize(lang, playlist, 'title')} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center bg-gradient-to-br from-primary/15 via-accent to-muted">
            <Music className="w-12 h-12 text-muted-foreground/70" />
          </div>
        )}
        <button
          onClick={handlePlay}
          className="absolute bottom-2 end-2 w-12 h-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
          aria-label={t('common.play')}
        >
          <Play className="w-5 h-5 ms-0.5" />
        </button>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-semibold truncate leading-tight">{localize(lang, playlist, 'title')}</div>
        <div className="text-xs text-muted-foreground truncate">
          {genreTracks.length} {t('common.tracks')}
        </div>
      </div>
    </Link>
  );
}