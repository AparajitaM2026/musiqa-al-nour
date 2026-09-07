import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { User, History, Settings, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
          {t('header.signin')}
        </Button>
        <Button size="sm" onClick={() => navigate('/register')}>
          {t('header.signup')}
        </Button>
      </div>
    );
  }

  const initial = (user?.full_name || user?.email || '?').charAt(0).toUpperCase();
  const isAdmin = user?.role === 'admin';

  const trigger = (
    <button className="flex items-center gap-2 rounded-full border border-border bg-background hover:bg-muted transition-colors ps-1 pe-2 py-1">
      <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
        {initial}
      </span>
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    </button>
  );

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="sr-only">{t('menu.myAccount')}</DrawerTitle>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold">
                {initial}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{user?.full_name || t('profile.member')}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            </div>
          </DrawerHeader>
          <div className="flex flex-col gap-1 p-4 pt-0">
            <button onClick={() => go('/profile')} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-accent transition-colors">
              <User className="w-4 h-4" /> {t('menu.myAccount')}
            </button>
            <button onClick={() => go('/history')} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-accent transition-colors">
              <History className="w-4 h-4" /> {t('menu.history')}
            </button>
            <button onClick={() => go('/account-settings')} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-accent transition-colors">
              <Settings className="w-4 h-4" /> {t('menu.accountSettings')}
            </button>
            {isAdmin && (
              <button onClick={() => go('/admin')} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-accent transition-colors">
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            )}
            <div className="h-px bg-border my-1" />
            <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-destructive hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4" /> {t('menu.logout')}
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold">
              {initial}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{user?.full_name || t('profile.member')}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="w-4 h-4" />
          {t('menu.myAccount')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/history')}>
          <History className="w-4 h-4" />
          {t('menu.history')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/account-settings')}>
          <Settings className="w-4 h-4" />
          {t('menu.accountSettings')}
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')}>
            <ShieldCheck className="w-4 h-4" />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" />
          {t('menu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}