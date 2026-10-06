import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import { base44 } from '@/api/base44Client';
import { useLanguage, localize } from '@/lib/i18n';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import TrackRow from '@/components/TrackRow';
import ArtistCard from '@/components/ArtistCard';
import AlbumCard from '@/components/AlbumCard';
import PlaylistCard from '@/components/PlaylistCard';

const TABS = ['all', 'tracks', 'artists', 'albums', 'playlists'];

const matches = (q, obj, keys) => {
  const query = q.toLowerCase().trim();
  if (!query) return true;
  return keys.some((k) => {
    const v = obj[k];
    return v && String(v).toLowerCase().includes(query);
  });
};

export default function Search() {
  const { t, lang } = useLanguage();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [tr, ar, al, pl] = await Promise.all([
        base44.entities.Track.list('-plays', 1000),
        base44.entities.Artist.list(),
        base44.entities.Album.list(),
        base44.entities.Playlist.list(),
      ]);
      setTracks(tr);
      setArtists(ar);
      setAlbums(al);
      setPlaylists(pl);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fTracks = useMemo(
    () => tracks.filter((o) => matches(q, o, ['title', 'title_ar', 'artist', 'artist_ar'])),
    [q, tracks]
  );
  const fArtists = useMemo(
    () => artists.filter((o) => matches(q, o, ['name', 'name_ar'])),
    [q, artists]
  );
  const fAlbums = useMemo(
    () => albums.filter((o) => matches(q, o, ['title', 'title_ar', 'artist', 'artist_ar'])),
    [q, albums]
  );
  const fPlaylists = useMemo(
    () => playlists.filter((o) => matches(q, o, ['title', 'title_ar', 'description', 'description_ar'])),
    [q, playlists]
  );

  const hasResults = fTracks.length || fArtists.length || fAlbums.length || fPlaylists.length;

  return (
    <PullToRefresh onRefresh={load}>
    <div className="px-4 md:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('search.title')}</h1>
      <div className="relative max-w-xl">
        <SearchIcon className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('search.placeholder')}
          className="ps-10 h-12"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              tab === tb ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {t(`search.${tb}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !hasResults ? (
        <div className="text-center py-20 text-muted-foreground">{t('search.noResults')}</div>
      ) : (
        <div className="space-y-8">
          {(tab === 'all' || tab === 'tracks') && fTracks.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">{t('search.tracks')}</h2>
              <div className="space-y-1">
                {fTracks.slice(0, tab === 'all' ? 6 : undefined).map((tr, i) => (
                  <TrackRow key={tr.id} track={tr} queue={fTracks} index={i} />
                ))}
              </div>
            </section>
          )}
          {(tab === 'all' || tab === 'artists') && fArtists.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">{t('search.artists')}</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {fArtists.map((ar) => (
                  <ArtistCard key={ar.id} artist={ar} />
                ))}
              </div>
            </section>
          )}
          {(tab === 'all' || tab === 'albums') && fAlbums.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">{t('search.albums')}</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {fAlbums.map((al) => (
                  <AlbumCard key={al.id} album={al} />
                ))}
              </div>
            </section>
          )}
          {(tab === 'all' || tab === 'playlists') && fPlaylists.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">{t('search.playlists')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fPlaylists.map((pl) => (
                  <PlaylistCard key={pl.id} playlist={pl} tracks={tracks} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
    </PullToRefresh>
  );
}