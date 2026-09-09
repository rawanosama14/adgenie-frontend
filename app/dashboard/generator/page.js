import { Suspense } from 'react';
import Generator from '@/features/generator/Generator';
export default function Page(){ return <Suspense fallback={null}><Generator /></Suspense>; }
