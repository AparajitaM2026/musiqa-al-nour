import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import AudioPlayer from '@/components/AudioPlayer';
import MiniPlayer from '@/components/MiniPlayer';
import LanguageToggle from '@/components/LanguageToggle';
import { usePlayer } from '@/lib/PlayerContext';

export default function Layout() {
  const { dir, t } = useLanguage();
  const { currentTrack } = usePlayer();
  return (
    <div dir={dir} className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center">
            <Music className="w-4 h-4" />
          </span>
          {t('appName')}
        </Link>
        <LanguageToggle />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-36 md:pb-28">
          <Outlet />
        </main>
      </div>

      <AudioPlayer />
      {currentTrack && <MiniPlayer />}
      <MobileNav />
    </div>
  );
}