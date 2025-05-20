'use client'

import { useSession } from "next-auth/react"
import { useActionState, useEffect } from "react"
import { updateProfileInfo, UpdateProfileState } from "../actions/actions"


export default function ProfileInfoForm() {
  const { data: session, status,update } = useSession()
  const initialState: UpdateProfileState = { 
    message: null, 
    errors: {}, 
    success: false 
  }
  
  
  const updateProfileWithId = updateProfileInfo.bind(null, session?.user?.id ?? '')
  
  const [state, formAction, isPending] = useActionState(updateProfileWithId, initialState)

  // Set success message when the form successfully submits
  useEffect(() => {
    if(state.success && state.updatedData){
      update({
        ...session?.user,
        username: state.updatedData.username,
        name: state.updatedData.name,
        bio: state.updatedData.bio
      })

    }
    if (state.success) {
      const timer = setTimeout(() => {

        if (state.message) {
           
          state.message = null 
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [state])

  


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Profile Information
      </h2>

      {/* Success message */}
      {state.success && state.message && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
          {state.message}
        </div>
      )}

      {/* Error message */}
      {!state.success && state.message && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={session?.user.username || ''}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
              state.errors?.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
            aria-describedby="username-error"
          />
          {state.errors?.username && (
            <div id="username-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {state.errors.username.join(', ')}
            </div>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={session?.user.name || ''}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
              state.errors?.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            aria-describedby="name-error"
          />
          {state.errors?.name && (
            <div id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {state.errors.name.join(', ')}
            </div>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={session?.user.bio || ''}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
              state.errors?.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Tell us about yourself..."
            aria-describedby="bio-error"
          />
          {state.errors?.bio && (
            <div id="bio-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {state.errors.bio.join(', ')}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 rounded-md text-white ${
              isPending ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            aria-disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}