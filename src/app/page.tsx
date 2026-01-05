import LoginForm from '@/components/auth/login-form';
import Logo from '@/components/logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12 text-primary" />
          <h1 className="font-headline text-3xl font-bold tracking-tighter">
            Backup Sentinel
          </h1>
          <p className="text-muted-foreground">
            Inicie sesión para registrar y monitorear respaldos.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Usuario por defecto: <span className="font-medium text-foreground">admin@listosoft.com</span> / <span className="font-medium text-foreground">12345</span>
        </p>
      </div>
    </main>
  );
}
