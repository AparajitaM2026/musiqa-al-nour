import React, { useEffect, useState, useCallback } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';
import TrackRow from '@/components/TrackRow';
import { Loader2, Play, Heart } from 'lucide-react';

export default function Favorites() {
  const { t } = useLanguage();
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const saved = JSON.parse(localStorage.getItem('musiqa-al-nour-saved-tracks') || '[]');
      const all = await base44.entities.Track.list('-plays', 1000);
      setTracks(all.filter((tr) => saved.includes(tr.id)));
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
    <div className="px-4 md:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('favorites.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('favorites.subtitle')}</p>
        </div>
        {tracks.length > 0 && (
          <button
            onClick={() => playTrack(tracks[0], tracks)}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium"
          >
            <Play className="w-4 h-4" /> {t('common.play')}
          </button>
        )}
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t('favorites.empty')}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {tracks.map((tr, i) => (
            <TrackRow key={tr.id} track={tr} queue={tracks} index={i} />
          ))}
        </div>
      )}
    </div>
    </PullToRefresh>
  );
}