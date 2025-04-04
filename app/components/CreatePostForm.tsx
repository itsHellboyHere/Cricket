'use client';
import { createPost, State } from "../actions/actions";
import { useRef, useState } from "react";
import { UploadButton } from "../utils/uploadthing";
import { useActionState } from "react";

export default function CreatePostForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: State = { message: null, errors: {} };


  const handleSubmit = async (prevState: State, formData: FormData) => {
    if (imageUrl) formData.append("imageUrl", imageUrl);
    return await createPost(prevState, formData);
  };
  
  // useActionState hook to manage the form state
  const [state, formAction] = useActionState(handleSubmit, initialState);
  console.log("State",state.errors?.imageUrl)
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      
      <form ref={formRef} action={formAction} className="space-y-3">
        <div>
          <input
            name="title"
            placeholder="Post title"
            className="w-full p-2 border rounded"
            // required
            aria-describedby="title-error"

          />
         <div id="title-error" aria-live="polite" aria-atomic="true">
        {state.errors?.title &&
          state.errors.title.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
        </div>

        {/* <textarea
          name="content"
          placeholder="What's happening in cricket?"
          className="w-full p-2 border rounded"
          rows={3}
        />
        {state?.errors?.content && (
          <p className="text-red-500 text-sm">{state.errors.content}</p>
        )} */}

        <div className="space-y-2" aria-describedby="imageurl-error">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                setImageUrl(res[0].ufsUrl);
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
       <div id="imageurl-error" aria-live="polite" aria-atomic="true">
        {state.errors?.imageUrl &&
          state.errors.imageUrl.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
          {imageUrl && (
            <div className="relative h-48 mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="rounded object-cover h-full w-full"
              />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>
    </div>
  );
}
