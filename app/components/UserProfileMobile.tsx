import Link from 'next/link';
import Image from 'next/image';
import styles from '../ui/HomeNavbar.module.css';

export function UserProfileMobile({ user, onClose }: { user: any, onClose: () => void }) {
  return (
    <div className={styles.userProfileMobile}>
      <Link href="/profile" className={styles.mobileProfileLink} onClick={onClose}>
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'Profile'}
            width={32}
            height={32}
            className={styles.profileImage}
          />
        )}
        <span>My Profile</span>
      </Link>
    </div>
  );
}