'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Icon from '@/components/ui/Icon';

const featureCards = [
  ['project','Brand Intelligence','يبني ملفًا عميقًا لكل مشروع: الهوية، الجمهور، العرض، القيود، أسلوب الكتابة والاتجاه البصري.'],
  ['sparkles','Three Distinct Directions','كل حملة تنتج 3 إعلانات مختلفة فعلاً في الفكرة والزاوية والصورة، مع بقاء الجميع داخل هوية البراند.'],
  ['link','Meta Publishing','اربط Facebook وInstagram من داخل المنصة، اختر الإعلان المعتمد، وانشره مع سجل واضح للحالة.'],
  ['trend','Generation Theatre','تجربة توليد ثلاثية الأبعاد وحركة محسوبة تجعل مرحلة الانتظار جزءًا فاخرًا من المنتج.'],
  ['ads','Ad Library','كل إعلان تم اعتماده أو نشره محفوظ داخل حسابك مع المنصة والحالة والتاريخ.'],
  ['users','Company HQ','لوحة إدارة للشركة لمتابعة المستخدمين والاشتراكات والحملات وطلبات التفعيل.'],
];

export default function Landing(){
  const [plans,setPlans]=useState([]);
  useEffect(()=>{ api.getPlans().then(d=>setPlans(d.plans||[])).catch(()=>{}); },[]);
  return <main className="landing-page" dir="rtl">
    <nav className="landing-nav glass-bar">
      <Link href="/" className="brand-mark"><img src="/logo.png" alt="AdGenie"/><div><strong>AdGenie</strong><span>AI Advertising OS</span></div></Link>
      <div className="landing-links"><a href="#product">المنتج</a><a href="#workflow">كيف يعمل</a><a href="#pricing">الباقات</a></div>
      <div className="nav-actions"><Link href="/login" className="text-button">تسجيل الدخول</Link><Link href="/register" className="premium-button">ابدأ الآن <Icon name="arrow" size={17}/></Link></div>
    </nav>

    <section className="hero-premium">
      <div className="hero-grid-bg"/>
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse-dot"/> منصة SaaS للحملات الإعلانية المدعومة بالذكاء الاصطناعي</div>
        <h1>من هوية البراند إلى إعلان <span>جاهز للنشر.</span></h1>
        <p>AdGenie يفهم مشروعك أولاً، يبني Brief دقيق، يولد ثلاث اتجاهات بصرية وكتابية مختلفة، ثم يحفظ اختيارك وينشره على Meta من نفس مساحة العمل.</p>
        <div className="hero-actions"><Link href="/register" className="premium-button large">أنشئ حسابك <Icon name="arrow"/></Link><a href="#workflow" className="glass-button large">شاهد رحلة الحملة</a></div>
        <div className="proof-row"><span><b>3</b> اتجاهات لكل حملة</span><span><b>1</b> Brand Brain لكل مشروع</span><span><b>Meta</b> Publishing</span></div>
      </div>
      <div className="hero-stage" aria-label="AdGenie mascot">
        <div className="stage-ring ring-one"/><div className="stage-ring ring-two"/><div className="stage-glow"/>
        <img src="/logo.png" className="mascot-3d" alt="AdGenie mascot"/>
        <div className="floating-chip chip-a"><Icon name="sparkles"/> Brand Brain</div>
        <div className="floating-chip chip-b"><Icon name="trend"/> 3 Creative Routes</div>
        <div className="floating-chip chip-c"><Icon name="link"/> Meta Ready</div>
      </div>
    </section>

    <section className="trust-strip"><span>Brand Context</span><i/> <span>Campaign Brief</span><i/> <span>AI Creative</span><i/> <span>Human Selection</span><i/> <span>Meta Publishing</span></section>

    <section id="product" className="section-shell">
      <div className="section-kicker">المنتج</div><h2>مش مجرد مولّد صور. <span>نظام تشغيل للحملات.</span></h2>
      <div className="feature-grid">{featureCards.map(([icon,title,desc])=><article className="premium-card" key={title}><div className="icon-tile"><Icon name={icon}/></div><h3>{title}</h3><p>{desc}</p></article>)}</div>
    </section>

    <section id="workflow" className="section-shell workflow-section">
      <div className="section-kicker">رحلة العمل</div><h2>من الحساب إلى النشر في <span>مسار واضح.</span></h2>
      <div className="workflow-line">{[
        ['01','أنشئ مشروعك','ارفع اللوجو وعرّف المنتج والجمهور والهوية والمنافسين.'],
        ['02','اكتب هدف الحملة','حدد الهدف، العرض، المنصات، CTA وأي قيود ضرورية.'],
        ['03','شاهد التوليد','المحرك يحلل البراند ويكوّن 3 اتجاهات مختلفة بصريًا وكتابيًا.'],
        ['04','اعتمد وانشر','اختر إعلانًا واحدًا، اربط Meta، ثم انشره وراقب حالته.'],
      ].map(([n,t,d])=><div className="workflow-item" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
    </section>

    <section id="pricing" className="section-shell pricing-section">
      <div className="section-kicker">الباقات</div><h2>ابدأ بحجمك الحالي، <span>وتوسع بدون تغيير النظام.</span></h2>
      <div className="pricing-grid">{(plans.length?plans:[{id:'starter',name_ar:'Starter',price_egp:990,projects:1,campaigns_monthly:12,features_ar:[]},{id:'growth',name_ar:'Growth',price_egp:2490,projects:5,campaigns_monthly:60,features_ar:[],recommended:true},{id:'scale',name_ar:'Scale',price_egp:4990,projects:20,campaigns_monthly:250,features_ar:[]}]).map(p=><article className={`price-card ${p.recommended?'recommended':''}`} key={p.id}>{p.recommended&&<div className="recommended-tag">الأكثر توازنًا</div>}<h3>{p.name_ar}</h3><div className="price"><b>{p.price_egp?.toLocaleString('en-US')}</b><span>جنيه / شهر</span></div><ul><li><Icon name="check"/> حتى {p.projects} مشروع</li><li><Icon name="check"/> {p.campaigns_monthly} حملة شهريًا</li><li><Icon name="check"/> 3 اتجاهات لكل حملة</li>{(p.features_ar||[]).slice(2).map(f=><li key={f}><Icon name="check"/>{f}</li>)}</ul><Link href="/register" className={p.recommended?'premium-button wide':'glass-button wide'}>اختيار الباقة</Link></article>)}</div>
    </section>

    <section className="final-cta"><div><span>AdGenie</span><h2>اعمل من براندك نظام إعلانات قابل للتكرار.</h2><p>سجّل حسابك، أنشئ أول مشروع، وخلي كل حملة تبدأ من فهم حقيقي للبراند بدل Prompt عشوائي.</p></div><Link href="/register" className="premium-button large">ابدأ الآن <Icon name="arrow"/></Link></section>
    <footer className="landing-footer"><div className="brand-mark"><img src="/logo.png" alt="AdGenie"/><div><strong>AdGenie</strong><span>AI Advertising OS</span></div></div><span>© 2026 AdGenie. All rights reserved.</span></footer>
  </main>;
}
