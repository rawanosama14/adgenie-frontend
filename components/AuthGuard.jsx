'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
export function AuthGuard({ children }) {
  const { isAuthed, ready } = useAuth();
  const router = useRouter(); const pathname = usePathname();
  useEffect(() => { if (ready && !isAuthed) router.replace(`/login?next=${encodeURIComponent(pathname)}`); }, [ready, isAuthed, router, pathname]);
  if (!ready || !isAuthed) return <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115]" />;
  return children;
}
export function PublicOnly({ children }) {
  const { isAuthed, ready } = useAuth(); const router = useRouter();
  useEffect(() => { if (ready && isAuthed) router.replace('/dashboard'); }, [ready, isAuthed, router]);
  if (!ready || isAuthed) return <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115]" />;
  return children;
}
