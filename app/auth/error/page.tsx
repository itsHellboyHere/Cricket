

import AuthErrorPage from '@/app/components/AuthErrorpage';
import { Suspense } from 'react';


export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <AuthErrorPage />
    </Suspense>
  );
}
