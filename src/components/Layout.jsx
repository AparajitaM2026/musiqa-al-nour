import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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

const ROOT_TABS = ['/', '/search', '/library', '/trending', '/favorites', '/profile'];

export default function Layout() {
  const { dir, t } = useLanguage();
  const { currentTrack, showAuthGate, closeAuthGate } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = !ROOT_TABS.includes(location.pathname);
  const navType = useNavigationType();
  const [direction, setDirection] = useState(1);
  useEffect(() => {
    setDirection(navType === 'POP' ? -1 : 1);
  }, [navType, location.pathname]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <TrackInfoModalProvider>
    <NowPlayingProvider>
    <FollowProvider>
    <div dir={dir} className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-4 md:px-6 pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-36 md:pb-28">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
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