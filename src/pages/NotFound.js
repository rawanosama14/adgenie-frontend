import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import logo from '../assets/logo.png';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-brand-50 via-white to-accent-50 p-4 text-center">
      <img
        src={logo}
        alt={t('notFound.logoAlt')}
        className="h-32 w-32 animate-float rounded-3xl object-contain shadow-soft"
      />
      <h1 className="mt-8 text-7xl font-black text-slate-900">
        4<span className="text-brand-600">0</span>4
      </h1>
      <p className="mt-3 text-xl font-extrabold text-slate-700">{t('notFound.heading')}</p>
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
        {t('notFound.description')}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-primary">{t('notFound.home')}</Link>
        <Link to="/dashboard" className="btn-outline">{t('notFound.dashboard')}</Link>
      </div>
    </div>
  );
}