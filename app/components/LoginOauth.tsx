'use client'
import { Suspense, useEffect } from "react";
import LoginForm from "./login-form";
import { signInWithGithub, signInWithGoogle } from "../actions/actions";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginOauth(){
    const searchParams = useSearchParams()
      const error = searchParams.get('error');

  useEffect(() => {
    if (error === 'OAuthAccountNotLinked') {
      toast.error(
        'This email is already associated with another account. Please sign in with the original method or use a different email.',
        { 
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '16px',
          },
        }
      );
    }
  }, [error]);
    return(
        <main className="flex  items-center justify-center min-h-screen bg-gray-50">
             
              <div className="w-full max-w-md p-8  space-y-6 bg-white rounded-xl shadow-md">
                <div className="flex flex-col items-center">
                  {/* <div className="mb-6">
                    <AcmeLogo />
                  </div> */}
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                  <p className="text-gray-500">Sign in to your account</p>
                </div>
                   <div className="grid grid-cols-2 gap-4">
                  <form
                    action={signInWithGithub}
                    className="w-full"
                  >
                    <button
                      type="submit"
                      className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaGithub className="w-5 h-5" />
                      <span>GitHub</span>
                    </button>
                  </form>
        
                  <form
                    action={signInWithGoogle}
                    className="w-full"
                  >
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
                    <span className="px-2 bg-white text-gray-500">OR LOG IN WITH YOUR EMAIL</span>
                  </div>
                </div>
      
                  <LoginForm />
              
        
             
        
             
        
                <div className="text-sm text-center text-gray-500">
                  Don't have an account?{' '}
                  <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up
                  </a>
                </div>
              </div>
            </main>
    )
}