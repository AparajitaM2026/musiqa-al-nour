import React, { useEffect, useState, useCallback } from 'react';
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

  if (loading) {
    return (
      <div className="h-full grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={load}>
      <div className="px-4 md:px-8 py-6 space-y-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('library.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{playlists.length} {t('library.playlists')}</p>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t('library.empty')}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
            {playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} tracks={tracks} />
            ))}
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}