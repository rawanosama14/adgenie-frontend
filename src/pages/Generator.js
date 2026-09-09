import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast';
import { useLanguage } from '../i18n';
import Spinner from '../components/Spinner';

const HOURS = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM', '09:00 PM', '11:00 PM'];
const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn'];
const BASE_PRICE = 1000;
const EXTRA_PRICE = 200;

function FieldCard({ title, hint, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 dark:border-[#303641] dark:bg-[#171a21] ${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function VariationCard({ variation, selected, onSelect, language }) {
  const copy = language === 'en'
    ? { selected: 'Selected', use: 'Use this ad', score: 'Quality score', prompt: 'Image prompt' }
    : { selected: 'المختار', use: 'استخدم الإعلان', score: 'درجة الجودة', prompt: 'برومبت الصورة' };

  return (
    <article className={`card overflow-hidden !p-0 ${selected ? 'ring-2 ring-brand-500' : ''}`}>
      <div className="relative aspect-square bg-slate-100 dark:bg-[#11151b]">
        {variation.image_output ? (
          <img src={variation.image_output} alt={`Ad variation ${variation.variation_id}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
        )}
        <span className="absolute end-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
          #{variation.variation_id}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{variation.marketing_angle}</p>
          {variation.qa_score != null && (
            <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {copy.score}: {variation.qa_score}%
            </span>
          )}
        </div>
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{variation.ad_copy}</p>
        <details className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-[#11151b]">
          <summary className="cursor-pointer font-semibold">{copy.prompt}</summary>
          <p className="mt-2 leading-6">{variation.image_prompt}</p>
        </details>
        <button
          type="button"
          onClick={() => onSelect(variation.variation_id)}
          className={selected ? 'btn-primary mt-4 w-full' : 'btn-outline mt-4 w-full'}
        >
          {selected ? copy.selected : copy.use}
        </button>
      </div>
    </article>
  );
}

export default function Generator() {
  const toast = useToast();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const draftFromUrl = searchParams.get('draft');

  const ui = language === 'en' ? {
    workflow: 'Ad creation workflow', brandInputs: 'Brand inputs', promptLogic: 'Prompt logic', ai: 'AI generation', review: 'Review variations', draft: 'Save draft', publish: 'Publish',
    architecture: 'Prompt Architecture', architectureDesc: 'Inputs are normalized into one reusable campaign brief before any AI agent runs.',
    audience: 'Target audience', audienceHint: 'Who should this ad speak to?', platform: 'Platform / channel', objective: 'Campaign objective', offer: 'Offer', visual: 'Visual style', cta: 'Call to action', constraints: 'Constraints / brand rules',
    audiencePh: 'Example: fitness enthusiasts, 20–35, Egypt', objectivePh: 'Example: drive purchases from the website', offerPh: 'Example: 20% off first order', visualPh: 'Example: modern, bright, energetic', ctaPh: 'Example: Shop now', constraintsPh: 'Use brand colors, avoid competitor mentions, do not invent claims...',
    save: 'Save Draft', saving: 'Saving…', saved: 'Draft saved', loadFail: 'Could not load draft', saveFail: 'Could not save draft',
    generate: 'Generate Ads', generating: 'Generating…', quality: 'Quality guardrails', qualityDesc: 'No invented claims • niche relevance • distinct A/B hooks • brand constraints enforced',
    variants: 'Generated variations', drafts: 'View drafts', autosave: 'Drafts are stored separately from generated campaigns.',
    required: 'Brand name, niche and description are required.', noHours: 'Choose at least one publishing time.'
  } : {
    workflow: 'مسار إنشاء الإعلان', brandInputs: 'مدخلات البراند', promptLogic: 'منطق البرومبت', ai: 'توليد الذكاء الاصطناعي', review: 'مراجعة التنويعات', draft: 'حفظ مسودة', publish: 'النشر',
    architecture: 'بنية البرومبت', architectureDesc: 'كل المدخلات بتتوحّد في Brief منظم وثابت قبل تشغيل أي Agent، بدل برومبتات عشوائية متفرقة.',
    audience: 'الجمهور المستهدف', audienceHint: 'الإعلان بيكلم مين بالضبط؟', platform: 'المنصة / القناة', objective: 'هدف الحملة التفصيلي', offer: 'العرض', visual: 'الأسلوب البصري', cta: 'الدعوة لاتخاذ إجراء', constraints: 'قيود وقواعد البراند',
    audiencePh: 'مثال: مهتمين باللياقة من 20–35 سنة في مصر', objectivePh: 'مثال: زيادة المشتريات من الموقع', offerPh: 'مثال: خصم 20% على أول طلب', visualPh: 'مثال: مودرن، مشرق، حيوي', ctaPh: 'مثال: اطلب الآن', constraintsPh: 'استخدم ألوان البراند، ممنوع ذكر المنافسين، لا تخترع ادعاءات...',
    save: 'حفظ كمسودة', saving: 'جارٍ الحفظ…', saved: 'تم حفظ المسودة', loadFail: 'تعذر تحميل المسودة', saveFail: 'تعذر حفظ المسودة',
    generate: 'توليد الإعلانات', generating: 'جارٍ التوليد…', quality: 'قواعد الجودة', qualityDesc: 'بدون ادعاءات مخترعة • مرتبط بالمجال • زوايا A/B مختلفة • الالتزام بقواعد البراند',
    variants: 'التنويعات المولدة', drafts: 'عرض المسودات', autosave: 'المسودات محفوظة بشكل مستقل عن الحملات التي تم توليدها.',
    required: 'اسم البراند والمجال والوصف حقول مطلوبة.', noHours: 'اختر وقت نشر واحد على الأقل.'
  };

  const campaignGoals = useMemo(() => [
    t('goal.increaseSales'), t('goal.brandAwareness'), t('goal.newCustomers'), t('goal.newProduct'), t('goal.engagement')
  ], [t]);
  const brandVoices = useMemo(() => [
    t('voice.friendly'), t('voice.formal'), t('voice.energetic'), t('voice.humorous')
  ], [t]);

  const [form, setForm] = useState({
    brand_name: '', brand_niche: '', brand_description: '', campaign_goal: campaignGoals[0],
    brand_voice: brandVoices[0], target_audience: '', platforms: ['Instagram', 'Facebook'],
    campaign_objective: '', offer: '', visual_style: '', cta: '', constraints: '',
    daily_posts_count: 5, auto_publish: false
  });
  const [products, setProducts] = useState([]);
  const [productInput, setProductInput] = useState('');
  const [hours, setHours] = useState(['09:00 AM', '07:00 PM']);
  const [draftId, setDraftId] = useState(draftFromUrl || null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveAgentLog, setLiveAgentLog] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    if (!draftFromUrl) return;
    api.getDraft(draftFromUrl)
      .then((data) => {
        const payload = data.draft?.payload || {};
        setForm((current) => ({ ...current, ...payload, platforms: payload.platforms || current.platforms }));
        setProducts(payload.new_products || []);
        setHours(payload.custom_hours || ['09:00 AM', '07:00 PM']);
        setDraftId(data.draft?.draft_id || draftFromUrl);
        setLastSavedAt(data.draft?.updated_at || null);
      })
      .catch((err) => toast.error(err.message || ui.loadFail));
  }, [draftFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const monthlyPrice = BASE_PRICE + Math.max(0, form.daily_posts_count - 5) * EXTRA_PRICE;
  const variations = result?.ab_testing_variations || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: name === 'daily_posts_count' ? Number(value) : value }));
  };

  const togglePlatform = (platform) => {
    setForm((current) => ({
      ...current,
      platforms: current.platforms.includes(platform)
        ? current.platforms.filter((item) => item !== platform)
        : [...current.platforms, platform]
    }));
  };

  const toggleHour = (hour) => setHours((current) => current.includes(hour) ? current.filter((item) => item !== hour) : [...current, hour]);
  const addProduct = () => {
    const value = productInput.trim();
    if (value && !products.some((item) => item.toLowerCase() === value.toLowerCase())) setProducts((items) => [...items, value]);
    setProductInput('');
  };

  const buildPayload = () => ({
    ...form,
    brand_name: form.brand_name.trim(),
    brand_niche: form.brand_niche.trim(),
    brand_description: form.brand_description.trim(),
    target_audience: form.target_audience.trim(),
    campaign_objective: form.campaign_objective.trim(),
    offer: form.offer.trim(),
    visual_style: form.visual_style.trim(),
    cta: form.cta.trim(),
    constraints: form.constraints.trim(),
    new_products: products,
    custom_hours: hours,
    language
  });

  const saveDraft = async () => {
    setSavingDraft(true);
    try {
      const payload = buildPayload();
      const data = await api.saveDraft({
        draft_id: draftId,
        name: payload.brand_name || (language === 'en' ? 'Untitled campaign' : 'حملة بدون اسم'),
        payload
      });
      const id = data.draft?.draft_id;
      if (id) {
        setDraftId(id);
        setSearchParams({ draft: id }, { replace: true });
      }
      setLastSavedAt(data.draft?.updated_at || new Date().toISOString());
      toast.success(ui.saved);
    } catch (err) {
      toast.error(err.message || ui.saveFail);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload.brand_name || !payload.brand_niche || !payload.brand_description) {
      toast.error(ui.required); return;
    }
    if (!hours.length) { toast.error(ui.noHours); return; }

    setLoading(true); setResult(null); setSelectedVariation(null); setLiveAgentLog([]);
    try {
      const data = await api.generateCampaignStream(payload, setLiveAgentLog);
      setResult(data);
      toast.success(t('generator.success'));
    } catch (err) {
      toast.error(err.message || t('generator.failed'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [ui.brandInputs, ui.promptLogic, ui.ai, ui.review, ui.draft, ui.publish];

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('generator.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{t('generator.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/drafts" className="btn-outline">{ui.drafts}</Link>
          <button type="button" onClick={saveDraft} disabled={savingDraft} className="btn-outline">
            {savingDraft ? <Spinner size="sm" /> : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M5 4h12l2 2v14H5zM8 4v6h8V4M8 16h8" /></svg>
            )}
            {savingDraft ? ui.saving : ui.save}
          </button>
        </div>
      </div>

      <section className="fluent-panel p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">{ui.workflow}</p>
            <p className="mt-0.5 text-xs text-slate-400">{ui.autosave}{lastSavedAt ? ` • ${new Date(lastSavedAt).toLocaleString(language === 'en' ? 'en-US' : 'ar-EG')}` : ''}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <span className={`workflow-step ${index < 2 ? 'is-active' : ''}`}><span>{index + 1}</span>{step}</span>
              {index < steps.length - 1 && <span className="self-center text-slate-300">›</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="card !p-5 sm:!p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{ui.architecture}</h2>
              <p className="mt-1 text-sm text-slate-500">{ui.architectureDesc}</p>
            </div>
            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">{ui.quality}: Active</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <FieldCard title={t('generator.brandName')}>
              <input name="brand_name" value={form.brand_name} onChange={handleChange} className="input-field" placeholder={t('generator.brandNamePlaceholder')} />
            </FieldCard>
            <FieldCard title={t('generator.niche')}>
              <input name="brand_niche" value={form.brand_niche} onChange={handleChange} className="input-field" placeholder={t('generator.nichePlaceholder')} />
            </FieldCard>
            <FieldCard title={ui.audience} hint={ui.audienceHint}>
              <input name="target_audience" value={form.target_audience} onChange={handleChange} className="input-field" placeholder={ui.audiencePh} />
            </FieldCard>

            <FieldCard title={t('generator.goal')}>
              <select name="campaign_goal" value={form.campaign_goal} onChange={handleChange} className="input-field">
                {campaignGoals.map((goal) => <option key={goal} value={goal}>{goal}</option>)}
              </select>
            </FieldCard>
            <FieldCard title={ui.objective}>
              <input name="campaign_objective" value={form.campaign_objective} onChange={handleChange} className="input-field" placeholder={ui.objectivePh} />
            </FieldCard>
            <FieldCard title={ui.offer}>
              <input name="offer" value={form.offer} onChange={handleChange} className="input-field" placeholder={ui.offerPh} />
            </FieldCard>

            <FieldCard title={t('generator.voice')}>
              <select name="brand_voice" value={form.brand_voice} onChange={handleChange} className="input-field">
                {brandVoices.map((voice) => <option key={voice} value={voice}>{voice}</option>)}
              </select>
            </FieldCard>
            <FieldCard title={ui.visual}>
              <input name="visual_style" value={form.visual_style} onChange={handleChange} className="input-field" placeholder={ui.visualPh} />
            </FieldCard>
            <FieldCard title={ui.cta}>
              <input name="cta" value={form.cta} onChange={handleChange} className="input-field" placeholder={ui.ctaPh} />
            </FieldCard>

            <FieldCard title={ui.platform} className="lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => {
                  const active = form.platforms.includes(platform);
                  return <button key={platform} type="button" onClick={() => togglePlatform(platform)} className={active ? 'btn-primary !px-3 !py-2' : 'btn-outline !px-3 !py-2'}>{platform}</button>;
                })}
              </div>
            </FieldCard>
            <FieldCard title={ui.quality} hint={ui.qualityDesc}>
              <div className="flex h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-500 dark:border-[#303641] dark:bg-[#11151b]">QA + retry loop enabled</div>
            </FieldCard>

            <FieldCard title={t('generator.description')} className="lg:col-span-2">
              <textarea name="brand_description" rows={4} value={form.brand_description} onChange={handleChange} className="input-field resize-none" placeholder={t('generator.descriptionPlaceholder')} />
            </FieldCard>
            <FieldCard title={ui.constraints}>
              <textarea name="constraints" rows={4} value={form.constraints} onChange={handleChange} className="input-field resize-none" placeholder={ui.constraintsPh} />
            </FieldCard>
          </div>
        </section>

        <section className="card !p-5 sm:!p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <label className="label-field">{t('generator.products')}</label>
              <div className="flex gap-2">
                <input value={productInput} onChange={(e) => setProductInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addProduct(); } }} className="input-field" placeholder={t('generator.productPlaceholder')} />
                <button type="button" onClick={addProduct} className="btn-outline">{t('generator.addProduct')}</button>
              </div>
              {!!products.length && <div className="mt-3 flex flex-wrap gap-2">{products.map((product) => <button type="button" key={product} onClick={() => setProducts((items) => items.filter((item) => item !== product))} className="rounded-md bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">{product} ×</button>)}</div>}
            </div>

            <div>
              <div className="flex items-center justify-between"><label className="label-field !mb-0">{t('generator.dailyPosts')}</label><span className="text-sm font-bold text-brand-600">{form.daily_posts_count}</span></div>
              <input name="daily_posts_count" type="range" min="1" max="10" value={form.daily_posts_count} onChange={handleChange} className="mt-5 w-full accent-brand-600" />
              <p className="mt-3 text-sm text-slate-500">{t('generator.monthlyPrice')} <strong className="text-slate-800">{monthlyPrice} {t('common.egp')}</strong></p>
            </div>

            <div>
              <label className="label-field">{t('generator.publishHours')}</label>
              <div className="grid grid-cols-4 gap-2">{HOURS.map((hour) => <button key={hour} type="button" onClick={() => toggleHour(hour)} className={hours.includes(hour) ? 'rounded-lg bg-brand-600 px-2 py-2 text-xs font-semibold text-white' : 'rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-500 dark:border-[#303641] dark:bg-[#171a21]'}>{hour}</button>)}</div>
              <label className="mt-4 flex items-start gap-2 text-sm text-slate-600"><input type="checkbox" checked={form.auto_publish} onChange={(e) => setForm((current) => ({ ...current, auto_publish: e.target.checked }))} className="mt-1 accent-brand-600" />{t('generator.autoPublish')}</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5 dark:border-[#303641]">
            <button type="submit" disabled={loading} className="btn-primary !px-8">
              {loading ? <Spinner light size="sm" /> : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM18 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" /></svg>}
              {loading ? ui.generating : ui.generate}
            </button>
          </div>
        </section>
      </form>

      {loading && (
        <section className="card">
          <div className="flex items-center gap-4"><Spinner size="lg" /><div><h3 className="font-bold text-slate-900">{t('generator.generatingTitle')}</h3><p className="mt-1 text-sm text-slate-500">{t('generator.generatingDesc')}</p></div></div>
          {!!liveAgentLog.length && <div className="mt-5 flex flex-wrap gap-2">{liveAgentLog.map((step, index) => <span key={`${step.agent}-${index}`} className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${step.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-brand-50 text-brand-700'}`}>{step.agent}{step.qa_score != null ? ` · ${step.qa_score}%` : ''}</span>)}</div>}
        </section>
      )}

      {result && !loading && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-2xl font-bold text-slate-900">{ui.variants}</h2><p className="mt-1 text-sm text-slate-500">{result.analytics_notification?.message}</p></div>
            {selectedVariation && <Link to="/dashboard/pricing" className="btn-primary">{t('generator.proceedToPayment')}</Link>}
          </div>
          {result.prompt_architecture && (
            <div className="fluent-panel p-4 text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{ui.architecture}:</span> {result.prompt_architecture.target_audience || '—'} · {(result.prompt_architecture.platforms || []).join(', ') || '—'} · {result.prompt_architecture.offer || '—'}
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{variations.map((variation) => <VariationCard key={variation.variation_id} variation={variation} selected={selectedVariation === variation.variation_id} onSelect={setSelectedVariation} language={language} />)}</div>
        </section>
      )}
    </div>
  );
}
