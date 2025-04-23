
import AvatarUpload from "@/app/components/AvatarUpload";
import ProfileInfoForm from "@/app/components/ProfileInfoForm";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default async function ProfileSettingsPage() {
  // const { data: session, status } = useSession();
  // const session = await auth();
  // if (status === "loading") return <div>Loading...</div>;
  // if (!session?.user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Profile Settings
      </h1>
      
      <div className="space-y-8">
        
          <AvatarUpload
            // currentImage={session.user.image}
            // userId={session?.user.id}
          />
    

  
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Update your profile information below.
          </div>
          <ProfileInfoForm />
     
      </div>
    </div>
  )
}