import React from 'react';
import { useLanguage } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export default function PrivacyPolicy() {
  const { t, lang } = useLanguage();
  const updated = lang === 'ar' ? '١٧ أغسطس ٢٠٢٦' : 'August 17, 2026';
  return (
    <LegalPage title={t('legal.privacy.title')} updated={updated}>
      {lang === 'ar' ? (
        <>
          <p>تحترم نغمة خصوصيتك. توضّح هذه السياسة البيانات التي نجمعها وكيفية استخدامها.</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">البيانات التي نجمعها</h2>
            <p>نجمع عنوان بريدك الإلكتروني، وسجل الاستماع، وتفضيلات الإعدادات لتقديم الخدمة.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">كيف نستخدم بياناتك</h2>
            <p>نستخدم بياناتك لتشغيل الموسيقى، وتخصيص المحتوى، وتحسين الخدمة. لا نبيع بياناتك.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">اختياراتك</h2>
            <p>يمكنك تعديل إعداداتك أو حذف حسابك في أي وقت من ملفك الشخصي.</p>
          </div>
        </>
      ) : (
        <>
          <p>Naghma respects your privacy. This policy explains the data we collect and how we use it.</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">Data We Collect</h2>
            <p>We collect your email address, listening history, and settings preferences to provide the service.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">How We Use Your Data</h2>
            <p>We use your data to play music, personalize content, and improve the service. We never sell your data.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">Your Choices</h2>
            <p>You can adjust your settings or delete your account at any time from your profile.</p>
          </div>
        </>
      )}
    </LegalPage>
  );
}