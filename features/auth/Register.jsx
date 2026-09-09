'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Spinner from '@/components/Spinner';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';


const INITIAL = {
  email: '',
  password: '',
  brand_name: '',
  fb_page_id: '',
  fb_access_token: '',
  ig_user_id: ''
};

export default function Register() {
  const { registerAndLogin } = useAuth();
  const { t, language } = useLanguage();
  const toast = useToast();
  const router = useRouter();

  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    if (form.password.length < 12) {
      toast.error(t('auth.passwordMin'));
      return;
    }
    setLoading(true);
    try {
      await registerAndLogin({
        email: form.email,
        password: form.password,
        brand_name: form.brand_name,
        fb_page_id: form.fb_page_id,
        fb_access_token: form.fb_access_token,
        ig_user_id: form.ig_user_id,
        language
      });
      toast.success(t('auth.registerSuccess'));
      router.replace('/dashboard');
    } catch (err) {
      toast.error(err.message || t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-bl from-brand-50 via-white to-accent-50 dark:from-[#0d2235] dark:via-[#0f1115] dark:to-[#221532] px-4 py-10">
      <div className="fixed end-4 top-4 z-20 flex items-center gap-2"><ThemeToggle /><LanguageToggle className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm dark:border-[#303641] dark:bg-[#171a21] dark:text-slate-300" /></div>
      <div className="pointer-events-none fixed -left-24 -top-24 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent-300/30 blur-3xl" />

      <div className="relative w-full max-w-xl animate-slide-up">
        <div className="card !p-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-soft ring-2 ring-brand-100">
              <img src="/logo.png" alt={t('auth.logoAlt')} className="h-16 w-16 object-contain" />
            </span>
            <h1 className="mt-5 text-2xl font-black text-slate-900">{t('auth.createAccountTitle')}</h1>
            <p className="mt-2 text-sm text-slate-500">{t('auth.createAccountSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="label-field">{t('auth.emailStar')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field text-start"
                />
              </div>
              <div>
                <label htmlFor="password" className="label-field">{t('auth.passwordStar')}</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field ps-11 text-start"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-brand-600"
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="brand_name" className="label-field">{t('auth.brandName')}</label>
              <input
                id="brand_name"
                name="brand_name"
                type="text"
                placeholder={t('generator.brandNamePlaceholder')}
                value={form.brand_name}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowMeta((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-dashed border-brand-300 bg-brand-50/60 px-4 py-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l8.5-4.9" />
                  </svg>
                  {t('auth.connectMeta')}
                </span>
                <svg
                  className={`h-5 w-5 transition-transform ${showMeta ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMeta && (
                <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 animate-fade-in">
                  <div>
                    <label htmlFor="fb_page_id" className="label-field">{t('auth.pageId')}</label>
                    <input
                      id="fb_page_id"
                      name="fb_page_id"
                      type="text"
                      dir="ltr"
                      placeholder="123456789012345"
                      value={form.fb_page_id}
                      onChange={handleChange}
                      className="input-field text-start"
                    />
                  </div>
                  <div>
                    <label htmlFor="fb_access_token" className="label-field">{t('auth.accessToken')}</label>
                    <input
                      id="fb_access_token"
                      name="fb_access_token"
                      type="text"
                      dir="ltr"
                      placeholder="EAABsb..."
                      value={form.fb_access_token}
                      onChange={handleChange}
                      className="input-field text-start"
                    />
                  </div>
                  <div>
                    <label htmlFor="ig_user_id" className="label-field">{t('auth.igUserId')}</label>
                    <input
                      id="ig_user_id"
                      name="ig_user_id"
                      type="text"
                      dir="ltr"
                      placeholder="1784140..."
                      value={form.ig_user_id}
                      onChange={handleChange}
                      className="input-field text-start"
                    />
                  </div>
                  <p className="text-xs leading-6 text-slate-400">{t('auth.metaHint')}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-accent w-full !py-3.5">
              {loading ? <Spinner light size="sm" /> : null}
              {loading ? t('auth.creatingAccount') : t('auth.register')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {t('auth.haveAccount')}{' '}
            <Link href="/login" className="font-extrabold text-brand-600 hover:text-brand-700">
              {t('auth.loginLink')}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/" className="font-bold text-slate-500 transition-colors hover:text-brand-600">
            ← {t('auth.backToHome')}
          </Link>
        </p>
      </div>
    </div>
  );
}