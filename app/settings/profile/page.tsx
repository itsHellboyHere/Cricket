'use client'
import AvatarUpload from "@/app/components/AvatarUpload";
import { useSession } from "next-auth/react";

import { redirect } from "next/navigation";
export default  function ProfileSettingsPage(){

  const { data: session, status } = useSession();
   if (status === "loading") return <div>Loading...</div>;
  if (!session?.user) redirect("/login");
    return (
        <div className="max-w-2xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
            <AvatarUpload
            currentImage={session?.user?.image}
            userId={session?.user?.id}
            />
        </div>
    )
}