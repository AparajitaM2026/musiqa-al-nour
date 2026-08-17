import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const CHIPS = [
  'all',
  'islamic_spiritual',
  'khaleeji',
  'kurdish',
  'patriotic',
  'romantic',
  'yemeni',
  'djibout',
  'somali',
];

export default function GenreChips({ value, onChange }) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {CHIPS.map((g) => {
        const active = value === g;
        const label = g === 'all' ? t('search.all') : t(`genre.${g}`);
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