import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useToast } from '../components/Toast';
import { useLanguage } from '../i18n';
import Spinner from '../components/Spinner';
import logo from '../assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success(t('auth.loginSuccess'));
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-brand-50 via-white to-accent-50 p-4">
      <div className="pointer-events-none fixed -left-24 -top-24 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent-300/30 blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="card !p-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-soft ring-2 ring-brand-100">
              <img src={logo} alt={t('auth.logoAlt')} className="h-16 w-16 object-contain" />
            </span>
            <h1 className="mt-5 text-2xl font-black text-slate-900">{t('auth.welcome')}</h1>
            <p className="mt-2 text-sm text-slate-500">{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="label-field">{t('auth.email')}</label>
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
              <label htmlFor="password" className="label-field">{t('auth.password')}</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  autoComplete="current-password"
                  required
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

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? <Spinner light size="sm" /> : null}
              {loading ? t('auth.loggingIn') : t('auth.login')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-extrabold text-brand-600 hover:text-brand-700">
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/" className="font-bold text-slate-500 transition-colors hover:text-brand-600">
            ← {t('auth.backToHome')}
          </Link>
        </p>
      </div>
    </div>
  );
}