// app/components/signup-form.tsx
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { lusitana } from '../ui/fonts';
import {
  UserIcon,
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../ui/button';
import { authenticate, signUp, SignUpState } from '../actions/actions';
import { useRouter, useSearchParams } from 'next/navigation';


export default function SignupForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/posts';
  // console.log("callback",callbackUrl)
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(signUp, {
    errors: undefined,
    message: null,
    success: false,
    credentials: undefined
  });
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  useEffect(() => {
    if (state?.success && state.credentials && !isAutoLoggingIn) {
      setIsAutoLoggingIn(true);
      const formData = new FormData()
      formData.set('email', state.credentials.email);
      formData.set('password', state.credentials.password);
      // Automatically log in the new user
      authenticate(undefined, formData)
        .then(() => router.push('/posts'))
        .catch(() => {
          // If auto-login fails, redirect to login page
          router.push('/login');
        })
        .finally(() => setIsAutoLoggingIn(false));
    }
  }, [state, router, isAutoLoggingIn])


  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Create your account
        </h1>
        {/* Add username field */}
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="username"
          >
            Username
          </label>
          <div className="relative">
            <input
              className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${state?.errors?.username ? 'border-red-500' : ''
                }`}
              id="username"
              type="text"
              name="username"
              placeholder="Choose a unique username"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state?.errors?.username && (
            <p className="mt-1 text-xs text-red-500">{state.errors.username[0]}</p>
          )}
        </div>
        <div className="w-full">
          {/* Name Field */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${state?.errors?.name ? 'border-red-500' : ''
                  }`}
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.name && (
              <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${state?.errors?.email ? 'border-red-500' : ''
                  }`}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.email && (
              <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${state?.errors?.password ? 'border-red-500' : ''
                  }`}
                id="password"
                type="password"
                name="password"
                placeholder="Enter password (min 6 characters)"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.password && (
              <p className="mt-1 text-xs text-red-500">
                {state.errors.password[0]}
              </p>
            )}
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button
          className="mt-4 w-full"
          aria-disabled={isPending || isAutoLoggingIn}
        >
          {isAutoLoggingIn ? 'Logging you in...' : 'Sign up'}
          {!isAutoLoggingIn && <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />}
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state?.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}