'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Icon from '@/components/ui/Icon';

export default function Dashboard(){
 const [state,setState]=useState({brands:[],campaigns:[],sub:null,ads:[]}); const [loading,setLoading]=useState(true);
 useEffect(()=>{Promise.allSettled([api.getBrands(),api.getCampaigns(),api.getSubscriptionStatus(),api.getPublishedAds()]).then(r=>{setState({brands:r[0].value?.brands||[],campaigns:r[1].value?.campaigns||[],sub:r[2].value||null,ads:r[3].value?.published_ads||[]});setLoading(false);});},[]);
 const latest=state.campaigns[0]; const usage=state.sub?.usage||{}; const plan=state.sub?.subscription||{};
 const stats=[['project','المشاريع',`${usage.projects||0}/${usage.projects_limit||'—'}`],['sparkles','حملات هذا الشهر',`${usage.campaigns_this_month||0}/${usage.campaigns_limit||'—'}`],['ads','إعلانات منشورة',state.ads.filter(a=>a.status==='published').length],['crown','الباقة',plan.name_ar||plan.id||'Starter']];
 const readiness=useMemo(()=>{let v=0;if(state.brands.length)v+=40;if(state.campaigns.length)v+=30;if(state.ads.length)v+=30;return v;},[state]);
 return <div className="dashboard-stack">
   <section className="command-hero"><div><div className="eyebrow dark"><span className="pulse-dot"/> SaaS Campaign Control</div><h2>كل مشروع، كل حملة، وكل إعلان في مساحة واحدة.</h2><p>ابدأ من تعريف البراند، ثم أنشئ الحملة واعتمد أفضل تصور، وبعدها انشره وتابع سجل الإعلانات.</p><div className="hero-actions"><Link className="premium-button" href="/dashboard/generator">إنشاء حملة <Icon name="sparkles"/></Link><Link className="glass-button" href="/dashboard/projects">إدارة المشاريع</Link></div></div><div className="readiness-orbit"><div className="orbit-ring"/><div className="orbit-core"><b>{readiness}%</b><span>جاهزية الحساب</span></div></div></section>
   <section className="metric-grid">{stats.map(([i,t,v])=><article className="metric-card" key={t}><div className="metric-icon"><Icon name={i}/></div><div><small>{t}</small><strong>{loading?'…':v}</strong></div></article>)}</section>
   <section className="dashboard-two-col"><div className="panel"><div className="panel-head"><div><small>PROJECTS</small><h3>مشاريعك</h3></div><Link href="/dashboard/projects">عرض الكل</Link></div>{state.brands.length?<div className="project-list">{state.brands.slice(0,4).map(b=><div className="project-row" key={b.brand_id}><div className="project-avatar">{b.logo_url?<img src={b.logo_url} alt=""/>:<span>{(b.brand_name||'P')[0]}</span>}</div><div><b>{b.brand_name}</b><small>{b.industry||'لم يتم تحديد المجال'}</small></div><span className={b.onboarding_complete?'status success':'status warning'}>{b.onboarding_complete?'جاهز':'غير مكتمل'}</span></div>)}</div>:<Empty title="لا توجد مشاريع بعد" href="/dashboard/projects"/>}</div>
   <div className="panel"><div className="panel-head"><div><small>LATEST CAMPAIGN</small><h3>آخر حملة</h3></div><Link href="/dashboard/ads">سجل الإعلانات</Link></div>{latest?<div className="latest-campaign"><div className="campaign-preview">{latest.selected_variation?.image_output?<img src={latest.selected_variation.image_output} alt=""/>:<div><Icon name="sparkles" size={32}/></div>}</div><div><span className="status neutral">{latest.campaign_status||'generated'}</span><h4>{latest.brand_name||'Campaign'}</h4><p>{latest.brief?.campaign_goal||'—'}</p><small>{new Date(latest.created_at).toLocaleDateString('ar-EG')}</small></div></div>:<Empty title="لم تنشئ حملة بعد" href="/dashboard/generator"/>}</div></section>
 </div>;
}
function Empty({title,href}){return <div className="empty-state"><Icon name="sparkles" size={28}/><b>{title}</b><Link href={href}>ابدأ الآن</Link></div>}
