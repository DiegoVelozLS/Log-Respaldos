import { getSession } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return redirect('/');
  }

  switch (user.role) {
    case 'administrator':
      redirect('/admin');
      break;
    case 'supervisor':
      redirect('/supervisor');
      break;
    case 'technician':
      redirect('/technician');
      break;
    default:
      return redirect('/');
  }
}
