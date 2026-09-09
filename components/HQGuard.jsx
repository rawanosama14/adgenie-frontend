'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, getHqToken } from '@/lib/api';

export default function HQGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState('checking');

  useEffect(() => {
    if (!getHqToken()) {
      router.replace(`/hq/login?next=${encodeURIComponent(pathname || '/hq')}`);
      return;
    }
    api.getHqOverview()
      .then(() => setState('ready'))
      .catch(() => {
        api.hqLogout();
        router.replace('/hq/login');
      });
  }, [pathname, router]);

  if (state !== 'ready') return <div className="hq-loading">Verifying HQ access…</div>;
  return children;
}
