import React, { useEffect, useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage, localize } from '@/lib/i18n';
import { Loader2, Music } from 'lucide-react';
import PlaylistCard from '@/components/PlaylistCard';
import { cn } from '@/lib/utils';

export default function Library() {
  const { t, lang } = useLanguage();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = useMemo(
    () => [...new Set(playlists.map((p) => p.genre).filter(Boolean))],
    [playlists]
  );

  useEffect(() => {
    (async () => {
      try {
        const [tr, pl] = await Promise.all([
          base44.entities.Track.list(),
          base44.entities.Playlist.list(),
        ]);
        setTracks(tr);
        setPlaylists(pl);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="h-full grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 space-y-8">
      <h1 className="text-2xl font-bold">{t('library.title')}</h1>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('library.byGenre')}</h2>
        {genres.map((g) => {
          const genrePlaylists = playlists.filter((p) => p.genre === g);
          if (!genrePlaylists.length) return null;
          return (
            <div key={g} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-primary text-primary-foreground">
                  {t(`genre.${g}`)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {genrePlaylists.map((pl) => (
                  <PlaylistCard key={pl.id} playlist={pl} tracks={tracks} />
                ))}
              </div>
            </div>
          );
        })}
        {playlists.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">{t('library.empty')}</div>
        )}
      </section>
    </div>
  );
}