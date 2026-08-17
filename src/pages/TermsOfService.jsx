import React from 'react';
import { useLanguage } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export default function TermsOfService() {
  const { t, lang } = useLanguage();
  const updated = lang === 'ar' ? '١٧ أغسطس ٢٠٢٦' : 'August 17, 2026';
  return (
    <LegalPage title={t('legal.terms.title')} updated={updated}>
      {lang === 'ar' ? (
        <>
          <p>مرحباً بك في نغمة. باستخدامك خدمة البث الخاصة بنا فإنك توافق على هذه الشروط.</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">١. الحسابات</h2>
            <p>يجب أن يكون عمرك ١٣ سنة على الأقل لإنشاء حساب. أنت مسؤول عن الحفاظ على أمان بيانات اعتمادك.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">٢. الاشتراكات</h2>
            <p>تتجدد الاشتراكات المدفوعة تلقائياً حتى يتم إلغاؤها. يمكنك الإلغاء في أي وقت من ملفك الشخصي.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">٣. المحتوى</h2>
            <p>جميع الموسيقى والأعمال الفنية مرخّصة لـ نغمة للبث. لا يجوز لك تنزيل المحتوى أو إعادة توزيعه إلا بما يسمح به باقتك.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">٤. الإنهاء</h2>
            <p>قد نعلّق أو ننهي الحسابات التي تنتهك هذه الشروط.</p>
          </div>
        </>
      ) : (
        <>
          <p>Welcome to Naghma. By using our streaming service you agree to these terms.</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">1. Accounts</h2>
            <p>You must be at least 13 years old to create an account. You are responsible for keeping your credentials secure.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">2. Subscriptions</h2>
            <p>Paid subscriptions auto-renew until canceled. You can cancel anytime from your profile.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">3. Content</h2>
            <p>All music and artwork are licensed to Naghma for streaming. You may not download or redistribute content except where permitted by your plan.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">4. Termination</h2>
            <p>We may suspend or terminate accounts that violate these terms.</p>
          </div>
        </>
      )}
    </LegalPage>
  );
}