import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Library, User, TrendingUp, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', key: 'nav.home', icon: Home },
  { to: '/search', key: 'nav.search', icon: Search },
  { to: '/library', key: 'nav.library', icon: Library },
  { to: '/trending', key: 'nav.trending', icon: TrendingUp },
  { to: '/favorites', key: 'nav.favorites', icon: Heart },
  { to: '/profile', key: 'nav.profile', icon: User },
];

export default function MobileNav() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const handleTap = (e, to) => {
    if (pathname !== to) return;
    e.preventDefault();
    const sc = document.querySelector('main');
    if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 min-h-16 h-auto py-2 pb-[calc(env(safe-area-inset-bottom,16px)-8px)] bg-background/95 backdrop-blur border-t border-border flex md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
    >
      {items.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={(e) => handleTap(e, to)}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )
          }
        >
          <Icon className="w-5 h-5" />
          {t(key)}
        </NavLink>
      ))}
    </nav>
  );
}