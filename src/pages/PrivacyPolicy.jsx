import React from 'react';
import { useLanguage } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export default function PrivacyPolicy() {
  const { t, lang } = useLanguage();
  const updated = lang === 'ar' ? '١٧ أغسطس ٢٠٢٦' : 'August 17, 2026';
  const sections = lang === 'ar' ? [
    { h: 'جمع البيانات', p: 'نجمع عنوان بريدك الإلكتروني عند التسجيل، وبيانات الجهاز مثل نوع المتصفح ونظام التشغيل لضمان التوافق والأمان.' },
    { h: 'الغرض من الاستخدام', p: 'نستخدم بياناتك لتشغيل الموسيقى وتخصيص المحتوى وتحسين الخدمة. لا نبيع بياناتك الشخصية.' },
    { h: 'حقوق حذف الحساب', p: 'يمكنك حذف حسابك وبياناتك المرتبطة به نهائياً في أي وقت من إعدادات الحساب عبر زر "حذف الحساب".' },
    { h: 'التحليلات الخارجية', p: 'قد نستخدم أدوات تحليلات خارجية لفهم استخدام الخدمة، وتخضع هذه الأدوات لسياسات الخصوصية الخاصة بها.' },
    { h: 'سياسة ملفات تعريف الارتباط', p: 'نستخدم ملفات تعريف الارتباط والتخزين المحلي لحفظ تفضيلاتك مثل اللغة وسجل الاستماع على جهازك.' },
  ] : [
    { h: 'Data Collection', p: 'We collect your email address upon registration and device data such as browser type and operating system to ensure compatibility and security.' },
    { h: 'Usage Purpose', p: 'We use your data to play music, personalize content, and improve the Service. We never sell your personal data.' },
    { h: 'Account Deletion Rights', p: 'You may permanently delete your account and its associated data at any time from Account Settings via the "Delete Account" button.' },
    { h: 'Third-Party Analytics', p: 'We may use third-party analytics tools to understand Service usage; these tools are subject to their own privacy policies.' },
    { h: 'Cookie Policy', p: 'We use cookies and local storage to remember your preferences such as language and listening history on your device.' },
  ];

  return (
    <LegalPage title={t('legal.privacy.title')} updated={updated}>
      {lang === 'ar' ? (
        <p>تحترم موسيقى النور خصوصيتك. توضّح هذه السياسة البيانات التي نجمعها وكيفية استخدامها.</p>
      ) : (
        <p>Musiqa-Al-Nour respects your privacy. This policy explains the data we collect and how we use it.</p>
      )}
      {sections.map((s, i) => (
        <div key={i}>
          <h2 className="text-lg font-semibold mb-1">{s.h}</h2>
          <p>{s.p}</p>
        </div>
      ))}
    </LegalPage>
  );
}