import React from 'react';
import { useLanguage, localize } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function GenreChips({ value, onChange, playlists = [] }) {
  const { t, lang } = useLanguage();
  const genreMap = {};
  for (const p of playlists) {
    if (p.genre && !genreMap[p.genre]) genreMap[p.genre] = p;
  }
  const chips = ['all', ...Object.keys(genreMap)];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
      {chips.map((g) => {
        const active = value === g;
        const label = g === 'all' ? t('search.all') : localize(lang, genreMap[g], 'title') || g;
        return (
          <button
            key={g}
            onClick={() => onChange(g)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors',
              active
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-transparent text-foreground border-border hover:bg-accent'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}