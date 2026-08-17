import React from 'react';
import { useLanguage } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';

export default function DMCA() {
  const { t, lang } = useLanguage();
  const updated = lang === 'ar' ? '١٧ أغسطس ٢٠٢٦' : 'August 17, 2026';
  const sections = lang === 'ar' ? [
    { h: 'إجراءات إشعار الإزالة', p: 'لإرسال إشعار إزالة، قدّم وصفاً للمحتوى المنتهك وموقعه وتصريحاً بحسن النية بأن الاستخدام غير مصرّح، وتوقيعك الإلكتروني أو المادي.' },
    { h: 'تعليمات الاتصال بوكلاء حقوق النشر', p: 'وجّه إشعارات DMCA إلى وكيل حقوق النشر عبر نموذج الاتصال في التطبيق مع تضمين جميع المعلومات المطلوبة أعلاه.' },
    { h: 'قواعد الإشعار المضاد', p: 'إذا اعتقدت أن المحتوى أُزيل بالخطأ، يمكنك إرسال إشعار مضاد يتضمن وصف المحتوى المُعاد وتصريحاً بموافقتك على ولاية المحكمة وتوقيعك.' },
  ] : [
    { h: 'Takedown Notification Procedures', p: 'To submit a takedown notice, provide a description of the infringing content and its location, a good-faith statement that the use is unauthorized, and your physical or electronic signature.' },
    { h: 'Copyright Agent Contact Instructions', p: 'Direct DMCA notices to our copyright agent via the contact form in the app, including all required information above.' },
    { h: 'Counter-Notification Rules', p: 'If you believe content was removed in error, you may submit a counter-notice including a description of the restored content, your consent to local court jurisdiction, and your signature.' },
  ];

  return (
    <LegalPage title={t('legal.dmca.title')} updated={updated}>
      {lang === 'ar' ? (
        <p>تستجيب نغمة لإشعارات انتهاك حقوق النشر وفقاً لقانون حقوق النشر الرقمي (DMCA).</p>
      ) : (
        <p>Naghma responds to copyright infringement notices under the Digital Millennium Copyright Act (DMCA).</p>
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