import React from 'react';
import { useLanguage } from '@/lib/i18n';

export default function LegalPage({ title, updated, children }) {
  const { t } = useLanguage();
  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {updated && (
        <p className="text-sm text-muted-foreground mb-8">{t('legal.lastUpdated')}: {updated}</p>
      )}
      <div className="space-y-5 text-sm leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}