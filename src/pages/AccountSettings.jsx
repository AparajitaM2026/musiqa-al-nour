import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import LanguageToggle from '@/components/LanguageToggle';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Globe, Palette } from 'lucide-react';

export default function AccountSettings() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem('naghma-notifications') !== '0'
  );

  const toggleNotifications = (v) => {
    setNotifications(v);
    localStorage.setItem('naghma-notifications', v ? '1' : '0');
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t('account.title')}</h1>

      <section className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bell className="w-5 h-5" /> {t('account.notifications')}
        </h2>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{t('profile.notifications')}</div>
          <Switch checked={notifications} onCheckedChange={toggleNotifications} />
        </div>
      </section>

      <section className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Globe className="w-5 h-5" /> {t('account.language')}
        </h2>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{t('profile.language')}</div>
          <LanguageToggle />
        </div>
      </section>

      <section className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Palette className="w-5 h-5" /> {t('account.theme')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
          >
            {t('account.themeLight')}
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
          >
            {t('account.themeDark')}
          </Button>
        </div>
      </section>
    </div>
  );
}