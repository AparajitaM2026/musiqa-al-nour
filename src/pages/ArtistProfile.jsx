import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage, localize } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';
import { Image } from '@/components/ui/image';
import { Loader2, Play, Music } from 'lucide-react';
import TrackRow from '@/components/TrackRow';
import AlbumCard from '@/components/AlbumCard';

export default function ArtistProfile() {
  const { t, lang } = useLanguage();
  const { playTrack } = usePlayer();
  const [params] = useSearchParams();
  const id = params.get('id');
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const [a, allTracks, allAlbums] = await Promise.all([
          base44.entities.Artist.get(id),
          base44.entities.Track.list(),
          base44.entities.Album.list(),
        ]);
        setArtist(a);
        setTracks(allTracks.filter((tr) => tr.artist === a.name || tr.artist === a.name_ar));
        setAlbums(allAlbums.filter((al) => al.artist === a.name || al.artist === a.name_ar));
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

  if (!artist) {
    return <div className="p-8 text-center text-muted-foreground">Artist not found.</div>;
  }

  const name = localize(lang, artist, 'name');

  return (
    <div className="px-4 md:px-8 py-6 space-y-10">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
        <div className="w-44 h-44 rounded-full overflow-hidden bg-muted shadow-lg shrink-0">
          {artist.image_url ? (
            <Image src={artist.image_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center bg-gradient-to-br from-primary/20 to-accent">
              <Music className="w-14 h-14 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-start">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t(`genre.${artist.genre}`)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
          <div className="text-sm text-muted-foreground">
            {(artist.monthly_listeners || 0).toLocaleString()} {t('common.listeners')}
          </div>
          {localize(lang, artist, 'bio') && (
            <p className="text-muted-foreground max-w-2xl mt-3">{localize(lang, artist, 'bio')}</p>
          )}
          <button
            onClick={playAll}
            disabled={!tracks.length}
            className="mt-4 inline-flex items-center gap-2 h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> {t('common.play')}
          </button>
        </div>
      </div>

      {tracks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t('home.popularTracks')}</h2>
          <div className="space-y-1">
            {tracks.map((tr, i) => (
              <TrackRow key={tr.id} track={tr} queue={tracks} index={i} />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t('home.albums')}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {albums.map((al) => (
              <AlbumCard key={al.id} album={al} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}