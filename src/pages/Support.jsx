import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { LifeBuoy, Mail, Send } from 'lucide-react';

const faqs = {
  en: [
    { q: 'How do I create an account?', a: 'Tap Sign Up on the login screen, enter your email and password, and verify the code we send you.' },
    { q: 'Can I listen without an account?', a: 'You can browse and search music freely, but streaming audio requires a free account.' },
    { q: 'How do I change the language?', a: 'Open Account Settings and use the language toggle, or switch language from the header.' },
    { q: 'How do I switch to dark mode?', a: 'Go to Account Settings and choose Dark under Display Theme.' },
    { q: 'How do I delete my account?', a: 'Open your Profile and use the Delete Account option. This action is permanent.' },
    { q: 'Where can I find my listening history?', a: 'Open the History page from your account menu to see recently played tracks.' },
  ],
  ar: [
    { q: 'كيف أنشئ حساباً؟', a: 'اضغط على إنشاء حساب في شاشة الدخول، أدخل بريدك الإلكتروني وكلمة المرور، ثم تحقق من الرمز الذي نرسله لك.' },
    { q: 'هل يمكنني الاستماع بدون حساب؟', a: 'يمكنك تصفح وبحث الموسيقى بحرية، لكن بث الصوت يتطلب حساباً مجانياً.' },
    { q: 'كيف أغيّر اللغة؟', a: 'افتح إعدادات الحساب واستخدم مبدّل اللغة، أو بدّل اللغة من الترويسة.' },
    { q: 'كيف أنتقل إلى الوضع الداكن؟', a: 'اذهب إلى إعدادات الحساب واختر داكن تحت المظهر.' },
    { q: 'كيف أحذف حسابي؟', a: 'افتح ملفك الشخصي واستخدم خيار حذف الحساب. هذا الإجراء نهائي.' },
    { q: 'أين أجد سجل استماعي؟', a: 'افتح صفحة السجل من قائمة حسابك لرؤية الأغاني التي تم تشغيلها مؤخراً.' },
  ],
};

export default function Support() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast({ title: t('support.sent') });
    }, 600);
  };

  const items = faqs[lang] || faqs.en;

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LifeBuoy className="w-7 h-7" /> {t('support.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('support.subtitle')}</p>
      </div>

      <form onSubmit={onSubmit} className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Mail className="w-5 h-5" /> {t('support.contact')}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t('support.name')}</Label>
            <Input id="name" required value={form.name} onChange={update('name')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('support.email')}</Label>
            <Input id="email" type="email" required value={form.email} onChange={update('email')} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subject">{t('support.subject')}</Label>
          <Input id="subject" required value={form.subject} onChange={update('subject')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="message">{t('support.message')}</Label>
          <Textarea id="message" required rows={5} value={form.message} onChange={update('message')} />
        </div>
        <Button type="submit" disabled={submitting}>
          <Send className="w-4 h-4 me-2" /> {submitting ? t('common.loading') : t('support.send')}
        </Button>
      </form>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('support.faq')}</h2>
        <Accordion type="single" collapsible>
          {items.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}