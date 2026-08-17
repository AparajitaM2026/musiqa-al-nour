import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function LanguageToggle({ className }) {
  const { lang, setLang } = useLanguage();
  const isAr = lang === 'ar';
  return (
    <div className={cn('inline-flex items-center gap-0.5 rounded-full border border-border bg-muted p-0.5', className)}>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={cn(
          'px-3 py-1 text-xs font-semibold rounded-full transition-colors',
          !isAr ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={!isAr}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={cn(
          'px-3 py-1 text-xs font-semibold rounded-full transition-colors',
          isAr ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={isAr}
      >
        ع
      </button>
    </div>
  );
}