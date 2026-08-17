import React from 'react';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { Link } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  const { lang, t } = useLanguage();
  return (
    <Link to={`/artist-profile?id=${artist.id}`} className="group shrink-0 w-36 text-center">
      <div className="aspect-square rounded-full overflow-hidden bg-muted mb-2 mx-auto">
        <Image
          src={artist.image_url}
          alt={localize(lang, artist, 'name')}
          className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
        />
      </div>
      <div className="text-sm font-semibold truncate">{localize(lang, artist, 'name')}</div>
      {artist.monthly_listeners ? (
        <div className="text-xs text-muted-foreground truncate">
          {Number(artist.monthly_listeners).toLocaleString()} {t('common.listeners')}
        </div>
      ) : null}
    </Link>
  );
}