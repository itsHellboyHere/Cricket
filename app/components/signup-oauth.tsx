
'use client';

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signInWithGithub,signInWithGoogle } from '../actions/actions';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function SignupOAuth() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error === 'OAuthAccountNotLinked') {
      toast.error(
        'This email is already associated with another account. Please sign in instead.',
        { 
          duration: 6000,
          position: 'top-center',
        }
      );
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <form action={signInWithGithub} className="w-full">
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaGithub className="w-5 h-5" />
            <span>GitHub</span>
          </button>
        </form>

        <form action={signInWithGoogle} className="w-full">
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaGoogle className="w-5 h-5 text-red-500" />
            <span>Google</span>
          </button>
        </form>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR SIGN UP WITH EMAIL</span>
        </div>
      </div>
    </div>
  );
}