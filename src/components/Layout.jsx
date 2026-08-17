import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import Logo from '@/components/Logo';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import AudioPlayer from '@/components/AudioPlayer';
import MiniPlayer from '@/components/MiniPlayer';
import AuthGateModal from '@/components/AuthGateModal';
import LanguageToggle from '@/components/LanguageToggle';
import UserMenu from '@/components/UserMenu';
import Footer from '@/components/Footer';
import { TrackInfoModalProvider } from '@/components/TrackInfoModalProvider';
import { NowPlayingProvider } from '@/components/NowPlayingProvider';
import { FollowProvider } from '@/lib/FollowContext';
import { usePlayer } from '@/lib/PlayerContext';

export default function Layout() {
  const { dir, t } = useLanguage();
  const { currentTrack, showAuthGate, closeAuthGate } = usePlayer();
  return (
    <TrackInfoModalProvider>
    <NowPlayingProvider>
    <FollowProvider>
    <div dir={dir} className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-36 md:pb-28">
          <Outlet />
          <Footer />
        </main>
      </div>

      <AudioPlayer />
      {currentTrack && <MiniPlayer />}
      <MobileNav />
      <AuthGateModal open={showAuthGate} onClose={closeAuthGate} />
    </div>
    </FollowProvider>
    </NowPlayingProvider>
    </TrackInfoModalProvider>
  );
}