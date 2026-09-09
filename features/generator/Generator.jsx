'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Icon from '@/components/ui/Icon';

const initial = {
  brand_id: '',
  campaign_goal: '',
  objective: '',
  offer: '',
  platforms: ['facebook', 'instagram'],
  cta: '',
  notes: '',
  output_language: 'ar',
};

const wizardSteps = [
  { kicker: 'BRAND CONTEXT', title: 'نبدأ بأي مشروع؟', hint: 'هستخدم Brand Brain المحفوظ للمشروع كمرجع أساسي لكل النصوص والصور.' },
  { kicker: 'CAMPAIGN GOAL', title: 'عايز الحملة تحقق إيه بالضبط؟', hint: 'اكتب النتيجة اللي عايز توصل لها ومين المفروض يتفاعل معها.' },
  { kicker: 'OBJECTIVE', title: 'إيه نوع النتيجة اللي هنقيس عليها؟', hint: 'اختيار الـ Objective بيساعد ChatGPT يبني الزوايا الإعلانية والـ CTA بشكل أدق.' },
  { kicker: 'CORE MESSAGE', title: 'إيه العرض أو الرسالة الأساسية؟', hint: 'حط السعر أو العرض فقط لو حقيقي ومتاح. لو مفيش عرض، اكتب القيمة الأساسية اللي عايز تبرزها.' },
  { kicker: 'ACTION & CHANNELS', title: 'العميل يعمل إيه بعد الإعلان؟', hint: 'حدد الـ CTA والمنصات اللي هينزل عليها الإعلان.' },
  { kicker: 'CREATIVE DIRECTION', title: 'آخر لمسة قبل ما نبدأ.', hint: 'اكتب أي قيود أو اتجاه بصري مهم. ChatGPT هيستخدمها في النص والصورة معًا.' },
];

const generationPhases = [
  'فهم Brand Brain',
  'بناء استراتيجية الحملة',
  'كتابة 3 اتجاهات مختلفة',
  'تصميم المشاهد البصرية',
  'فحص الاتساق والجودة',
  'توليد الصور عبر OpenAI',
  'تجهيز النتائج النهائية',
];

const objectiveOptions = ['Leads', 'Sales', 'Messages', 'Awareness', 'Traffic'];

