import React from 'react';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { Link, useNavigate } from 'react-router-dom';

export default function AlbumCard({ album }) {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  return (
    <Link to={`/album-details?id=${album.id}`} className="group shrink-0 w-40 active:scale-95 transition-transform duration-100">
      <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-2">
        <Image src={album.cover_url} alt={localize(lang, album, 'title')} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      </div>
      <div className="text-sm font-semibold truncate">{localize(lang, album, 'title')}</div>
      <div
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/artist-profile?name=${encodeURIComponent(localize(lang, album, 'artist'))}`); }}
        className="text-xs text-muted-foreground truncate hover:text-foreground hover:underline cursor-pointer"
      >
        {localize(lang, album, 'artist')}
      </div>
    </Link>
  );
}