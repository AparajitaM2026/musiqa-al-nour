import React, { useEffect, useState, useCallback } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n';
import { Loader2, Flame } from 'lucide-react';
import TrackRow from '@/components/TrackRow';
import ArtistCard from '@/components/ArtistCard';

export default function Trending() {
  const { t } = useLanguage();
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [tr, ar] = await Promise.all([
        base44.entities.Track.list('-plays', 1000),
        base44.entities.Artist.list(),
      ]);
      setTracks([...tr].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 10));
      setArtists(
        [...ar].sort((a, b) => (b.monthly_listeners || 0) - (a.monthly_listeners || 0)).slice(0, 6)
      );
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
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Flame className="w-7 h-7 text-orange-500" /> {t('trending.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('trending.subtitle')}</p>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('trending.topTracks')}</h2>
        <div className="space-y-1">
          {tracks.map((tr, i) => (
            <TrackRow key={tr.id} track={tr} queue={tracks} index={i} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('trending.topArtists')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {artists.map((ar) => (
            <ArtistCard key={ar.id} artist={ar} />
          ))}
        </div>
      </section>
    </div>
    </PullToRefresh>
  );
}