import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { useLanguage, localize } from '@/lib/i18n';
import { useToast } from '@/components/ui/use-toast';
import { Music, Share2, Plus } from 'lucide-react';

export default function TrackInfoModal({ track, onClose }) {
  const { t, lang } = useLanguage();
  const { toast } = useToast();

  if (!track) return null;

  const title = localize(lang, track, 'title');
  const artist = localize(lang, track, 'artist');
  const album = localize(lang, track, 'album');

  const share = async () => {
    const url = `${window.location.origin}/?track=${track.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `${title} — ${artist}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: t('trackinfo.linkCopied') });
      }
    } catch (e) {}
  };

  const addToPlaylist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('naghma-saved-tracks') || '[]');
      if (!saved.includes(track.id)) saved.push(track.id);
      localStorage.setItem('naghma-saved-tracks', JSON.stringify(saved));
    } catch (e) {}
    toast({ title: t('trackinfo.addedToPlaylist') });
  };

  const credits = [
    { label: t('trackinfo.composer'), value: track.composer },
    { label: t('trackinfo.lyricist'), value: track.lyricist },
    { label: t('trackinfo.label'), value: track.label },
    { label: t('trackinfo.maqam'), value: track.maqam_genre },
  ].filter((c) => c.value);

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('trackinfo.title')}</DialogTitle>
          <DialogDescription>{t('trackinfo.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="w-28 h-28 rounded-lg overflow-hidden bg-muted shrink-0">
            {track.cover_url ? (
              <Image src={track.cover_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center bg-muted">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold truncate">{title}</div>
            <div className="text-sm text-muted-foreground truncate">{artist}</div>
            {album && <div className="text-sm text-muted-foreground truncate">{album}</div>}
            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-2">
              {track.release_year && <span>{track.release_year}</span>}
              {track.genre && <span>{t(`genre.${track.genre}`)}</span>}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{t('trackinfo.format')}</div>
          </div>
        </div>

        {credits.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-sm font-semibold">{t('trackinfo.credits')}</div>
            {credits.map((c) => (
              <div key={c.label} className="flex justify-between text-sm gap-4">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-medium text-end">{c.value}</span>
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          <Button variant="outline" size="sm" onClick={addToPlaylist}>
            <Plus className="w-4 h-4 me-1" /> {t('trackinfo.addToPlaylist')}
          </Button>
          <Button variant="outline" size="sm" onClick={share}>
            <Share2 className="w-4 h-4 me-1" /> {t('trackinfo.share')}
          </Button>
          <Button size="sm" onClick={onClose}>{t('trackinfo.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}