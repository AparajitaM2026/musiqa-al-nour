import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage, localize } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Music } from 'lucide-react';
import TrackRow from '@/components/TrackRow';

export default function PlaylistDetails() {
  const { t, lang } = useLanguage();
  const { playTrack } = usePlayer();
  const [params] = useSearchParams();
  const genre = params.get('genre') || 'other';
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [allTracks, playlists] = await Promise.all([
          base44.entities.Track.list(),
          base44.entities.Playlist.list(),
        ]);
        setTracks(allTracks.filter((tr) => tr.genre === genre));
        setPlaylist(playlists.find((p) => p.genre === genre));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [genre]);

  const playAll = () => {
    if (tracks.length) playTrack(tracks[0], tracks);
  };

  if (loading) {
    return (
      <div className="h-full grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const title = playlist ? localize(lang, playlist, 'title') : t(`genre.${genre}`);

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
        <div className="w-44 h-44 rounded-2xl overflow-hidden bg-muted shadow-lg shrink-0">
          {playlist?.cover_url ? (
            <Image src={playlist.cover_url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center bg-gradient-to-br from-primary/20 to-accent">
              <Music className="w-14 h-14 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-start">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t('home.featuredPlaylists')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          {playlist && <p className="text-muted-foreground max-w-xl">{localize(lang, playlist, 'description')}</p>}
          <div className="mt-2 text-sm text-muted-foreground">{tracks.length} {t('common.tracks')}</div>
          <Button onClick={playAll} className="mt-4" size="lg" disabled={!tracks.length}>
            <Play className="w-4 h-4 me-2" /> {t('common.play')}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {tracks.map((tr, i) => (
          <TrackRow key={tr.id} track={tr} queue={tracks} index={i} />
        ))}
      </div>
    </div>
  );
}