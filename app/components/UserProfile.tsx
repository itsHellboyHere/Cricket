import Link from 'next/link';
import Image from 'next/image';
import styles from '../ui/HomeNavbar.module.css';

import { User } from 'next-auth';



export function UserProfile({ user }: { user:User}) {
  return (
    <div className={styles.userProfile}>
      <Link href={`/profile/${user.username}`} className={styles.profileLink}>
        {user.image && (
          <div className='w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 mr-2'>
          <Image
            src={user.image}
            alt={user.name || 'Profile'}
            width={35}
            height={35}
            className="w-full h-full object-cover"
          />
          </div>
        )}
        <span className={styles.username}>{user.name?.split(' ')[0]}</span>
      </Link>
    </div>
  );
}