import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Music } from 'lucide-react';

const links = [
  { to: '/terms', key: 'footer.terms' },
  { to: '/privacy', key: 'footer.privacy' },
  { to: '/dmca', key: 'footer.dmca' },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-card px-4 md:px-8 py-6 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center">
            <Music className="w-3 h-3" />
          </span>
          <span className="font-semibold text-foreground">{t('appName')}</span>
          <span className="hidden sm:inline">· {t('footer.rights')}</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors">
              {t(l.key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}