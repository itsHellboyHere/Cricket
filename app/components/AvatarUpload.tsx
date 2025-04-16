'use client'
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import router from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { updateProfilePicture } from '../actions/actions';
import { useSession } from 'next-auth/react';


export default function AvatarUpload({currentImage,
  userId}:{
    currentImage?:string | null;
    userId:string;
  }) {
   const {update , data:session} = useSession();
    
    const [isLoading, setIsLoading] = useState(false);
    const image = session?.user?.image || currentImage || "/default-avatar.png";
    const handleSuccess = async (result: any) => {

        setIsLoading(true);

        try {
            
                  const imageUrl = `${result.info.secure_url}?t=${Date.now()}`;
            const { success, error } = await updateProfilePicture(userId, imageUrl);

            if (!success) {
                throw new Error(error || "Failed to update avatar");
            }
          
          
            toast.success('Avatar updated successfully!');

            await update({image:imageUrl})
            // router.refresh()

        } catch (err: unknown) {
           const error = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                        src={image}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 24rem"
                        onError={(e) => {
                            e.currentTarget.src = '/default-avatar.png';
                        }}
                    />
                </div>

                <div>
                    <CldUploadButton
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        onSuccess={handleSuccess}
                        onError={() => toast.error('Upload failed')}
                        options={{
                            maxFileSize: 2 * 1024 * 1024, // 2MB
                            sources: ['local'],
                            multiple: false,
                            resourceType: 'image',
                            cropping: true,
                            croppingAspectRatio: 1, // Square aspect ratio
                            croppingShowBackButton: true,
                            croppingCoordinatesMode: 'custom',
                        }}
                    >
                        <span
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition inline-block"
                            aria-disabled={isLoading}
                        >
                            {isLoading ? 'Uploading...' : 'Change Avatar'}
                        </span>
                    </CldUploadButton>

                    <p className="mt-2 text-sm text-gray-500">
                        JPG, PNG up to 2MB
                    </p>
                </div>
            </div>
        </div>
    );
}