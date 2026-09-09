import { Suspense } from 'react';
import Login from '@/features/auth/Login';
import { PublicOnly } from '@/components/AuthGuard';
export default function LoginPage(){ return <PublicOnly><Suspense fallback={null}><Login /></Suspense></PublicOnly>; }
