import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { api } from '../api';
import { useToast } from '../components/Toast';
import { useLanguage } from '../i18n';
import Spinner from '../components/Spinner';
import logo from '../assets/logo.png';

function StatCard({ icon, label, value, hint, color }) {
  return (
    <div className="card flex items-center gap-4">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="truncate text-2xl font-black text-slate-900">{value}</p>
        {hint && <p className="text-xs font-semibold text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const toast = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [subStatus, setSubStatus] = useState(null);
  const [aiUsage, setAiUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getCalendar()
      .then((data) => {
        if (mounted) setCampaigns(data.scheduled_and_past_campaigns || []);
      })
      .catch((err) => {
        if (mounted) toast.error(err.message || t('dashboard.noCampaigns'));
      });
    api
      .getSubscriptionStatus()
      .then((data) => {
        if (mounted) setSubStatus(data.subscription || data);
      })
      .catch(() => {});
    api
      .getAiUsage()
      .then((data) => {
        if (mounted) setAiUsage(data);
      })
      .catch(() => {});
    setTimeout(() => {
      if (mounted) setLoading(false);
    }, 800);
    return () => {
      mounted = false;
    };
  }, [toast, t]);

  const lastCampaign = campaigns[0] || null;
  const lastData = lastCampaign?.campaign_data || null;

  const stats = [
    {
      label: t('dashboard.totalCampaigns'),
      value: campaigns.length,
      hint: t('dashboard.campaignsHint'),
      color: 'bg-brand-100 text-brand-700',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      label: t('dashboard.dailyPosts'),
      value: lastData?.subscription_details?.daily_posts ?? '—',
      hint: t('dashboard.dailyPostsHint'),
      color: 'bg-accent-100 text-accent-700',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
      )
    },
    {
      label: t('dashboard.monthlySub'),
      value: lastData?.subscription_details?.total_monthly_price ?? '—',
      hint: t('dashboard.monthlySubHint'),
      color: 'bg-sunshine-100 text-sunshine-700',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: t('dashboard.engagement'),
      value: lastData?.analytics_notification?.engagement_forecast ?? '—',
      hint: lastData?.analytics_notification?.peak_hour
        ? `${t('dashboard.peakHour')} ${lastData.analytics_notification.peak_hour}`
        : t('dashboard.engagementHint'),
      color: 'bg-emerald-100 text-emerald-700',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    },
    {
      label: t('dashboard.aiUsage'),
      value: aiUsage ? `${aiUsage.requests}/${aiUsage.daily_quota}` : '—',
      hint: t('dashboard.aiUsageHint'),
      color: 'bg-violet-100 text-violet-700',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75h4.5l1.5 3.75 3.75 1.5v4.5l-3.75 1.5-1.5 3.75h-4.5l-1.5-3.75-3.75-1.5V9l3.75-1.5 1.5-3.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v3.5m0 2.25h.008" />
        </svg>
      )
    }
  ];

  const quickActions = [
    {
      to: '/dashboard/generator',
      title: t('dashboard.newCampaign'),
      desc: t('dashboard.newCampaignDesc'),
      color: 'from-brand-500 to-brand-700'
    },
    {
      to: '/dashboard/calendar',
      title: t('dashboard.viewCalendar'),
      desc: t('dashboard.viewCalendarDesc'),
      color: 'from-accent-500 to-accent-700'
    },
    {
      to: '/dashboard/pricing',
      title: t('dashboard.manageSub'),
      desc: t('dashboard.manageSubDesc'),
      color: 'from-sunshine-500 to-sunshine-600'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-brand-600 via-brand-700 to-accent-800 p-8 text-white shadow-soft sm:p-10">
        <div className="pointer-events-none absolute -start-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -end-10 h-64 w-64 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-brand-100">{t('dashboard.welcome')}</p>
            <h1 className="mt-2 text-3xl font-black">
              {user?.brandName ? `${t('dashboard.brandPrefix')} ${user.brandName}` : t('dashboard.welcomeDefault')}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-7 text-brand-100">
              {t('dashboard.welcomeDesc')}
            </p>
          </div>
          <span className="hidden h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white/15 ring-1 ring-white/30 backdrop-blur sm:flex">
            <img src={logo} alt={t('nav.logoAlt')} className="h-24 w-24 object-contain" />
          </span>
        </div>
        <div className="relative mt-8 flex flex-wrap gap-4">
          <Link
            to="/dashboard/generator"
            className="rounded-xl bg-white px-6 py-3 text-sm font-black text-brand-700 shadow-lg transition-transform hover:scale-[1.03]"
          >
            {t('dashboard.newCampaignBtn')}
          </Link>
          <Link
            to="/dashboard/pricing"
            className="rounded-xl bg-white/15 px-6 py-3 text-sm font-black text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/25"
          >
            {t('dashboard.manageSubBtn')}
          </Link>
          {subStatus && (
            <span className={`ms-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black backdrop-blur ${
              subStatus.active
                ? 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/30'
                : 'bg-red-500/20 text-red-100 ring-1 ring-red-400/30'
            }`}>
              <span className={`h-2 w-2 rounded-full ${subStatus.active ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              {subStatus.active
                ? subStatus.days_remaining > 0
                  ? `${t('sub.active')} — ${subStatus.days_remaining} ${t('sub.daysRemaining')}`
                  : t('sub.active')
                : t('sub.inactive')}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">{t('dashboard.latestCampaigns')}</h2>
            <Link
              to="/dashboard/calendar"
              className="text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              {t('dashboard.viewAll')}
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </span>
              <p className="mt-4 font-extrabold text-slate-700">{t('dashboard.noCampaigns')}</p>
              <p className="mt-1 text-sm text-slate-400">{t('dashboard.noCampaignsDesc')}</p>
              <Link to="/dashboard/generator" className="btn-primary mt-6 !py-2.5">
                {t('dashboard.firstCampaign')}
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {campaigns.slice(0, 5).map((campaign, idx) => {
                const data = campaign.campaign_data || {};
                return (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-lg font-black text-white">
                        {(campaign.brand_name || 'A').slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-slate-800">
                          {campaign.brand_name || t('dashboard.unnamedCampaign')}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">
                          {new Date(campaign.timestamp).toLocaleString(language === 'en' ? 'en-US' : 'ar-EG', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-200 sm:inline-block">
                        {data.subscription_details?.total_monthly_price || '—'}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200">
                        {campaign.type === 'automated_social_publish' ? t('dashboard.autoPublish') : t('dashboard.manualGen')}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <h2 className="text-lg font-extrabold text-slate-900">{t('dashboard.quickActions')}</h2>
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-bl ${action.color} p-6 text-white shadow-lg transition-transform hover:-translate-y-1`}
            >
              <div className="pointer-events-none absolute -start-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform group-hover:scale-150" />
              <h3 className="relative text-base font-black">{action.title}</h3>
              <p className="relative mt-1.5 text-sm text-white/85">{action.desc}</p>
              <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-black">
                {t('dashboard.startNow')}
                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}