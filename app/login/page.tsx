import AcmeLogo from '../ui/acme-logo';
import LoginForm from '../components/login-form';
import { Suspense } from 'react';
import { signIn } from '../../auth';
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
         <form
        action={async () => {
          'use server';
          await signIn('github', { redirectTo: '/posts' });
        }}
      >
        <button type="submit">Sign in with GitHub</button>
      </form>
      </div>
    </main>
  );
}