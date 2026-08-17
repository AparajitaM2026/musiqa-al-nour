import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', key: 'nav.home', icon: Home },
  { to: '/search', key: 'nav.search', icon: Search },
  { to: '/library', key: 'nav.library', icon: Library },
];

export default function Sidebar() {
  const { t } = useLanguage();
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-1 p-4 border-e border-border bg-sidebar/40">
      <div className="px-3 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('nav.home')}
      </div>
      {items.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
            )
          }
        >
          <Icon className="w-5 h-5" />
          {t(key)}
        </NavLink>
      ))}
      <div className="mt-6 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('library.playlists')}
      </div>
      <NavLink
        to="/library"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60"
      >
        <Heart className="w-5 h-5" />
        {t('library.byGenre')}
      </NavLink>
    </aside>
  );
}