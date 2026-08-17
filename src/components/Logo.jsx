import React from 'react';
import { useLanguage } from '@/lib/i18n';

export const LOGO_URL =
  'https://media.base44.com/images/public/6a829692f25da3faf5c372e7/2f267c757_MusiqaAlNour.jpeg';

export default function Logo({ className = 'h-9 w-auto' }) {
  const { t } = useLanguage();
  return <img src={LOGO_URL} alt={t('appName')} className={className} />;
}