import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import { base44 } from '@/api/base44Client';
import { useLanguage, localize } from '@/lib/i18n';
import { Loader2, Search } from 'lucide-react';
import PlaylistCard from '@/components/PlaylistCard';

export default function Library() {
  const { t, lang } = useLanguage();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter((pl) => {
      const title = String(localize(lang, pl, 'title') || '').toLowerCase();
      const desc = String(pl.description || pl.description_ar || '').toLowerCase();
      const genre = String(pl.genre || '').toLowerCase();
      return title.includes(q) || desc.includes(q) || genre.includes(q);
    });
  }, [query, playlists, lang]);

  const load = useCallback(async () => {
    try {
      const [tr, pl] = await Promise.all([
        base44.entities.Track.list('-plays', 1000),
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

        <div className="relative w-full max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('library.search_placeholder') || 'Search playlists'}
            className="w-full h-11 ps-9 pe-3 rounded-full bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t('library.empty')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t('library.no_results') || 'No playlists found'}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
            {filtered.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} tracks={tracks} />
            ))}
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}