import Link from 'next/link';
import Image from 'next/image';
import styles from '../ui/HomeNavbar.module.css';
import { User } from 'next-auth';


export function UserProfileMobile({ user, onClose }: { user:User, onClose: () => void }) {
  return (
    <div className={styles.userProfileMobile}>
      <Link href={`/profile/${user.username}`} className={styles.mobileProfileLink} onClick={onClose}>
        {user.image && (
          <div className='w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 mr-2'>
          <Image
            src={user.image}
            alt={user.name || 'Profile'}
            width={33}
            height={33}
            className="w-full h-full object-cover"
          />
          </div>
        )}
        <span>My Profile</span>
      </Link>
    </div>
  );
}