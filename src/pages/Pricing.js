import React, { useMemo, useState } from 'react';
import { api } from '../api';
import { useToast } from '../components/Toast';
import { useLanguage } from '../i18n';
import Spinner from '../components/Spinner';

const BASE_PRICE = 1000;
const EXTRA_PRICE = 200;

export default function Pricing() {
  const toast = useToast();
  const { t } = useLanguage();
  const [posts, setPosts] = useState(5);
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState(null);

  const total = useMemo(
    () => BASE_PRICE + Math.max(0, posts - 5) * EXTRA_PRICE,
    [posts]
  );

  const handleCheckout = async () => {
    setLoading(true);
    setCheckout(null);
    try {
      const data = await api.createCheckout(posts);
      setCheckout(data);
      toast.success(data.message || t('pricing.success'));
    } catch (err) {
      toast.error(err.message || t('pricing.preparing'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{t('pricing.title')}</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{t('pricing.subtitle')}</p>
      </div>

      <div className="card !p-8">
        <div className="flex flex-col items-center">
          <span className="inline-block rounded-full bg-sunshine-100 px-4 py-1.5 text-xs font-black text-sunshine-700 ring-1 ring-sunshine-200">
            {t('pricing.monthlyPlan')}
          </span>
          <div className="mt-6 flex items-end gap-2">
            <span className="text-6xl font-black text-slate-900">{total}</span>
            <span className="pb-2 text-lg font-bold text-slate-400">{t('common.egpMonth')}</span>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {posts} {t('pricing.postsMonthly')} = {posts * 30} {t('pricing.monthlyPosts')}
          </p>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <label htmlFor="posts_slider" className="text-sm font-extrabold text-slate-700">
              {t('pricing.dailyPosts')}
            </label>
            <span className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-black text-brand-700 ring-1 ring-brand-200">
              {posts}
            </span>
          </div>
          <input
            id="posts_slider"
            type="range"
            min={1}
            max={10}
            value={posts}
            onChange={(e) => setPosts(Number(e.target.value))}
            className="mt-4 w-full cursor-pointer accent-brand-600"
          />
          <div className="mt-2 flex justify-between text-xs font-bold text-slate-400">
            <span>1 {t('common.post')}</span>
            <span>5 {t('common.posts')}</span>
            <span>10 {t('common.posts')}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between text-sm font-bold text-slate-600">
            <span>{t('pricing.basePrice')}</span>
            <span>{BASE_PRICE} {t('common.egp')}</span>
          </div>
          {posts > 5 && (
            <div className="mt-2 flex items-center justify-between text-sm font-bold text-slate-600">
              <span>{t('pricing.extraPosts')} ({posts - 5} × {EXTRA_PRICE})</span>
              <span>{(posts - 5) * EXTRA_PRICE} {t('common.egp')}</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
            <span>{t('pricing.totalMonthly')}</span>
            <span className="text-brand-700">{total} {t('common.egp')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="btn-accent mt-8 w-full !py-4 !text-base"
        >
          {loading ? <Spinner light size="sm" /> : null}
          {loading ? t('pricing.preparing') : t('pricing.checkout')}
        </button>
      </div>

      {checkout && (
        <div className="card !border-emerald-200 !bg-emerald-50 animate-slide-up">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="flex-1">
              <h3 className="font-black text-emerald-800">{t('pricing.success')}</h3>
              <p className="mt-1 text-sm leading-7 text-emerald-700">{checkout.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={checkout.checkout_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2.5"
                >
                  {t('pricing.goToPayment')}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-black text-emerald-700 ring-1 ring-emerald-200">
                  {t('pricing.amount')} {checkout.total_amount_egp}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: t('pricing.secure'), desc: t('pricing.secureDesc'), icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          )},
          { title: t('pricing.cancel'), desc: t('pricing.cancelDesc'), icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )},
          { title: t('pricing.instant'), desc: t('pricing.instantDesc'), icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        ].map((item) => (
          <div key={item.title} className="card flex items-center gap-4 !p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              {item.icon}
            </span>
            <div>
              <p className="font-black text-slate-800">{item.title}</p>
              <p className="text-xs font-semibold text-slate-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}