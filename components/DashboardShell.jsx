'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ThemeToggle from '@/components/ThemeToggle';
import Icon from '@/components/ui/Icon';

const items=[
  ['/dashboard','dashboard','نظرة عامة'],['/dashboard/projects','project','المشاريع'],['/dashboard/generator','sparkles','إنشاء حملة'],['/dashboard/ads','ads','الإعلانات'],['/dashboard/integrations','link','الربط والنشر'],['/dashboard/billing','card','الاشتراك']
];

function Sidebar({close}){
 const path=usePathname(), router=useRouter(), {user,logout}=useAuth();
 const doLogout=()=>{logout();router.replace('/login');};
 return <div className="saas-sidebar" dir="rtl">
   <div className="sidebar-head"><Link href="/dashboard" className="brand-mark"><img src="/logo.png" alt="AdGenie"/><div><strong>AdGenie</strong><span>Creative OS</span></div></Link></div>
   <nav>{items.map(([href,icon,label])=><Link onClick={close} href={href} key={href} className={path===href?'active':''}><Icon name={icon}/><span>{label}</span>{path===href&&<i/>}</Link>)}</nav>
   <div className="sidebar-foot"><div className="user-mini"><span>{(user?.name||user?.email||'A').slice(0,1).toUpperCase()}</span><div><b>{user?.name||'AdGenie User'}</b><small>{user?.email}</small></div></div><button onClick={doLogout}><Icon name="logout"/> تسجيل الخروج</button></div>
 </div>;
}

export default function DashboardShell({children}){
 const [open,setOpen]=useState(false); const pathname=usePathname();
 const titles={'/dashboard':'نظرة عامة','/dashboard/projects':'المشاريع','/dashboard/generator':'إنشاء حملة','/dashboard/ads':'الإعلانات','/dashboard/integrations':'الربط والنشر','/dashboard/billing':'الاشتراك'};
 return <div className="saas-app" dir="rtl"><aside className="desktop-sidebar"><Sidebar/></aside>{open&&<div className="mobile-drawer"><button className="drawer-backdrop" onClick={()=>setOpen(false)}/><aside><Sidebar close={()=>setOpen(false)}/></aside></div>}<div className="saas-main"><header className="saas-topbar"><div><button className="icon-button mobile-menu" onClick={()=>setOpen(true)}><Icon name="menu"/></button><div><small>AdGenie Workspace</small><h1>{titles[pathname]||'Workspace'}</h1></div></div><div className="topbar-actions"><div className="system-status"><i/> AI services ready</div><ThemeToggle/></div></header><main className="workspace-content">{children}</main></div></div>;
}
