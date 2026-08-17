import React from 'react';
import { useLanguage } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export default function DMCA() {
  const { t, lang } = useLanguage();
  const updated = lang === 'ar' ? '١٧ أغسطس ٢٠٢٦' : 'August 17, 2026';
  return (
    <LegalPage title={t('legal.dmca.title')} updated={updated}>
      {lang === 'ar' ? (
        <>
          <p>تستجيب نغمة لإشعارات انتهاك حقوق النشر وفقاً لقانون حقوق النشر الرقمي (DMCA).</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">إشعار الانتهاك</h2>
            <p>لإرسال إشعار بانتهاك، قدّم وصفاً للمحتوى المعني ومعلومات الاتصال وتصريح بحسن النية.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">إشعار المضاد</h2>
            <p>إذا اعتقدت أن المحتوى أُزيل بالخطأ، يمكنك إرسال إشعار مضاد مع تفسيرك.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">المخالفون المتكررون</h2>
            <p>سننهي حسابات المخالفين المتكررين لحقوق النشر.</p>
          </div>
        </>
      ) : (
        <>
          <p>Naghma responds to copyright infringement notices under the Digital Millennium Copyright Act (DMCA).</p>
          <div>
            <h2 className="text-lg font-semibold mb-1">Notice of Infringement</h2>
            <p>To submit a takedown notice, provide a description of the content, your contact information, and a good-faith statement.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">Counter-Notice</h2>
            <p>If you believe content was removed in error, you may submit a counter-notice with your explanation.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">Repeat Infringers</h2>
            <p>We terminate accounts of repeat copyright infringers.</p>
          </div>
        </>
      )}
    </LegalPage>
  );
}