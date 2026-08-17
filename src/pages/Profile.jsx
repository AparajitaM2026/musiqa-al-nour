import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Loader2, LogOut, Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLANS = [
  { id: 'free', price: 'Free', highlight: false },
  { id: 'premium', price: '$9.99', highlight: true },
  { id: 'family', price: '$14.99', highlight: false },
];

export default function Profile() {
  const { t, lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const subs = await base44.entities.Subscription.filter({ user_id: me.id });
        setSub(subs[0] || { tier: 'free', status: 'active' });
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const subscribe = async (tier) => {
    if (!user || updating) return;
    setUpdating(tier);
    try {
      if (sub && sub.id) {
        const updated = await base44.entities.Subscription.update(sub.id, { tier, status: 'active', start_date: new Date().toISOString() });
        setSub(updated);
      } else {
        const created = await base44.entities.Subscription.create({ user_id: user.id, tier, status: 'active', start_date: new Date().toISOString() });
        setSub(created);
      }
    } catch (e) {
    } finally {
      setUpdating(null);
    }
  };

  const logout = () => base44.auth.logout();

  if (loading) {
    return (
      <div className="h-full grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t('profile.title')}</h1>

      <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground grid place-items-center text-xl font-bold">
          {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-bold truncate">{user?.full_name || user?.email}</div>
          <div className="text-sm text-muted-foreground truncate">{user?.email}</div>
          <div className="mt-1 inline-flex items-center gap-1 text-xs">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">{t(`tier.${sub?.tier || 'free'}`)}</span>
            <span className="text-muted-foreground">· {t('profile.active')}</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card">
        <div className="text-sm font-semibold mb-3">{t('profile.language')}</div>
        <LanguageToggle />
      </div>

      <section>
        <h2 className="text-lg font-bold mb-4">{t('profile.choosePlan')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = (sub?.tier || 'free') === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border p-5 flex flex-col bg-card',
                  plan.highlight ? 'border-primary ring-1 ring-primary' : 'border-border',
                  isCurrent && 'bg-primary/5'
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-2 end-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                    Popular
                  </span>
                )}
                <div className="text-base font-bold">{t(`tier.${plan.id}`)}</div>
                <div className="text-2xl font-bold mt-1">
                  {plan.price}
                  {plan.id !== 'free' && <span className="text-sm font-normal text-muted-foreground">{t('profile.perMonth')}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex-1">{t(`profile.${plan.id}.desc`)}</p>
                <Button
                  variant={isCurrent ? 'outline' : plan.highlight ? 'default' : 'secondary'}
                  className="mt-4 w-full"
                  disabled={isCurrent || updating === plan.id}
                  onClick={() => subscribe(plan.id)}
                >
                  {updating === plan.id ? (
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  ) : isCurrent ? (
                    <Check className="w-4 h-4 me-2" />
                  ) : null}
                  {isCurrent ? t('profile.current') : t('profile.subscribe')}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <Button variant="ghost" className="text-muted-foreground" onClick={logout}>
        <LogOut className="w-4 h-4 me-2" />
        {t('profile.logout')}
      </Button>
    </div>
  );
}