import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n';
import { useFollows } from '@/lib/FollowContext';
import TrackCard from '@/components/TrackCard';
import AlbumCard from '@/components/AlbumCard';
import ArtistCard from '@/components/ArtistCard';
import PlaylistCard from '@/components/PlaylistCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { t, lang } = useLanguage();
  const { follows } = useFollows();
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [tr, ar, al, pl] = await Promise.all([
          base44.entities.Track.list('-plays', 20),
          base44.entities.Artist.list('-monthly_listeners', 10),
          base44.entities.Album.list(),
          base44.entities.Playlist.list(),
        ]);
        setTracks(tr);
        setArtists(ar);
        setAlbums(al);
        setPlaylists(pl);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="h-full grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const followedTracks = tracks.filter((tr) => follows.includes(tr.artist));

  return (
    <div className="px-4 md:px-8 py-6 space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{t('home.welcome')}</h1>
        <p className="text-muted-foreground mt-1">{t('tagline')}</p>
      </div>

      {follows.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t('home.following')}</h2>
          {followedTracks.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {followedTracks.map((tr) => (
                <TrackCard key={tr.id} track={tr} queue={followedTracks} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('home.followingEmpty')}</p>
          )}
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">{t('home.popularTracks')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {tracks.map((tr) => (
            <TrackCard key={tr.id} track={tr} queue={tracks} />
          ))}
        </div>
      </section>

      {artists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t('home.topArtists')}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {artists.map((ar) => (
              <ArtistCard key={ar.id} artist={ar} />
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

      {playlists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t('home.featuredPlaylists')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} tracks={tracks} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}