export default function Generator() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState('');
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState('');
  const [imageBusy, setImageBusy] = useState('');

  useEffect(() => {
    api.getBrands()
      .then((data) => {
        const list = data.brands || [];
        setBrands(list);
        if (list[0]) setForm((f) => ({ ...f, brand_id: f.brand_id || list[0].brand_id }));
      })
      .catch((e) => setMsg(e.message));
  }, []);

  const selectedBrand = useMemo(
    () => brands.find((b) => b.brand_id === form.brand_id),
    [brands, form.brand_id]
  );
  const campaignId = result?.campaign_id || result?.data?.campaign_id;
  const variations = result?.ab_testing_variations || result?.data?.ab_testing_variations || [];
  const selectedVariation = useMemo(
    () => variations.find((v) => Number(v.variation_id) === Number(selected)),
    [variations, selected]
  );

  const syncDrafts = (vars) => {
    setDrafts(Object.fromEntries((vars || []).map((v) => [v.variation_id, v.ad_copy || v.copy || ''])));
  };

  const validateStep = () => {
    if (step === 0 && !form.brand_id) return 'اختار مشروع الأول.';
    if (step === 1 && form.campaign_goal.trim().length < 20) return 'اكتب هدف الحملة بتفاصيل أكتر شوية عشان التوليد يطلع قوي.';
    if (step === 2 && !form.objective.trim()) return 'اختار Objective أو اكتبه.';
    if (step === 4 && !form.platforms.length) return 'اختار منصة واحدة على الأقل.';
    return '';
  };

  const next = () => {
    const error = validateStep();
    if (error) return setMsg(error);
    setMsg('');
    setStep((s) => Math.min(wizardSteps.length - 1, s + 1));
  };

  const back = () => {
    setMsg('');
    setStep((s) => Math.max(0, s - 1));
  };

  const run = async () => {
    const error = validateStep();
    if (error) return setMsg(error);
    if (!form.brand_id) return setMsg('أنشئ مشروعًا أولاً.');
    setLoading(true);
    setResult(null);
    setSelected(null);
    setProgress([]);
    setMsg('');
    setDrafts({});
    try {
      const data = await api.generateCampaignStream(form, (log) => setProgress(log || []));
      setResult(data);
      syncDrafts(data?.ab_testing_variations || data?.data?.ab_testing_variations || []);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const choose = async (variation) => {
    if (!campaignId) return;
    setMsg('');
    try {
      await api.selectCampaignVariation(campaignId, variation.variation_id);
      setSelected(variation.variation_id);
      setMsg('تم اعتماد الاتجاه. عدّل النسخة النهائية من الـ Ad Editor تحت الكروت ثم احفظها.');
      setTimeout(() => document.getElementById('selected-ad-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (e) {
      setMsg(e.message);
    }
  };

  const saveCopy = async (variation) => {
    if (!campaignId) return;
    const copy = (drafts[variation.variation_id] || '').trim();
    if (copy.length < 20) return setMsg('النص قصير جدًا للحفظ.');
    setSaving(String(variation.variation_id));
    setMsg('');
    try {
      await api.updateCampaignVariation(campaignId, variation.variation_id, copy);
      setResult((r) => ({
        ...r,
        ab_testing_variations: (r.ab_testing_variations || []).map((x) =>
          x.variation_id === variation.variation_id ? { ...x, ad_copy: copy } : x
        ),
      }));
      setMsg('تم حفظ النسخة المعدلة وربطها بالإعلان المعتمد.');
    } catch (e) {
      setMsg(e.message);
    } finally {
      setSaving('');
    }
  };

  const regenerateImage = async (variation) => {
    if (!campaignId) return;
    setImageBusy(String(variation.variation_id));
    setMsg('OpenAI بيولد صورة جديدة للاتجاه المختار…');
    try {
      const data = await api.regenerateCampaignImage(campaignId, variation.variation_id);
      const newVariation = data.variation;
      setResult((r) => ({
        ...r,
        ab_testing_variations: (r.ab_testing_variations || []).map((x) =>
          x.variation_id === variation.variation_id ? { ...x, ...newVariation } : x
        ),
      }));
      setMsg('تم توليد الصورة الجديدة وحفظها.');
    } catch (e) {
      setMsg(e.message);
    } finally {
      setImageBusy('');
    }
  };

  const resetStudio = () => {
    setResult(null);
    setSelected(null);
    setProgress([]);
    setStep(0);
    setMsg('');
  };

  return (
    <div className="dashboard-stack campaign-studio-v2">
      <section className="page-intro campaign-intro-v2">
        <div>
          <span>OPENAI CAMPAIGN STUDIO</span>
          <h2>من Brief بسيط إلى 3 إعلانات كاملة، خطوة بخطوة.</h2>
          <p>ChatGPT يفهم Brand Brain، يكتب 3 زوايا طويلة ومختلفة، ثم يولد صورة حقيقية لكل اتجاه بنفس سياق البراند.</p>
        </div>
        {result && <button className="secondary-button" onClick={resetStudio}>حملة جديدة</button>}
      </section>

      {msg && <div className="notice">{msg}</div>}

      {!loading && !result && (
        <section className="campaign-wizard-shell">
          <div className="wizard-planet-column">
            <CampaignPlanet mode="wizard" step={step} />
            <div className="planet-caption">
              <span>{String(step + 1).padStart(2, '0')} / {String(wizardSteps.length).padStart(2, '0')}</span>
              <b>{wizardSteps[step].kicker}</b>
            </div>
          </div>

          <div className="wizard-question-card">
            <div className="wizard-progress-line">
              {wizardSteps.map((_, i) => <i key={i} className={i <= step ? 'active' : ''} />)}
            </div>
            <div className="wizard-copy">
              <small>{wizardSteps[step].kicker}</small>
              <h3>{wizardSteps[step].title}</h3>
              <p>{wizardSteps[step].hint}</p>
            </div>

            <div className="wizard-fields">{renderStepFields({ step, form, setForm, brands, selectedBrand })}</div>

            <div className="wizard-nav">
              <button type="button" className="wizard-back" onClick={back} disabled={step === 0}>
                <Icon name="arrow" size={17} /> السابق
              </button>
              {step < wizardSteps.length - 1 ? (
                <button type="button" className="premium-button wizard-next" onClick={next}>
                  التالي <Icon name="arrow" size={17} />
                </button>
              ) : (
                <button type="button" className="premium-button wizard-next final" onClick={run} disabled={!brands.length}>
                  ابدأ التوليد <Icon name="sparkles" size={17} />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {loading && <GenerationTheatre progress={progress} />}
      {!loading && result && <ResultSummary result={result} />}

      {variations.length > 0 && (
        <section className="results-section results-v2">
          <div className="results-head">
            <div>
              <span>CREATIVE ROUTES</span>
              <h2>3 اتجاهات مختلفة. اختار اللي يمثل البراند أحسن.</h2>
            </div>
            <p>كل Route له استراتيجية وصورة ونص مستقل. مفيش تغيير شكلي لنفس الإعلان.</p>
          </div>

          <div className="variation-grid variation-grid-v2">
            {variations.map((v, i) => {
              const isSelected = Number(selected) === Number(v.variation_id);
              return (
                <article className={`variation-card creative-card-v2 ${isSelected ? 'selected' : ''}`} key={v.variation_id || i}>
                  <div className="variation-image creative-image-v2">
                    {v.image_output ? (
                      <img src={v.image_output} alt={`${v.concept_name || 'Generated ad'} visual`} />
                    ) : (
                      <div className="image-failure">
                        <Icon name="sparkles" />
                        <b>الصورة لم تُولد</b>
                        <small>{v.image_error || 'OpenAI لم يرجع صورة لهذه المحاولة.'}</small>
                        <button onClick={() => regenerateImage(v)} disabled={imageBusy === String(v.variation_id)}>
                          {imageBusy === String(v.variation_id) ? 'جارٍ التوليد…' : 'إعادة التوليد'}
                        </button>
                      </div>
                    )}
                    <div className="route-number">0{i + 1}</div>
                    <div className="creative-score"><Icon name="check" size={13} /> QA {v.qa_score || 85}</div>
                  </div>

                  <div className="variation-body creative-body-v2">
                    <div className="concept-label-row">
                      <span>{v.concept_name || `Creative Route ${i + 1}`}</span>
                      {isSelected && <b>SELECTED</b>}
                    </div>
                    <h3>{v.headline || firstLine(v.ad_copy)}</h3>
                    <p className="strategy-note">{v.strategy_note || v.marketing_angle}</p>
                    <div className="copy-preview-v2">{v.ad_copy || v.copy}</div>
                    <div className="creative-meta-row">
                      <span>{v.cta || 'CTA حسب الـ Brief'}</span>
                      <span>{(v.ad_copy || '').length} حرف</span>
                    </div>
                    <div className="variation-actions v2-actions">
                      {v.image_output && (
                        <button className="ghost-action" onClick={() => regenerateImage(v)} disabled={imageBusy === String(v.variation_id)}>
                          <Icon name="sparkles" size={15} />
                          {imageBusy === String(v.variation_id) ? 'جارٍ التوليد…' : 'صورة جديدة'}
                        </button>
                      )}
                      <button className={isSelected ? 'selected-button' : 'secondary-button'} onClick={() => choose(v)}>
                        <Icon name="check" size={15} />
                        {isSelected ? 'تم الاعتماد' : 'اعتماد الاتجاه'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {selectedVariation && (
        <section id="selected-ad-editor" className="selected-ad-editor panel">
          <div className="selected-editor-head">
            <div>
              <span>FINAL AD EDITOR</span>
              <h2>{selectedVariation.concept_name || 'الإعلان المعتمد'}</h2>
              <p>دي النسخة اللي هتتحفظ للنشر. عدّل النص براحتك من غير ما تعيد توليد الحملة.</p>
            </div>
            <div className="editor-status"><Icon name="check" size={16} /> معتمد</div>
          </div>
          <div className="selected-editor-grid">
            <div className="selected-editor-visual">
              {selectedVariation.image_output ? <img src={selectedVariation.image_output} alt="Selected ad visual" /> : <div className="image-failure"><b>الصورة غير متاحة</b></div>}
              <button className="secondary-button" onClick={() => regenerateImage(selectedVariation)} disabled={imageBusy === String(selectedVariation.variation_id)}>
                <Icon name="sparkles" size={15} /> {imageBusy === String(selectedVariation.variation_id) ? 'جارٍ التوليد…' : 'توليد صورة بديلة'}
              </button>
            </div>
            <div className="copy-editor selected-copy-editor">
              <label>النص النهائي</label>
              <textarea
                value={drafts[selectedVariation.variation_id] ?? selectedVariation.ad_copy ?? ''}
                onChange={(e) => setDrafts((d) => ({ ...d, [selectedVariation.variation_id]: e.target.value }))}
                rows="18"
              />
              <div className="copy-editor-meta">
                <span>{(drafts[selectedVariation.variation_id] || '').length} حرف</span>
                <button onClick={() => saveCopy(selectedVariation)} disabled={saving === String(selectedVariation.variation_id)}>
                  {saving === String(selectedVariation.variation_id) ? 'جارٍ الحفظ…' : 'حفظ النسخة النهائية'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function renderStepFields({ step, form, setForm, brands, selectedBrand }) {
  if (step === 0) {
    return (
      <>
        {brands.length ? (
          <div className="brand-picker-grid">
            {brands.map((b) => (
              <button
                type="button"
                key={b.brand_id}
                className={`brand-picker-card ${form.brand_id === b.brand_id ? 'active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, brand_id: b.brand_id }))}
              >
                <div className="project-avatar">{b.logo_url ? <img src={b.logo_url} alt="" /> : <span>{b.brand_name?.[0]}</span>}</div>
                <div><b>{b.brand_name}</b><small>{b.industry || 'Brand'}</small></div>
                {form.brand_id === b.brand_id && <Icon name="check" size={16} />}
              </button>
            ))}
          </div>
        ) : (
          <div className="wizard-empty-state">
            <b>مفيش مشروع جاهز للتوليد.</b>
            <p>اعمل Brand Brain الأول وبعدين ارجع للحملة.</p>
            <Link href="/dashboard/projects" className="premium-button">إنشاء مشروع</Link>
          </div>
        )}
        {selectedBrand && (
          <div className="wizard-brand-summary">
            <span>Context loaded</span>
            <p>{selectedBrand.description || selectedBrand.product_or_service || 'سيتم استخدام كل بيانات Brand Brain المحفوظة.'}</p>
          </div>
        )}
      </>
    );
  }

  if (step === 1) {
    return (
      <label className="wizard-field-large">
        <span>هدف الحملة</span>
        <textarea
          autoFocus
          rows="7"
          placeholder="مثال: عايز أوصل لأصحاب الجيمات في مصر وأخليهم يطلبوا Demo للنظام. ركز على مشاكل الإدارة اليومية والاشتراكات والحضور والتقارير…"
          value={form.campaign_goal}
          onChange={(e) => setForm((f) => ({ ...f, campaign_goal: e.target.value }))}
        />
        <small>{form.campaign_goal.length} حرف — كل ما الـ brief كان واضح، النتيجة هتكون أدق.</small>
      </label>
    );
  }

  if (step === 2) {
    return (
      <div className="objective-picker">
        {objectiveOptions.map((item) => (
          <button key={item} type="button" className={form.objective === item ? 'active' : ''} onClick={() => setForm((f) => ({ ...f, objective: item }))}>
            <span>{item}</span><Icon name="arrow" size={15} />
          </button>
        ))}
        <label className="wizard-field-compact">
          <span>أو اكتب Objective مختلف</span>
          <input value={objectiveOptions.includes(form.objective) ? '' : form.objective} onChange={(e) => setForm((f) => ({ ...f, objective: e.target.value }))} placeholder="Bookings / App installs / Other" />
        </label>
      </div>
    );
  }

  if (step === 3) {
    return (
      <label className="wizard-field-large">
        <span>العرض / الرسالة الأساسية</span>
        <textarea
          autoFocus
          rows="7"
          placeholder="اكتب العرض الحقيقي أو أهم قيمة عايز توصلها. ممنوع نضيف سعر أو خصم مش موجود هنا أو في Brand Brain."
          value={form.offer}
          onChange={(e) => setForm((f) => ({ ...f, offer: e.target.value }))}
        />
        <small>ممكن تسيبها فاضية لو مفيش عرض محدد.</small>
      </label>
    );
  }

  if (step === 4) {
    return (
      <div className="action-step-grid">
        <label className="wizard-field-compact">
          <span>Call to Action</span>
          <input autoFocus value={form.cta} onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))} placeholder="اطلب Demo / ابعتلنا رسالة / اطلب الآن" />
        </label>
        <div className="wizard-platforms">
          <span>المنصات</span>
          <div className="platform-switches">
            {['facebook', 'instagram'].map((p) => (
              <button
                type="button"
                key={p}
                className={form.platforms.includes(p) ? 'active' : ''}
                onClick={() => setForm((f) => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p] }))}
              >
                <Icon name={p} size={17} /> {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="creative-direction-step">
      <label className="wizard-field-large">
        <span>ملاحظات وقيود إضافية</span>
        <textarea
          autoFocus
          rows="7"
          placeholder="مثال: الصور Photorealistic، بدون نص داخل الصورة، شكل Premium، استخدم بيئة مصرية حديثة، ممنوع اختراع شهادات أو أرقام…"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </label>
      <div className="language-pills">
        <span>لغة الإعلان</span>
        <button type="button" className={form.output_language === 'ar' ? 'active' : ''} onClick={() => setForm((f) => ({ ...f, output_language: 'ar' }))}>العربية</button>
        <button type="button" className={form.output_language === 'en' ? 'active' : ''} onClick={() => setForm((f) => ({ ...f, output_language: 'en' }))}>English</button>
      </div>
    </div>
  );
}

function CampaignPlanet({ mode = 'wizard', step = 0, phase = 0 }) {
  return (
    <div className={`campaign-planet-scene ${mode === 'generation' ? 'generating' : ''}`}>
      <div className="planet-stars s1" /><div className="planet-stars s2" /><div className="planet-stars s3" />
      <div className="planet-ring ring-a" /><div className="planet-ring ring-b" />
      <div className="planet-moon moon-a" /><div className="planet-moon moon-b" />
      <div className="campaign-planet">
        <div className="planet-shade" />
        <div className="planet-texture" />
        <div className="planet-noise" />
        <div className="planet-highlight" />
        <div className="planet-core-mark"><img src="/logo.png" alt="AdGenie" /></div>
      </div>
      {mode === 'generation' && <><div className="planet-scan scan-one" /><div className="planet-scan scan-two" /><div className="planet-energy-wave wave-one" /><div className="planet-energy-wave wave-two" /></>}
      {mode === 'wizard' && <div className="planet-step-chip">STEP {String(step + 1).padStart(2, '0')}</div>}
      {mode === 'generation' && <div className="planet-step-chip">PROCESS {String(phase + 1).padStart(2, '0')}</div>}
    </div>
  );
}

function GenerationTheatre({ progress }) {
  const phase = getGenerationPhase(progress);
  const currentRoute = getCurrentRoute(progress);
  return (
    <section className="generation-theatre-v2">
      <div className="generation-cosmos-grid" />
      <CampaignPlanet mode="generation" phase={phase} />
      <div className="generation-copy-v2">
        <small>OPENAI GENERATION ENGINE</small>
        <h2>{generationPhases[phase]}</h2>
        <p>ChatGPT بيحافظ على نفس Brand Context أثناء الكتابة والتوجيه البصري. الصورة المدفوعة لا يتم توليدها إلا بعد مراجعة الـ prompt لتقليل التكلفة.</p>
        {currentRoute && <div className="generation-route-chip">Creative Route {currentRoute} / 3</div>}
        <div className="generation-timeline">
          {generationPhases.map((name, i) => (
            <div key={name} className={i < phase ? 'done' : i === phase ? 'active' : ''}>
              <span>{i < phase ? <Icon name="check" size={12} /> : i + 1}</span>
              <b>{name}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultSummary({ result }) {
  const vars = result?.ab_testing_variations || [];
  const ready = vars.filter((v) => v.image_output).length;
  const summary = result?.generation_summary || {};
  return (
    <section className="result-summary-v2">
      <div className="result-complete-icon"><Icon name="check" size={28} /></div>
      <div>
        <small>GENERATION COMPLETE</small>
        <h2>الحملة جاهزة للمراجعة.</h2>
        <p>اتعملت 3 Creative Routes منفصلة بالنص والصورة. اختار الاتجاه الأقوى وبعدها عدّل النص النهائي براحتك.</p>
      </div>
      <div className="result-summary-stats">
        <span><b>{vars.length || 3}</b> Creative routes</span>
        <span><b>{ready}/{vars.length || 3}</b> Images ready</span>
        <span><b>{summary.text_model || 'OpenAI'}</b> Copy engine</span>
        <span><b>{summary.image_quality || 'high'}</b> Image quality</span>
      </div>
    </section>
  );
}

function getGenerationPhase(progress) {
  const last = progress?.[progress.length - 1] || {};
  const agent = last.agent || '';
  if (!agent) return 0;
  if (agent.includes('analyzer')) return 0;
  if (agent.includes('timing')) return 1;
  if (agent.includes('text_agent')) return 2;
  if (agent.includes('visual_prompt')) return 3;
  if (agent.includes('qa_agent')) return 4;
  if (agent.includes('image_agent')) return 5;
  if (agent.includes('analytics')) return 6;
  return Math.min(generationPhases.length - 1, Math.floor((progress.length / 18) * generationPhases.length));
}

function getCurrentRoute(progress) {
  const last = progress?.[progress.length - 1] || {};
  if (last.route) return last.route;
  const match = String(last.agent || '').match(/_v(\d+)/);
  return match ? Number(match[1]) : null;
}

function firstLine(text = '') {
  return text.split('\n').find((x) => x.trim())?.replace(/^[-•#*\s]+/, '').slice(0, 140) || 'Creative direction';
}
