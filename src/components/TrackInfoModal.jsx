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
  const artist = localize(lang, track, 'artist') || 'N/A';
  const album = localize(lang, track, 'album');
  const genre = track.genre ? t(`genre.${track.genre}`) : 'N/A';

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

  const renderRow = (label, value) => (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-end truncate">{value}</span>
    </div>
  );

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold leading-tight">{title}</DialogTitle>
          <DialogDescription>{t('trackinfo.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
            {track.cover_url ? (
              <Image src={track.cover_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center bg-muted">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            {renderRow(t('trackinfo.singer'), artist)}
            {renderRow(t('trackinfo.composer'), track.composer || 'N/A')}
            {renderRow(t('trackinfo.lyricist'), track.lyricist || 'N/A')}
          </div>
        </div>

        <div className="space-y-2">
          {renderRow(t('trackinfo.album'), album || 'N/A')}
          {renderRow(t('trackinfo.genre'), genre)}
        </div>

        <div className="border-t border-border" />

        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted-foreground">{t('trackinfo.audioSpecs')}</span>
          <span className="font-medium text-end">{t('trackinfo.format')}</span>
        </div>

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