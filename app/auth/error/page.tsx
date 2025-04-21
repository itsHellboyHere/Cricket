
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    'This email is already associated with another account. Please sign in using the original method.',
  CredentialsSignin: 'Invalid email or password. Please try again.',
  AccessDenied: 'You do not have permission to sign in. Please try again.',
  default: 'Something went wrong during authentication. Please try again.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = errorMessages[error as keyof typeof errorMessages] || errorMessages.default;
console.log("error ",error)
  const router = useRouter();

  useEffect(() => {
    toast.error(message);
    const timeout = setTimeout(() => {
      router.push('/login');
    }, 4000);
    return () => clearTimeout(timeout);
  }, [error,message]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center items-center mb-4 text-red-500">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 inline-flex items-center justify-center px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Go back to Login
        </button>
      </div>
    </main>
  );
}
