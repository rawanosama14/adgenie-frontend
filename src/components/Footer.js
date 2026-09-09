import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import logo from '../assets/logo.png';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-app py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
                <img src={logo} alt={t('nav.logoAlt')} className="h-10 w-10 object-contain" />
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                Ad<span className="text-brand-400">Genie</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              {t('footer.description')}
            </p>
            <div className="mt-5 flex gap-3">
              {[
                {
                  name: t('footer.facebook'),
                  path: 'M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8V14h2v6h2.5v-6h2l.5-2.5h-2.5V10c0-.552.448-1 1-1z'
                },
                {
                  name: t('footer.instagram'),
                  path: 'M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5zm0 5.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm4.5-5.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM12 5.5c-1.8 0-2.03.008-2.74.04-.71.032-1.19.145-1.61.31-.44.17-.81.4-1.18.77-.37.37-.6.74-.77 1.18-.17.42-.28.9-.31 1.61-.03.71-.04.94-.04 2.74s.01 2.03.04 2.74c.03.71.14 1.19.31 1.61.17.44.4.81.77 1.18.37.37.74.6 1.18.77.42.17.9.28 1.61.31.71.03.94.04 2.74.04s2.03-.01 2.74-.04c.71-.03 1.19-.14 1.61-.31.44-.17.81-.4 1.18-.77.37-.37.6-.74.77-1.18.17-.42.28-.9.31-1.61.03-.71.04-.94.04-2.74s-.01-2.03-.04-2.74c-.03-.71-.14-1.19-.31-1.61-.17-.44-.4-.81-.77-1.18-.37-.37-.74-.6-1.18-.77-.42-.17-.9-.28-1.61-.31-.71-.03-.94-.04-2.74-.04z'
                },
                {
                  name: t('footer.twitter'),
                  path: 'M17.7 4.5h2.6l-5.7 6.5 6.7 8.9h-5.2l-4.1-5.4-4.7 5.4H4.7l6.1-7-6.4-8.4h5.3l3.7 4.9 4.3-4.9z'
                },
                {
                  name: t('footer.linkedin'),
                  path: 'M6.5 8.5v11H3.5v-11h3zm.16-3.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zM20.5 12.9v6.6h-3v-6.2c0-1.6-.6-2.7-2-2.7-1.1 0-1.7.75-2 1.45-.1.26-.13.62-.13.98v6.5h-3V8.5h3v1.35c.4-.6 1.1-1.5 2.7-1.5 2 0 3.43 1.3 3.43 4.05z'
                }
              ].map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition-all hover:bg-brand-600 hover:text-white"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">{t('footer.quickLinks')}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/" className="transition-colors hover:text-brand-400">{t('nav.home')}</Link></li>
              <li><Link to="/login" className="transition-colors hover:text-brand-400">{t('nav.login')}</Link></li>
              <li><Link to="/register" className="transition-colors hover:text-brand-400">{t('footer.createAccount')}</Link></li>
              <li><Link to="/dashboard/generator" className="transition-colors hover:text-brand-400">{t('footer.campaignGenerator')}</Link></li>
              <li><Link to="/dashboard/pricing" className="transition-colors hover:text-brand-400">{t('footer.subscriptions')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">{t('footer.contactUs')}</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@adgenie.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +20 100 000 0000
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('footer.address')}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>{t('footer.copyright').replace('{year}', year)}</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-brand-400">{t('footer.privacy')}</a>
            <a href="#" className="transition-colors hover:text-brand-400">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}