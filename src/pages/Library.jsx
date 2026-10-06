import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n';
import { Loader2 } from 'lucide-react';
import PlaylistCard from '@/components/PlaylistCard';

export default function Library() {
  const { t } = useLanguage();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const genres = useMemo(
    () => [...new Set(playlists.map((p) => String(p.genre || '').trim()).filter(Boolean))].sort(),
    [playlists]
  );

  if (loading) {
    return (
      <div className="h-full grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={load}>
      <div className="px-4 md:px-8 py-6 space-y-8">
        <h1 className="text-2xl font-bold">{t('library.title')}</h1>
        {genres.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t('library.empty')}</div>
        ) : (
          genres.map((g) => {
            const genrePlaylists = playlists.filter((p) => String(p.genre || '').trim() === g);
            return (
              <section key={g}>
                <h2 className="text-xl font-bold mb-4">{g}</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {genrePlaylists.map((pl) => (
                    <PlaylistCard key={pl.id} playlist={pl} tracks={tracks} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </PullToRefresh>
  );
}