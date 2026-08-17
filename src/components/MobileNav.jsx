import React from 'react';
import { NavLink } from 'react-router-dom';
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
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 h-16 bg-background/95 backdrop-blur border-t border-border flex md:hidden">
      {items.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
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