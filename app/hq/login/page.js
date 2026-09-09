'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Icon from '@/components/ui/Icon';

function HQLoginInner(){
  const router=useRouter(), params=useSearchParams();
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  const submit=async(e)=>{e.preventDefault();setBusy(true);setErr('');try{await api.hqLogin(email,password);router.replace(params.get('next')||'/hq')}catch(ex){setErr(ex.message||'تعذر تسجيل الدخول إلى HQ')}finally{setBusy(false)}};
  return <main className="hq-login-page" dir="rtl"><section className="hq-login-card"><div className="hq-login-brand"><img src="/logo.png" alt="AdGenie"/><div><small>ADGENIE CONTROL PLANE</small><h1>Company HQ</h1></div></div><p>مسار إداري منفصل. لا يمكن الدخول إليه بحساب Workspace عادي.</p>{err&&<div className="hq-login-error">{err}</div>}<form onSubmit={submit}><label><span>البريد الإداري</span><input type="email" dir="ltr" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label><label><span>كلمة المرور</span><input type="password" dir="ltr" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button disabled={busy}>{busy?'جارٍ التحقق…':'دخول Company HQ'}<Icon name="crown"/></button></form><a href="/">العودة إلى الموقع</a></section></main>
}
export default function HQLoginPage(){return <Suspense fallback={null}><HQLoginInner/></Suspense>}
