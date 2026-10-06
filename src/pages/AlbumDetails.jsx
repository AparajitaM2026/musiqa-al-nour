import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage, localize } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Music, CalendarDays } from 'lucide-react';
import TrackRow from '@/components/TrackRow';

export default function AlbumDetails() {
  const { t, lang } = useLanguage();
  const { playTrack } = usePlayer();
  const [params] = useSearchParams();
  const id = params.get('id');
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const [a, allTracks] = await Promise.all([
          base44.entities.Album.get(id),
          base44.entities.Track.list('-plays', 1000),
        ]);
        setAlbum(a);
        setTracks(
          allTracks.filter((tr) => tr.album === a.title || tr.album === a.title_ar)
        );
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  if (!album) {
    return <div className="p-8 text-center text-muted-foreground">Album not found.</div>;
  }

  const title = localize(lang, album, 'title');

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
        <div className="w-44 h-44 rounded-2xl overflow-hidden bg-muted shadow-lg shrink-0">
          {album.cover_url ? (
            <Image src={album.cover_url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center bg-gradient-to-br from-primary/20 to-accent">
              <Music className="w-14 h-14 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-start">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t('home.albums')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <div className="text-muted-foreground flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <span>{localize(lang, album, 'artist')}</span>
            {album.release_year && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" /> {album.release_year}
              </span>
            )}
            <span>{tracks.length} {t('common.tracks')}</span>
          </div>
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