import React from 'react';
import { useLanguage } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export default function SubscriptionTerms() {
  const { t, lang } = useLanguage();
  const updated = lang === 'ar' ? '١٧ أغسطس ٢٠٢٦' : 'August 17, 2026';
  return (
    <LegalPage title={t('legal.subscriptionTerms.title')} updated={updated}>
      {lang === 'ar' ? (
        <>
          <p>تتحكم هذه الشروط في اشتراكات نغمة المدفوعة.</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">الباقات</h2>
            <p>نوفّر باقات مجاني وبريميوم وعائلية. تختلف الميزات حسب الباقة.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">الفوترة</h2>
            <p>تُحاسب الرسوم شهرياً على طريقة الدفع المسجّلة.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">التجديد والإلغاء</h2>
            <p>تتجدد الاشتراكات تلقائياً حتى تُلغيها. يمكنك الإلغاء في أي وقت من ملفك الشخصي.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">المبالغ المستردة</h2>
            <p>تُعالج طلبات الاسترداد وفق سياسة الاسترداد المعمول بها.</p>
          </div>
        </>
      ) : (
        <>
          <p>These terms govern paid subscriptions to Naghma.</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">Plans</h2>
            <p>We offer Free, Premium, and Family plans. Features vary by plan.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">Billing</h2>
            <p>Fees are charged monthly to your registered payment method.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">Renewal & Cancellation</h2>
            <p>Subscriptions auto-renew until you cancel. You can cancel anytime from your profile.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">Refunds</h2>
            <p>Refund requests are handled according to our refund policy.</p>
          </div>
        </>
      )}
    </LegalPage>
  );
}