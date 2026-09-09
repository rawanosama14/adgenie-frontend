'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredHqUser } from '@/lib/api';
import Icon from '@/components/ui/Icon';

export default function HQ({standalone=false}){
  const router=useRouter();
  const [data,setData]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState('');
  const hqUser=getStoredHqUser();
  const load=()=>api.getHqOverview().then(setData).catch(e=>setErr(e.message));
  useEffect(()=>{load()},[]);
  const decide=async(id,status)=>{setBusy(id+status);setErr('');try{await api.decideSubscription(id,status);await load()}catch(e){setErr(e.message)}finally{setBusy('')}};
  const logout=()=>{api.hqLogout();router.replace('/hq/login')};
  const m=data?.metrics||{};
  const content=<div className="hq-content"><section className="hq-hero"><div><small>ADGENIE / COMPANY CONTROL PLANE</small><h1>Company HQ</h1><p>إدارة المستخدمين والاشتراكات والاستخدام والنشر من مساحة إدارية منفصلة عن Workspace.</p></div><div className="hq-admin-chip"><Icon name="crown"/><div><b>{hqUser?.name||'HQ Admin'}</b><span>{hqUser?.email}</span></div></div></section>{err&&<div className="notice">{err}</div>}<section className="metric-grid">{[['users','المستخدمون',m.users],['crown','اشتراكات نشطة',m.active_subscriptions],['sparkles','إجمالي الحملات',m.campaigns],['ads','إعلانات منشورة',m.published_ads]].map(([i,t,v])=><article className="metric-card" key={t}><div className="metric-icon"><Icon name={i}/></div><div><small>{t}</small><strong>{v??'…'}</strong></div></article>)}</section><section className="panel"><div className="panel-head"><div><small>SUBSCRIPTION REQUESTS</small><h3>طلبات التفعيل</h3></div><span className="status warning">{m.pending_requests||0} pending</span></div><div className="table-wrap"><table><thead><tr><th>المستخدم</th><th>الباقة</th><th>الحالة</th><th>تاريخ الطلب</th><th>إجراء</th></tr></thead><tbody>{(data?.requests||[]).map(r=><tr key={r.request_id}><td>{r.owner_email}</td><td>{r.plan_id}</td><td><span className={`status ${r.status==='approved'?'success':r.status==='pending'?'warning':'neutral'}`}>{r.status}</span></td><td>{new Date(r.created_at).toLocaleString('ar-EG')}</td><td>{r.status==='pending'?<div className="row-actions"><button disabled={busy} onClick={()=>decide(r.request_id,'approved')}>تفعيل</button><button className="reject" disabled={busy} onClick={()=>decide(r.request_id,'rejected')}>رفض</button></div>:'—'}</td></tr>)}</tbody></table></div></section><section className="panel"><div className="panel-head"><div><small>USERS</small><h3>آخر المستخدمين</h3></div></div><div className="table-wrap"><table><thead><tr><th>الاسم</th><th>Email</th><th>Plan</th><th>Projects</th><th>Campaigns</th></tr></thead><tbody>{(data?.users||[]).map(u=><tr key={u.email}><td>{u.name||'—'}</td><td>{u.email}</td><td>{u.plan}</td><td>{u.projects_count}</td><td>{u.campaigns_count}</td></tr>)}</tbody></table></div></section></div>;
  if(!standalone)return content;
  return <div className="hq-app" dir="rtl"><aside className="hq-side"><div className="hq-side-brand"><img src="/logo.png" alt="AdGenie"/><div><b>AdGenie</b><span>Company HQ</span></div></div><nav><div className="active"><Icon name="crown"/> Control Plane</div><a href="/dashboard"><Icon name="dashboard"/> Workspace</a></nav><button onClick={logout}><Icon name="logout"/> تسجيل خروج HQ</button></aside><main className="hq-main">{content}</main></div>
}
