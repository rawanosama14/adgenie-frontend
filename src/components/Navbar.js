import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useLanguage } from '../i18n';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthed, user } = useAuth();
  const { t } = useLanguage();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/#features', label: t('nav.features') },
    { to: '/#how', label: t('nav.how') },
    { to: '/#pricing', label: t('nav.pricing') }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <nav className="container-app flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-soft ring-2 ring-brand-100">
            <img src={logo} alt={t('nav.logoAlt')} className="h-10 w-10 object-contain" />
          </span>
          <span className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900">
              Ad<span className="text-brand-600">Genie</span>
            </span>
            <span className="-mt-1 text-[11px] font-semibold text-slate-400">
              {t('nav.tagline')}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isHash = link.to.startsWith('/#');
            if (isHash) {
              const hash = link.to.replace('/', '');
              return (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(hash.replace('#', ''));
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LanguageToggle className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700" />
          {isAuthed ? (
            <>
              <span className="text-sm font-semibold text-slate-500">
                {t('nav.greeting')} <span className="text-brand-700">{user?.brandName || user?.email}</span>
              </span>
              <Link to="/dashboard" className="btn-primary !px-5 !py-2.5">
                {t('nav.dashboard')}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline !px-5 !py-2.5">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5">
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
          aria-label={t('nav.openMenu')}
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <span className="text-sm font-semibold text-slate-500">Theme</span>
            </div>
            <LanguageToggle className="rounded-lg px-4 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700" />
            {isAuthed ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-primary w-full">
                {t('nav.dashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline w-full">
                  {t('nav.login')}
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}