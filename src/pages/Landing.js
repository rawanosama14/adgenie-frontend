import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../i18n';
import logo from '../assets/logo.png';

export default function Landing() {
  const { t, language } = useLanguage();

  const FEATURES = [
    {
      title: t('landing.feat1Title'),
      desc: t('landing.feat1Desc'),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      color: 'bg-brand-100 text-brand-700'
    },
    {
      title: t('landing.feat2Title'),
      desc: t('landing.feat2Desc'),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5 4.5m10.5-4.5l1.5 4.5M9 7.5l3 3m0 0l3-3m-3 3v7.5" />
        </svg>
      ),
      color: 'bg-accent-100 text-accent-700'
    },
    {
      title: t('landing.feat3Title'),
      desc: t('landing.feat3Desc'),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-sunshine-100 text-sunshine-700'
    },
    {
      title: t('landing.feat4Title'),
      desc: t('landing.feat4Desc'),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
      color: 'bg-rose-100 text-rose-700'
    },
    {
      title: t('landing.feat5Title'),
      desc: t('landing.feat5Desc'),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      color: 'bg-sky-100 text-sky-700'
    },
    {
      title: t('landing.feat6Title'),
      desc: t('landing.feat6Desc'),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      color: 'bg-emerald-100 text-emerald-700'
    }
  ];

  const STEPS = [
    {
      num: '01',
      title: t('landing.step1Title'),
      desc: t('landing.step1Desc')
    },
    {
      num: '02',
      title: t('landing.step2Title'),
      desc: t('landing.step2Desc')
    },
    {
      num: '03',
      title: t('landing.step3Title'),
      desc: t('landing.step3Desc')
    }
  ];

  const STATS = [
    ['+120', t('landing.stats.brands')],
    ['+98%', t('landing.stats.satisfaction')],
    ['x3', t('landing.stats.engagement')]
  ];

  const PLAN_ITEMS = [
    t('landing.planItem1'),
    t('landing.planItem2'),
    t('landing.planItem3'),
    t('landing.planItem4'),
    t('landing.planItem5')
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-50 via-white to-accent-50">
        <div className="pointer-events-none absolute -start-24 -top-24 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 -end-24 h-80 w-80 rounded-full bg-accent-300/30 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute end-1/3 top-10 h-40 w-40 rounded-full bg-sunshine-300/40 blur-3xl animate-blob" />

        <div className="container-app relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-extrabold text-brand-700 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-500" />
              {t('landing.badge')}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.25] text-slate-900 sm:text-5xl lg:leading-[1.2]">
              {t('landing.heroPart1')}{' '}
              <span className="bg-gradient-to-l from-brand-600 to-accent-600 bg-clip-text text-transparent">
                {t('landing.heroHighlight')}
              </span>{' '}
              {t('landing.heroPart2')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {t('landing.heroDesc')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary !px-8 !py-4 !text-base">
                {t('landing.ctaStart')}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {language === 'ar' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  )}
                </svg>
              </Link>
              <Link to="/login" className="btn-outline !px-8 !py-4 !text-base">
                {t('landing.ctaLogin')}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {STATS.map(([value, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">{value}</span>
                  <span className="text-sm font-semibold text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center animate-slide-up">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full bg-gradient-to-tr from-brand-400/40 via-sunshine-300/40 to-accent-400/40 blur-2xl" />
            </div>
            <div className="relative animate-float">
              <span className="absolute inset-0 -m-3 rounded-[2.5rem] bg-gradient-to-tr from-brand-200 via-white to-accent-200 opacity-80" />
              <img
                src={logo}
                alt={t('landing.heroAlt')}
                className="relative h-80 w-80 rounded-[2rem] object-contain shadow-soft sm:h-[26rem] sm:w-[26rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-20">
        <div className="container-app">
          <h2 className="section-title">
            {t('landing.featuresTitle')} <span className="text-brand-600">{t('landing.featuresHighlight')}</span>
          </h2>
          <p className="section-subtitle">
            {t('landing.featuresSubtitle')}
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card group hover:-translate-y-1.5 hover:shadow-soft"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} transition-transform group-hover:scale-110`}>
                  {f.icon}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-white py-20">
        <div className="container-app">
          <h2 className="section-title">
            {t('landing.howTitle')} <span className="text-accent-600">{t('landing.howHighlight')}</span>{language === 'ar' ? '؟' : '?'}
          </h2>
          <p className="section-subtitle">{t('landing.howSubtitle')}</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute start-0 top-10 hidden h-0.5 w-1/2 -translate-x-1/2 bg-gradient-to-l from-brand-300 to-accent-300 md:block" />
                )}
                <div className="relative mx-auto flex flex-col items-center text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-600 text-2xl font-black text-white shadow-lg shadow-brand-600/30">
                    {step.num}
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-900">{step.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gradient-to-bl from-brand-600 via-brand-700 to-accent-800 py-20 text-white">
        <div className="container-app">
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">{t('landing.pricingTitle')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-brand-100">
            {t('landing.pricingSubtitle')}
          </p>
          <div className="mx-auto mt-12 max-w-md rounded-3xl bg-white/10 p-8 text-center shadow-2xl ring-1 ring-white/20 backdrop-blur">
            <span className="inline-block rounded-full bg-sunshine-400 px-4 py-1 text-xs font-black text-slate-900">
              {t('landing.planBadge')}
            </span>
            <div className="mt-6 flex items-end justify-center gap-2">
              <span className="text-6xl font-black">1000</span>
              <span className="pb-2 text-xl font-bold text-brand-200">{t('common.egpMonth')}</span>
            </div>
            <ul className="mt-8 space-y-3 text-end text-sm font-semibold">
              {PLAN_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-sunshine-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="mt-8 block w-full rounded-xl bg-white px-6 py-4 text-sm font-black text-brand-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              {t('landing.planCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-app">
          <div className="card relative overflow-hidden !p-10 text-center sm:!p-14">
            <div className="pointer-events-none absolute -end-16 -top-16 h-52 w-52 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -start-16 h-52 w-52 rounded-full bg-accent-200/40 blur-3xl" />
            <img
              src={logo}
              alt={t('landing.logoAlt')}
              className="mx-auto h-24 w-24 rounded-2xl object-contain shadow-soft"
            />
            <h2 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">
              {t('landing.ctaTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              {t('landing.ctaDesc')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-accent !px-8 !py-4 !text-base">
                {t('landing.ctaCreate')}
              </Link>
              <Link to="/login" className="btn-outline !px-8 !py-4 !text-base">
                {t('landing.ctaLoginBottom')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}