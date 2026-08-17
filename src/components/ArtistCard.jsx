import React from 'react';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { Link } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  const { lang, t } = useLanguage();
  return (
    <Link to="/search" className="group shrink-0 w-36 text-center">
      <div className="aspect-square rounded-full overflow-hidden bg-muted mb-2 mx-auto">
        <Image src={artist.image_url} alt={localize(lang, artist, 'name')} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      </div>
      <div className="text-sm font-semibold truncate">{localize(lang, artist, 'name')}</div>
      <div className="text-xs text-muted-foreground truncate">{t('common.listeners')}</div>
    </Link>
  );
}