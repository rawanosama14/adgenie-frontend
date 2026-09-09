import React from 'react';
import { useLanguage } from '../i18n';

export default function Spinner({ size = 'md', light = false }) {
  const { t } = useLanguage();
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <span
      className={`inline-block animate-spin rounded-full border-t-transparent ${
        sizes[size] || sizes.md
      } ${light ? 'border-white/60' : 'border-brand-600'}`}
      role="status"
      aria-label={t('common.loading')}
    />
  );
}

export function FullPageLoader({ label }) {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm font-bold text-slate-500">{label || t('common.loadingDots')}</p>
    </div>
  );
}
