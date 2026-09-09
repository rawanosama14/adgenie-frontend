import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { api } from '../api';
import { useLanguage } from '../i18n';

export default function PaymentCallback() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const paymentState = searchParams.get('payment');
  const [status, setStatus] = useState(paymentState === 'cancelled' ? 'cancelled' : 'checking');

  useEffect(() => {
    if (paymentState === 'cancelled') return undefined;
    let attempts = 0;
    let timer;
    const checkSubscription = async () => {
      attempts += 1;
      try {
        const data = await api.getSubscriptionStatus();
        if (data.subscription?.active) {
          setStatus('success');
          return;
        }
      } catch {
        setStatus('error');
        return;
      }
      if (attempts < 10) timer = setTimeout(checkSubscription, 3000);
      else setStatus('pending');
    };
    checkSubscription();
    return () => clearTimeout(timer);
  }, [paymentState]);

  const content = {
    checking: { title: t('payment.checking'), text: t('payment.checkingText') },
    success: { title: t('payment.success'), text: t('payment.successText') },
    cancelled: { title: t('payment.cancelled'), text: t('payment.cancelledText') },
    pending: { title: t('payment.pending'), text: t('payment.pendingText') },
    error: { title: t('payment.error'), text: t('payment.errorText') },
  }[status];

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 py-12">
      <div className="card w-full text-center">
        {status === 'checking' && <Spinner size="lg" />}
        {status === 'success' && <div className="text-5xl text-emerald-500">✓</div>}
        {status === 'cancelled' && <div className="text-5xl text-amber-500">!</div>}
        {(status === 'pending' || status === 'error') && <div className="text-5xl text-slate-400">i</div>}
        <h1 className="mt-5 text-2xl font-black text-slate-900">{content.title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">{content.text}</p>
        <Link to="/dashboard/pricing" className="btn-primary mt-6 inline-flex">
          {t('payment.backToPricing')}
        </Link>
      </div>
    </div>
  );
}
