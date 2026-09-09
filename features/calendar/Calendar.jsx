'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Spinner from '@/components/Spinner';

export default function CalendarPage() {
  const toast = useToast();
  const { t, language } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const TYPE_LABELS = {
    manual_generation_ab_testing: t('calendar.manualType'),
    automated_social_publish: t('calendar.autoType'),
  };

  useEffect(() => {
    let mounted = true;
    api
      .getCalendar()
      .then((data) => {
        if (mounted) setCampaigns(data.scheduled_and_past_campaigns || []);
      })
      .catch((err) => {
        if (mounted) toast.error(err.message || t('calendar.noCampaigns'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [toast, t]);

  const filtered = useMemo(() => {
    if (filter === 'all') return campaigns;
    return campaigns.filter((c) => c.type === filter);
  }, [campaigns, filter]);

  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const copy = language === 'en' ? {
    selectedLabel: 'Chosen ad',
    chosenReady: 'Ready for publishing',
    otherVariants: 'Other generated variations',
    selectedSection: 'Selected image and copy',
  } : {
    selectedLabel: 'الإعلان المختار',
    chosenReady: 'جاهز للنشر',
    otherVariants: 'باقي النسخ المولدة',
    selectedSection: 'الصورة والنص المختاران',
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{t('calendar.title')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('calendar.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('calendar.all') },
            { value: 'manual_generation_ab_testing', label: t('calendar.manual') },
            { value: 'automated_social_publish', label: t('calendar.auto') },
          ].map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition-all ${
                filter === f.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-500">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <p className="mt-4 font-extrabold text-slate-700">{t('calendar.noCampaigns')}{filter !== 'all' ? ` ${t('calendar.noCampaignsFilter')}` : ''}</p>
          <p className="mt-1 text-sm text-slate-400">{t('calendar.noCampaignsDesc')}</p>
          <Link href="/dashboard/generator" className="btn-primary mt-6 !py-2.5">{t('calendar.newCampaign')}</Link>
        </div>
      ) : (
        <div className="relative space-y-6 before:absolute before:end-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-gradient-to-b before:from-brand-300 before:via-accent-300 before:to-transparent">
          {filtered.map((campaign, idx) => {
            const data = campaign.campaign_data || {};
            const variations = data.ab_testing_variations || [];
            const selectedVariation = campaign.selected_variation || variations.find((v) => v.variation_id === campaign.selected_variation_id) || null;
            const otherVariations = selectedVariation ? variations.filter((v) => v.variation_id !== selectedVariation.variation_id) : variations;
            const publish = campaign.publishing_status || [];
            const date = campaign.timestamp
              ? new Date(campaign.timestamp).toLocaleString(locale, {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })
              : t('calendar.unknownDate');

            return (
              <div key={campaign.campaign_id || idx} className="relative pe-12 animate-slide-up">
                <span className="absolute end-0 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-card ring-2 ring-brand-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>

                <div className="card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{campaign.brand_name || t('calendar.unnamedCampaign')}</h3>
                      <p className="mt-1 text-xs font-bold text-slate-400">{date}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-black text-brand-700 ring-1 ring-brand-200">{TYPE_LABELS[campaign.type] || campaign.type}</span>
                      {selectedVariation ? <span className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-[#0f2f24] dark:text-emerald-300 dark:ring-emerald-900/40">{copy.chosenReady}</span> : null}
                    </div>
                  </div>

                  {selectedVariation ? (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-[#10261e]">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-900">{copy.selectedSection}</p>
                          <p className="mt-1 text-xs font-bold text-emerald-700">{copy.selectedLabel} #{selectedVariation.variation_id}</p>
                        </div>
                        {selectedVariation.qa_score != null ? <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-[#171a21]">QA {selectedVariation.qa_score}%</span> : null}
                      </div>
                      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#303641] dark:bg-[#171a21]">
                          <img src={selectedVariation.image_output} alt={copy.selectedLabel} className="h-56 w-full object-cover" />
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#303641] dark:bg-[#171a21]">
                          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{selectedVariation.marketing_angle}</p>
                          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{selectedVariation.ad_copy}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {otherVariations.length > 0 ? (
                    <div className="mt-5">
                      <p className="mb-3 text-sm font-black text-slate-900">{selectedVariation ? copy.otherVariants : t('generator.variations')}</p>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {otherVariations.map((v) => (
                          <div key={v.variation_id} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 dark:border-[#303641] dark:bg-[#11151b]">
                            <img src={v.image_output} alt={`${t('generator.variation')} ${v.variation_id}`} className="h-28 w-full object-cover" />
                            <div className="p-3">
                              <p className="line-clamp-3 text-xs leading-5 text-slate-600">{v.ad_copy}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {data.schedule_config?.selected_hours?.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                      <span className="text-slate-400">{t('calendar.publishTimes')}</span>
                      {data.schedule_config.selected_hours.map((h) => (
                        <span key={h} className="rounded-lg bg-accent-50 px-2.5 py-1 text-accent-700 ring-1 ring-accent-200">{h}</span>
                      ))}
                    </div>
                  )}

                  {publish.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                      {publish.map((p, i) => (
                        <div key={i} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-red-50 text-red-600 ring-1 ring-red-100'}`}>
                          <span className={`h-2 w-2 rounded-full ${p.status === 'published' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                          {p.status === 'published' ? `${t('calendar.published')} ${p.platform} (${p.post_id})` : `${t('calendar.publishFailed')} ${p.platform}: ${p.error || p.message}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
