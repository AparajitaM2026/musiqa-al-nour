import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

export default function AuthGateModal({ open, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary grid place-items-center mb-2">
          <Music className="w-6 h-6" />
        </div>
        <DialogHeader className="items-center text-center">
          <DialogTitle>{t('authgate.title')}</DialogTitle>
          <DialogDescription>{t('authgate.message')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button className="w-full" onClick={() => navigate('/login')}>{t('header.signin')}</Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>{t('header.signup')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}