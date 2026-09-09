import Register from '@/features/auth/Register';
import { PublicOnly } from '@/components/AuthGuard';
export default function RegisterPage(){ return <PublicOnly><Register /></PublicOnly>; }
