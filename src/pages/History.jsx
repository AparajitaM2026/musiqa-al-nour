import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { usePlayer } from '@/lib/PlayerContext';
import { History as HistoryIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackRow from '@/components/TrackRow';

export default function History() {
  const { t } = useLanguage();
  const { history, clearHistory } = usePlayer();

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HistoryIcon className="w-6 h-6" /> {t('profile.listeningHistory')}
        </h1>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground">
            <Trash2 className="w-4 h-4 me-2" />
            {t('history.clear')}
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('profile.noHistory')}</p>
      ) : (
        <div className="space-y-1">
          {history.map((tr, i) => (
            <TrackRow key={tr.id} track={tr} queue={history} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}