import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLanguage } from '../i18n';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

export default function Drafts() {
  const { language } = useLanguage();
  const toast = useToast();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const copy = language === 'en'
    ? {
        title: 'Drafts', subtitle: 'Continue unfinished campaign ideas without losing your inputs.',
        empty: 'No saved drafts yet.', create: 'Create a campaign', open: 'Continue editing',
        remove: 'Delete', saved: 'Last saved'
      }
    : {
        title: 'المسودات', subtitle: 'كمّل أفكار الحملات غير المكتملة بدون ما تفقد أي مدخلات.',
        empty: 'لا توجد مسودات محفوظة حتى الآن.', create: 'إنشاء حملة', open: 'متابعة التعديل',
        remove: 'حذف', saved: 'آخر حفظ'
      };

  const load = () => {
    setLoading(true);
    api.getDrafts()
      .then((data) => setDrafts(data.drafts || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (draftId) => {
    try {
      await api.deleteDraft(draftId);
      setDrafts((items) => items.filter((item) => item.draft_id !== draftId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{copy.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <Link to="/dashboard/generator" className="btn-primary">{copy.create}</Link>
      </div>

      {loading ? (
        <div className="card flex justify-center py-16"><Spinner size="lg" /></div>
      ) : drafts.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="font-semibold text-slate-600">{copy.empty}</p>
          <Link to="/dashboard/generator" className="btn-primary mt-5">{copy.create}</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => {
            const payload = draft.payload || {};
            const date = draft.updated_at ? new Date(draft.updated_at) : null;
            return (
              <article key={draft.draft_id} className="card flex min-h-48 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="mb-2 inline-flex rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">Draft</span>
                    <h2 className="text-lg font-bold text-slate-900">{draft.name || payload.brand_name || 'Untitled draft'}</h2>
                    <p className="mt-1 text-sm text-slate-500">{payload.brand_niche || payload.campaign_goal || '—'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(draft.draft_id)}
                    className="fluent-icon-button !h-9 !w-9"
                    title={copy.remove}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12m-9 0V5h6v2m-8 0 1 12h8l1-12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-auto pt-6">
                  <p className="mb-3 text-xs text-slate-400">
                    {copy.saved}: {date ? date.toLocaleString(language === 'en' ? 'en-US' : 'ar-EG') : '—'}
                  </p>
                  <Link to={`/dashboard/generator?draft=${encodeURIComponent(draft.draft_id)}`} className="btn-outline w-full">
                    {copy.open}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
