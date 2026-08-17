import React from 'react';
import { useLanguage } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export default function TermsOfService() {
  const { t, lang } = useLanguage();
  const updated = lang === 'ar' ? '١٧ أغسطس ٢٠٢٦' : 'August 17, 2026';
  const sections = lang === 'ar' ? [
    { h: 'التعريفات', p: 'يقصد بـ "الخدمة" تطبيق موسيقى النور ومنصته لبث الموسيقى، و"المحتوى" أي مقاطع صوتية وأعمال فنية وبيانات مرتبطة بها، و"المستخدم" أي شخص يستخدم الخدمة.' },
    { h: 'حقوق المستخدم', p: 'يحق لك تصفح المحتوى المتاح وإنشاء حساب وإدارة تفضيلاتك. يخضع الوصول الكامل للبث لتسجيل الدخول.' },
    { h: 'قواعد بث الصوت', p: 'يُسمح بالبث للاستماع الشخصي فقط. يُحظر التسجيل أو إعادة البث أو أي استخدام تجاري غير مصرّح به للمحتوى.' },
    { h: 'الملكية الفكرية', p: 'جميع حقوق المحتوى مملوكة لأصحابها أو مرخّصة لـ موسيقى النور. لا تكتسب أي حقوق في المحتوى بمجرد استخدامه.' },
    { h: 'حدود المسؤولية', p: 'تُقدَّم الخدمة "كما هي" دون ضمانات. لا تتحمّل موسيقى النور مسؤولية أي أضرار غير مباشرة أو عرضية ناتجة عن الاستخدام.' },
    { h: 'الإنهاء', p: 'يمكنك حذف حسابك في أي وقت من إعدادات الحساب. كما يجوز لنا تعليق أو إنهاء الوصول عند مخالفة هذه الشروط.' },
    { h: 'القانون الحاكم', p: 'تخضع هذه الشروط لقواني​​ن الولاية القضائية المعمول بها دون تعارض مع مبادئها.' },
  ] : [
    { h: 'Definitions', p: '"Service" means the Musiqa-Al-Nour app and its music streaming platform, "Content" means any audio tracks, artwork, and associated data, and "User" means any person using the Service.' },
    { h: 'User Rights', p: 'You may browse available content, create an account, and manage your preferences. Full streaming access requires logging in.' },
    { h: 'Audio Streaming Rules', p: 'Streaming is permitted for personal listening only. Recording, re-broadcasting, or any unauthorized commercial use of Content is prohibited.' },
    { h: 'Intellectual Property', p: 'All Content rights belong to their owners or are licensed to Musiqa-Al-Nour. You acquire no rights in the Content by using it.' },
    { h: 'Limitation of Liability', p: 'The Service is provided "as is" without warranties. Musiqa-Al-Nour is not liable for any indirect or incidental damages arising from use.' },
    { h: 'Termination', p: 'You may delete your account at any time from Account Settings. We may also suspend or terminate access upon violation of these terms.' },
    { h: 'Governing Law', p: 'These terms are governed by the laws of the applicable jurisdiction without conflict with its principles.' },
  ];

  return (
    <LegalPage title={t('legal.terms.title')} updated={updated}>
      {lang === 'ar' ? (
        <p>مرحباً بك في موسيقى النور. باستخدامك خدمتنا فإنك توافق على هذه الشروط.</p>
      ) : (
        <p>Welcome to Musiqa-Al-Nour. By using our service you agree to these terms.</p>
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