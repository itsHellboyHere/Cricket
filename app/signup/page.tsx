// app/signup/page.tsx
import { Suspense } from 'react';
import SignupClient from '../components/signup-client';

export  default async function SignupPage() {
  return (
    <Suspense>
      <SignupClient />
    </Suspense>
  );
}