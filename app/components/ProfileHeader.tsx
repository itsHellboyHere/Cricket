
import Image from 'next/image';


export function ProfileHeader({ user }: { 
  user: { 
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
    bio?: string | null;
  } 
}) 


{
  // console.log("User ",user)
  return (
    <div className="flex gap-8 items-start">
      <div className="relative w-32 h-32 rounded-full overflow-hidden">
        <Image
          src={user.image || '/default-avatar.png'}
          alt={`${user.name}'s avatar`}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-gray-500">@{user.username}</p>
        {user.bio && <p className="mt-4 text-gray-700">{user.bio}</p>}
        

      </div>
    </div>
  );
}