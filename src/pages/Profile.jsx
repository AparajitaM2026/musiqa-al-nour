import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, LogOut, History, Settings, Trash2 } from 'lucide-react';
import { usePlayer } from '@/lib/PlayerContext';
import TrackRow from '@/components/TrackRow';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export default function Profile() {
  const { t, lang } = useLanguage();
  const { user, logout } = useAuth();
  const { history } = usePlayer();
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem('musiqa-al-nour-autoplay') !== '0');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('musiqa-al-nour-notifications') !== '0');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const toggleAutoplay = (v) => { setAutoplay(v); localStorage.setItem('musiqa-al-nour-autoplay', v ? '1' : '0'); };
  const toggleNotifications = (v) => { setNotifications(v); localStorage.setItem('musiqa-al-nour-notifications', v ? '1' : '0'); };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await base44.entities.User.delete(user.id);
      base44.auth.logout();
      window.location.href = '/login';
    } catch (e) {
      setDeleteError(t('profile.deleteError'));
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const created = user?.created_date
    ? new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(user.created_date))
    : '—';

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t('profile.title')}</h1>

      <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground grid place-items-center text-xl font-bold">
          {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-lg font-bold truncate">{user?.full_name || user?.email}</div>
          <div className="text-sm text-muted-foreground truncate">{user?.email}</div>
          <div className="text-xs text-muted-foreground mt-1">{t('profile.createdDate')}: {created}</div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><History className="w-5 h-5" /> {t('profile.listeningHistory')}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('profile.noHistory')}</p>
        ) : (
          <div className="space-y-1">
            {history.map((tr, i) => (
              <TrackRow key={tr.id} track={tr} queue={history} index={i} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5" /> {t('profile.savedSettings')}</h2>
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t('profile.language')}</div>
              <div className="text-xs text-muted-foreground">{lang === 'ar' ? 'العربية' : 'English'}</div>
            </div>
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t('profile.autoplay')}</div>
            <Switch checked={autoplay} onCheckedChange={toggleAutoplay} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t('profile.notifications')}</div>
            <Switch checked={notifications} onCheckedChange={toggleNotifications} />
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="ghost" className="text-muted-foreground" onClick={logout}>
          <LogOut className="w-4 h-4 me-2" />
          {t('profile.logout')}
        </Button>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="w-4 h-4 me-2" />
          {t('profile.deleteAccount')}
        </Button>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('profile.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError || t('profile.deleteConfirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t('profile.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
              {t('profile.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}