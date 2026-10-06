import React, { useEffect, useState, useCallback } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import { base44 } from '@/api/base44Client';
import { useLanguage, localize } from '@/lib/i18n';
import { Loader2 } from 'lucide-react';
import TrackCard from '@/components/TrackCard';

export default function Library() {
  const { t, lang } = useLanguage();
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

  const tracksForPlaylist = (pl) => {
    const byIds = Array.isArray(pl.track_ids) && pl.track_ids.length
      ? tracks.filter((t) => pl.track_ids.includes(t.id))
      : [];
    if (byIds.length) return byIds;
    const name = String(localize(lang, pl, 'title') || '').trim().toLowerCase();
    if (!name) return [];
    return tracks.filter((t) => {
      const list = String(t.playlist || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      return list.includes(name);
    });
  };

  const sections = playlists
    .map((pl) => ({ pl, plTracks: tracksForPlaylist(pl) }))
    .filter((s) => s.plTracks.length > 0);

  return (
    <PullToRefresh onRefresh={load}>
    <div className="px-4 md:px-8 py-6 space-y-8">
      <h1 className="text-2xl font-bold">{t('library.title')}</h1>
      {sections.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">{t('library.empty')}</div>
      ) : (
        sections.map(({ pl, plTracks }) => (
          <section key={pl.id}>
            <h2 className="text-xl font-bold mb-4">{localize(lang, pl, 'title')}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {plTracks.map((tr) => (
                <TrackCard key={tr.id} track={tr} queue={plTracks} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
    </PullToRefresh>
  );
}